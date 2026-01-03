package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type varianPGRepository struct {
	db *gorm.DB
}

func NewVarianPGRepository(db *gorm.DB) repo.VarianRepository {
	return &varianPGRepository{db: db}
}

func (r *varianPGRepository) FindAll() ([]entities.Varian, error) {
	var list []entities.Varian
	if err := r.db.Preload("Ukuran").Preload("Warna").Preload("Produk").Order("id_varian").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *varianPGRepository) FindByID(idVarian int) (*entities.Varian, error) {
	var rol entities.Varian
	if err := r.db.Preload("Ukuran").Preload("Warna").Preload("Produk").First(&rol, idVarian).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *varianPGRepository) Create(c *entities.Varian) error {
	return r.db.Create(c).Error
}

func (r *varianPGRepository) Update(c *entities.Varian) error {
	result := r.db.Model(&entities.Varian{}).
		Where("id_varian = ?", c.IDVarian).
		Updates(map[string]interface{}{
			"id_produk": c.ProdukRef,
			"id_ukuran": c.UkuranRef,
			"id_warna":  c.WarnaRef,
			"stok_kaos": c.StokKaos,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *varianPGRepository) Delete(idVarian int) error {
	result := r.db.Delete(&entities.Varian{}, idVarian)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *varianPGRepository) Search(keyword string) ([]entities.Varian, error) {
	var list []entities.Varian
	query := "%" + strings.ToLower(keyword) + "%"
	err := r.db.
		Preload("Ukuran").
		Preload("Warna").
		Preload("Produk").
		Joins("JOIN produk ON produk.id_produk = varian.id_produk").
		Joins("JOIN ukuran ON ukuran.id_ukuran = varian.id_ukuran").
		Joins("JOIN warna ON warna.id_warna = varian.id_warna").
		Where("LOWER(produk.nama_kaos) LIKE ? OR LOWER(ukuran.nama_ukuran) LIKE ? OR LOWER(warna.nama_warna) LIKE ?", query, query, query).
		Order("varian.id_varian ASC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}
	return list, nil
}

func (r *varianPGRepository) FindByProdukWarnaUkuran(idProduk, idWarna, idUkuran int) (*entities.Varian, error) {
	var v entities.Varian
	err := r.db.Where("id_produk = ? AND id_warna = ? AND id_ukuran = ?", idProduk, idWarna, idUkuran).First(&v).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &v, err
}
