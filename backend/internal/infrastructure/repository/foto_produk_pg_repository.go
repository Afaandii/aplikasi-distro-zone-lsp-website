package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type fotoProdukPGRepository struct {
	db *gorm.DB
}

func NewFotoProdukPGRepository(db *gorm.DB) repo.FotoProdukRepository {
	return &fotoProdukPGRepository{db: db}
}

func (r *fotoProdukPGRepository) FindAll() ([]entities.FotoProduk, error) {
	var list []entities.FotoProduk
	if err := r.db.Preload("Produk").Order("id_foto_produk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *fotoProdukPGRepository) FindByID(idFotoProduk int) (*entities.FotoProduk, error) {
	var rol entities.FotoProduk
	if err := r.db.Preload("Produk").First(&rol, idFotoProduk).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *fotoProdukPGRepository) Create(c *entities.FotoProduk) error {
	return r.db.Create(c).Error
}

func (r *fotoProdukPGRepository) Update(c *entities.FotoProduk) error {
	result := r.db.Model(&entities.FotoProduk{}).
		Where("id_foto_produk = ?", c.IDFotoProduk).
		Updates(map[string]interface{}{
			"id_produk": c.ProdukRef,
			"url_foto":  c.UrlFoto,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *fotoProdukPGRepository) Delete(idFotoProduk int) error {
	result := r.db.Delete(&entities.FotoProduk{}, idFotoProduk)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
