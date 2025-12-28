package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

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

	err := r.db.Preload("User").
		Where("id_user = ? AND status_transaksi = 'selesai'", kasirID).
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}

func (r *reportKasirPgRepository) FindTransaksiByKasirAndPeriode(
	kasirID int,
	startDate string,
	endDate string,
) ([]entities.Transaksi, error) {

	var transaksi []entities.Transaksi

	err := r.db.Preload("User").
		Where("id_user = ? AND status_transaksi = 'selesai' AND DATE(created_at) BETWEEN ? AND ?", kasirID, startDate, endDate).
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}
