package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type detailPesananPGRepository struct {
	db *gorm.DB
}

func NewDetailPesananPGRepository(db *gorm.DB) *detailPesananPGRepository {
	return &detailPesananPGRepository{db: db}
}

func (r *detailPesananPGRepository) Create(detail *entities.DetailPesanan) error {
	return r.db.Create(detail).Error
}
