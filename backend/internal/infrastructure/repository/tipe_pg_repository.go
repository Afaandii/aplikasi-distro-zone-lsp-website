package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type tipePGRepository struct {
	db *gorm.DB
}

func NewTipePGRepository(db *gorm.DB) repo.TipeRepository {
	return &tipePGRepository{db: db}
}

func (r *tipePGRepository) FindAll() ([]entities.Tipe, error) {
	var list []entities.Tipe
	if err := r.db.Order("id_tipe").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *tipePGRepository) FindByID(idTipe int) (*entities.Tipe, error) {
	var rol entities.Tipe
	if err := r.db.First(&rol, idTipe).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *tipePGRepository) Create(c *entities.Tipe) error {
	return r.db.Create(c).Error
}

func (r *tipePGRepository) Update(c *entities.Tipe) error {
	result := r.db.Model(&entities.Tipe{}).
		Where("id_tipe = ?", c.IDTipe).
		Updates(map[string]interface{}{
			"nama_tipe":  c.NamaTipe,
			"keterangan": c.Keterangan,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *tipePGRepository) Delete(idTipe int) error {
	result := r.db.Delete(&entities.Tipe{}, idTipe)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *tipePGRepository) Search(keyword string) ([]entities.Tipe, error) {
	var list []entities.Tipe
	query := "%" + strings.ToLower(keyword) + "%"
	err := r.db.
		Where("LOWER(nama_tipe) LIKE ? OR LOWER(keterangan) LIKE ?", query, query).
		Order("tipe.id_tipe ASC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}
	return list, nil
}
