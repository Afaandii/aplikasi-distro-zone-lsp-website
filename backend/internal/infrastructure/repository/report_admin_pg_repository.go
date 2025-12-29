package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type reportAdminPgRepository struct {
	db *gorm.DB
}

func NewReportAdminPgRepository(db *gorm.DB) *reportAdminPgRepository {
	return &reportAdminPgRepository{db: db}
}

func (r *reportAdminPgRepository) FindAllTransaksi() ([]entities.Transaksi, error) {
	var transaksi []entities.Transaksi

	err := r.db.
		Preload("User").Preload("DetailTransaksi").Preload("DetailTransaksi.Produk").
		Where("status_transaksi = ?", "selesai").
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}

func (r *reportAdminPgRepository) FindDetailTransaksiByID(transaksiID int) ([]entities.DetailTransaksi, error) {
	var items []entities.DetailTransaksi

	err := r.db.Preload("Produk").Preload("Transaksi").Preload("Transaksi.User").
		Where("id_transaksi = ?", transaksiID).
		Find(&items).Error

	if err != nil {
		return nil, err
	}

	return items, nil
}

func (r *reportAdminPgRepository) FindAllTransaksiByPeriode(start, end string) ([]entities.Transaksi, error) {
	var transaksi []entities.Transaksi

	err := r.db.
		Preload("User").Preload("DetailTransaksi").Preload("DetailTransaksi.Produk").
		Where(`
			status_transaksi = 'selesai'
			AND DATE(created_at) BETWEEN ? AND ?
		`, start, end).
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}

func (r *reportAdminPgRepository) GetLaporanRugiLaba(start, end string) (*entities.LaporanRugiLaba, error) {
	var result entities.LaporanRugiLaba

	// Total Penjualan
	err := r.db.Raw(`
		SELECT COALESCE(SUM(total),0)
		FROM transaksi
		WHERE status_transaksi = 'selesai'
		AND DATE(created_at) BETWEEN ? AND ?
	`, start, end).Scan(&result.TotalPenjualan).Error

	if err != nil {
		return nil, err
	}

	// Total HPP
	err = r.db.Raw(`
		SELECT COALESCE(SUM(dt.jumlah * p.harga_pokok),0)
		FROM detail_transaksi dt
		JOIN produk p ON p.id_produk = dt.id_produk
		JOIN transaksi t ON t.id_transaksi = dt.id_transaksi
		WHERE t.status_transaksi = 'selesai'
		AND DATE(t.created_at) BETWEEN ? AND ?
	`, start, end).Scan(&result.TotalHPP).Error

	if err != nil {
		return nil, err
	}

	result.LabaBersih = result.TotalPenjualan - result.TotalHPP

	// Ambil Data untuk Grafik
	type DailyData struct {
		Date      string `json:"date"`
		Penjualan int64  `json:"penjualan"`
		HPP       int64  `json:"hpp"`
		Laba      int64  `json:"laba"`
	}

	var dailyResults []DailyData

	err = r.db.Raw(`
		SELECT 
			DATE(t.created_at) as date,
			SUM(t.total) as penjualan,
			SUM(dt.jumlah * p.harga_pokok) as hpp
		FROM transaksi t
		JOIN detail_transaksi dt ON dt.id_transaksi = t.id_transaksi
		JOIN produk p ON p.id_produk = dt.id_produk
		WHERE t.status_transaksi = 'selesai'
		  AND DATE(t.created_at) BETWEEN ? AND ?
		GROUP BY DATE(t.created_at)
		ORDER BY DATE(t.created_at) ASC
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
