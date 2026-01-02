package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type warnaPGRepository struct {
	db *gorm.DB
}

func NewWarnaPGRepository(db *gorm.DB) repo.WarnaRepository {
	return &warnaPGRepository{db: db}
}

func (r *warnaPGRepository) FindAll() ([]entities.Warna, error) {
	var list []entities.Warna
	if err := r.db.Order("id_warna").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *warnaPGRepository) FindByID(idWarna int) (*entities.Warna, error) {
	var rol entities.Warna
	if err := r.db.First(&rol, idWarna).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *warnaPGRepository) Create(c *entities.Warna) error {
	return r.db.Create(c).Error
}

func (r *warnaPGRepository) Update(c *entities.Warna) error {
	result := r.db.Model(&entities.Warna{}).
		Where("id_warna = ?", c.IDWarna).
		Updates(map[string]interface{}{
			"nama_warna": c.NamaWarna,
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

func (r *warnaPGRepository) Delete(idWarna int) error {
	result := r.db.Delete(&entities.Warna{}, idWarna)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *warnaPGRepository) Search(keyword string) ([]entities.Warna, error) {
	var list []entities.Warna
	query := "%" + strings.ToLower(keyword) + "%"
	err := r.db.
		Where("LOWER(nama_warna) LIKE ? OR LOWER(keterangan) LIKE ?", query, query).
		Order("warna.id_warna ASC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}
	return list, nil
}
