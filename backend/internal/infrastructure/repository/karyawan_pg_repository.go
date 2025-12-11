package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type karyawanPGRepository struct {
	db *gorm.DB
}

func NewKaryawanPGRepository(db *gorm.DB) repo.KaryawanRepository {
	return &karyawanPGRepository{db: db}
}

func (r *karyawanPGRepository) FindAll() ([]entities.Karyawan, error) {
	var list []entities.Karyawan
	if err := r.db.Preload("Role").Order("id_karyawan").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *karyawanPGRepository) FindByID(idKaryawan int) (*entities.Karyawan, error) {
	var karyawan entities.Karyawan
	err := r.db.
		Preload("Role").
		First(&karyawan, "id_karyawan = ?", idKaryawan).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &karyawan, nil
}

func (r *karyawanPGRepository) Create(c *entities.Karyawan) error {
	return r.db.Create(c).Error
}

func (r *karyawanPGRepository) Update(c *entities.Karyawan) error {
	result := r.db.Model(&entities.Karyawan{}).
		Where("id_karyawan = ?", c.IDKaryawan).
		Updates(c)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *karyawanPGRepository) Delete(idKaryawan int) error {
	result := r.db.Delete(&entities.Karyawan{}, idKaryawan)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
