package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type merkPGRepository struct {
	db *gorm.DB
}

func NewMerkPGRepository(db *gorm.DB) repo.MerkRepository {
	return &merkPGRepository{db: db}
}

func (r *merkPGRepository) FindAll() ([]entities.Merk, error) {
	var list []entities.Merk
	if err := r.db.Order("id_merk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *merkPGRepository) FindByID(idMerk int) (*entities.Merk, error) {
	var rol entities.Merk
	if err := r.db.First(&rol, idMerk).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *merkPGRepository) Create(c *entities.Merk) error {
	return r.db.Create(c).Error
}

func (r *merkPGRepository) Update(c *entities.Merk) error {
	result := r.db.Model(&entities.Merk{}).
		Where("id_merk = ?", c.IDMerk).
		Updates(map[string]interface{}{
			"nama_merk":  c.NamaMerk,
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

func (r *merkPGRepository) Delete(idMerk int) error {
	result := r.db.Delete(&entities.Merk{}, idMerk)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *merkPGRepository) Search(keyword string) ([]entities.Merk, error) {
	var list []entities.Merk
	query := "%" + strings.ToLower(keyword) + "%"
	err := r.db.
		Where("LOWER(nama_merk) LIKE ? OR LOWER(keterangan) LIKE ?", query, query).
		Order("merk.id_merk ASC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}
	return list, nil
}
