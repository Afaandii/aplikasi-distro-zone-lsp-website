package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"errors"

	"gorm.io/gorm"
)

type reportKasirPgRepository struct {
	db *gorm.DB
}

func NewReportKasirPgRepository(db *gorm.DB) *reportKasirPgRepository {
	return &reportKasirPgRepository{db: db}
}

func (r *reportKasirPgRepository) FindTransaksiByKasir(
	kasirID int,
) ([]entities.Transaksi, error) {

	var transaksi []entities.Transaksi

	err := r.db.Preload("Kasir").
		Where("id_kasir = ? AND status_transaksi = 'selesai'", kasirID).
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}

// internal/domain/repository/report_kasir_pg_repository.go
func (r *reportKasirPgRepository) FindTransaksiByKasirAndPeriode(
	kasirID int,
	startDate string,
	endDate string,
	metodePembayaran string, // ← tambahkan
) ([]entities.Transaksi, error) {

	db := r.db.Preload("Kasir").
		Where("id_kasir = ? AND status_transaksi = 'selesai' AND DATE(created_at) BETWEEN ? AND ?", kasirID, startDate, endDate)

	// Tambahkan filter metode jika bukan "all"
	if metodePembayaran != "" && metodePembayaran != "all" {
		db = db.Where("metode_pembayaran = ?", metodePembayaran)
	}

	var transaksi []entities.Transaksi
	err := db.Order("created_at DESC").Find(&transaksi).Error
	return transaksi, err
}

func (r *reportKasirPgRepository) FindDetailTransaksiByID(
	transaksiID int,
	kasirID int,
) (*entities.Transaksi, []entities.DetailTransaksi, error) {

	// 1️⃣ Ambil header transaksi + relasi User (opsional tapi bagus)
	var transaksi entities.Transaksi
	err := r.db.Preload("Kasir").
		Where("id_transaksi = ? AND id_kasir = ? AND status_transaksi = 'selesai'", transaksiID, kasirID).
		First(&transaksi).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil, errors.New("transaksi tidak ditemukan atau bukan milik Anda")
		}
		return nil, nil, err
	}

	// 2️⃣ Ambil detail transaksi dengan Preload Produk
	var items []entities.DetailTransaksi
	err = r.db.Preload("Produk").Preload("Transaksi").Preload("Transaksi.Kasir").
		Where("id_transaksi = ?", transaksiID).
		Find(&items).Error

	if err != nil {
		return nil, nil, err
	}

	return &transaksi, items, nil
}
