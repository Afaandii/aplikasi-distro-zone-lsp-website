package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"errors"

	"gorm.io/gorm"
)

// ==================== Report Admin PG ====================

type reportAdminPGRepository struct{ db *gorm.DB }

func NewReportAdminPGRepository(db *gorm.DB) ReportAdminRepository {
	return &reportAdminPGRepository{db: db}
}

func (r *reportAdminPGRepository) FindAllTransaksi() ([]entity.Transaksi, error) {
	var transaksi []entity.Transaksi
	err := r.db.Preload("Customer").Preload("Kasir").Preload("DetailTransaksi").Preload("DetailTransaksi.Produk").
		Where("status_transaksi = ?", "selesai").Order("created_at DESC").Find(&transaksi).Error
	return transaksi, err
}

func (r *reportAdminPGRepository) FindDetailTransaksiByID(transaksiID int) ([]entity.DetailTransaksi, error) {
	var items []entity.DetailTransaksi
	err := r.db.Preload("Customer").Preload("Kasir").Preload("Transaksi").Preload("Transaksi.User").
		Where("id_transaksi = ?", transaksiID).Find(&items).Error
	return items, err
}

func (r *reportAdminPGRepository) FindAllTransaksiByPeriode(start, end string) ([]entity.Transaksi, error) {
	var transaksi []entity.Transaksi
	err := r.db.Preload("Customer").Preload("Kasir").Preload("DetailTransaksi").Preload("DetailTransaksi.Produk").
		Where("status_transaksi = 'selesai' AND DATE(created_at) BETWEEN ? AND ?", start, end).
		Order("created_at DESC").Find(&transaksi).Error
	return transaksi, err
}

func (r *reportAdminPGRepository) GetLaporanRugiLaba(start, end string) (*entity.LaporanRugiLaba, error) {
	var result entity.LaporanRugiLaba

	err := r.db.Raw("SELECT COALESCE(SUM(total),0) FROM transaksi WHERE status_transaksi = 'selesai' AND DATE(created_at) BETWEEN ? AND ?", start, end).Scan(&result.TotalPenjualan).Error
	if err != nil {
		return nil, err
	}

	err = r.db.Raw("SELECT COALESCE(SUM(dt.jumlah * p.harga_pokok),0) FROM detail_transaksi dt JOIN produk p ON p.id_produk = dt.id_produk JOIN transaksi t ON t.id_transaksi = dt.id_transaksi WHERE t.status_transaksi = 'selesai' AND DATE(t.created_at) BETWEEN ? AND ?", start, end).Scan(&result.TotalHPP).Error
	if err != nil {
		return nil, err
	}

	result.LabaBersih = result.TotalPenjualan - result.TotalHPP

	type DailyData struct {
		Date      string `json:"date"`
		Penjualan int64  `json:"penjualan"`
		HPP       int64  `json:"hpp"`
		Laba      int64  `json:"laba"`
	}
	var dailyResults []DailyData
	err = r.db.Raw(`
		SELECT DATE(t.created_at) as date, SUM(t.total) as penjualan, SUM(dt.jumlah * p.harga_pokok) as hpp
		FROM transaksi t JOIN detail_transaksi dt ON dt.id_transaksi = t.id_transaksi JOIN produk p ON p.id_produk = dt.id_produk
		WHERE t.status_transaksi = 'selesai' AND DATE(t.created_at) BETWEEN ? AND ?
		GROUP BY DATE(t.created_at) ORDER BY DATE(t.created_at) ASC
	`, start, end).Scan(&dailyResults).Error
	if err != nil {
		return &result, nil
	}

	dates := make([]string, len(dailyResults))
	penjualan := make([]int64, len(dailyResults))
	laba := make([]int64, len(dailyResults))
	for i, d := range dailyResults {
		dates[i] = d.Date
		penjualan[i] = d.Penjualan
		laba[i] = d.Penjualan - d.HPP
	}
	result.Dates = dates
	result.Penjualan = penjualan
	result.Laba = laba
	return &result, nil
}

// ==================== Report Kasir PG ====================

type reportKasirPGRepository struct{ db *gorm.DB }

func NewReportKasirPGRepository(db *gorm.DB) ReportKasirRepository {
	return &reportKasirPGRepository{db: db}
}

func (r *reportKasirPGRepository) FindTransaksiByKasir(kasirID int) ([]entity.Transaksi, error) {
	var transaksi []entity.Transaksi
	err := r.db.Preload("Kasir").Where("id_kasir = ? AND status_transaksi = 'selesai'", kasirID).Order("created_at DESC").Find(&transaksi).Error
	return transaksi, err
}

func (r *reportKasirPGRepository) FindTransaksiByKasirAndPeriode(kasirID int, startDate, endDate, metodePembayaran string) ([]entity.Transaksi, error) {
	db := r.db.Preload("Kasir").Where("id_kasir = ? AND status_transaksi = 'selesai' AND DATE(created_at) BETWEEN ? AND ?", kasirID, startDate, endDate)
	if metodePembayaran != "" && metodePembayaran != "all" {
		db = db.Where("metode_pembayaran = ?", metodePembayaran)
	}
	var transaksi []entity.Transaksi
	err := db.Order("created_at DESC").Find(&transaksi).Error
	return transaksi, err
}

func (r *reportKasirPGRepository) FindDetailTransaksiByID(transaksiID, kasirID int) (*entity.Transaksi, []entity.DetailTransaksi, error) {
	var transaksi entity.Transaksi
	err := r.db.Preload("Kasir").Where("id_transaksi = ? AND id_kasir = ? AND status_transaksi = 'selesai'", transaksiID, kasirID).First(&transaksi).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil, errors.New("transaksi tidak ditemukan atau bukan milik Anda")
		}
		return nil, nil, err
	}
	var items []entity.DetailTransaksi
	err = r.db.Preload("Produk").Preload("Transaksi").Preload("Transaksi.Kasir").Where("id_transaksi = ?", transaksiID).Find(&items).Error
	return &transaksi, items, err
}
