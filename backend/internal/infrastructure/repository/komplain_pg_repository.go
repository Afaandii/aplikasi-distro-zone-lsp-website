package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type komplainPgRepository struct {
	db *gorm.DB
}

func NewKomplainPgRepository(db *gorm.DB) *komplainPgRepository {
	return &komplainPgRepository{db: db}
}

func (r *komplainPgRepository) InsertKomplain(
	komplain *entities.Komplain,
) error {
	return r.db.Create(komplain).Error
}

func (r *komplainPgRepository) FindKomplainByUser(
	userID int,
) ([]entities.Komplain, error) {

	var data []entities.Komplain
	err := r.db.
		Where("id_user = ?", userID).
		Order("created_at DESC").
		Find(&data).Error

	return data, err
}

func (r *komplainPgRepository) FindAllKomplain() (
	[]entities.Komplain,
	error,
) {
	var data []entities.Komplain
	err := r.db.
		Order("created_at DESC").
		Find(&data).Error

	return data, err
}

func (r *komplainPgRepository) UpdateStatusKomplain(
	idKomplain int,
	status string,
) error {

	result := r.db.Exec(`
		UPDATE komplain_pesanan
		SET status_komplain = ?, updated_at = NOW()
		WHERE id_komplain = ?
	`, status, idKomplain)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}
