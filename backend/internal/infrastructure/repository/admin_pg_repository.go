package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type adminPgRepository struct {
	db *gorm.DB
}

func NewAdminPgRepository(db *gorm.DB) *adminPgRepository {
	return &adminPgRepository{db: db}
}

func (r *adminPgRepository) FindPesananDiproses() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?",
			"diproses").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) FindPesananDikemas() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?", "dikemas").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) FindPesananDikirim() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?", "dikirim").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) UpdateStatusPesananAdmin(
	kodePesanan string,
	fromStatus string,
	toStatus string,
	adminID int,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
		    updated_at = NOW()
		WHERE kode_pesanan = $2
		  AND status_pesanan = $3
	`, toStatus, kodePesanan, fromStatus)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}
