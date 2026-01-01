package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type produkPGRepository struct {
	db *gorm.DB
}

func NewProdukPGRepository(db *gorm.DB) repo.ProdukRepository {
	return &produkPGRepository{db: db}
}

func (p *produkPGRepository) FindAll() ([]entities.Produk, error) {
	var list []entities.Produk
	if err := p.db.Preload("Merk").Preload("Tipe").Order("id_produk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (p *produkPGRepository) FindByID(idProduk int) (*entities.Produk, error) {
	var pro entities.Produk
	if err := p.db.Preload("Merk").Preload("Tipe").First(&pro, idProduk).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pro, nil
}

func (p *produkPGRepository) Create(c *entities.Produk) error {
	return p.db.Create(c).Error
}

func (p *produkPGRepository) Update(u *entities.Produk) error {
	result := p.db.Model(&entities.Produk{}).
		Where("id_produk = ?", u.IDProduk).
		Updates(map[string]interface{}{
			"id_merk":     u.MerkRef,
			"id_tipe":     u.TipeRef,
			"nama_kaos":   u.NamaKaos,
			"harga_jual":  u.HargaJual,
			"harga_pokok": u.HargaPokok,
			"deskripsi":   u.Deskripsi,
			"spesifikasi": u.Spesifikasi,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *produkPGRepository) Delete(idProduk int) error {
	result := r.db.Delete(&entities.Produk{}, idProduk)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (p *produkPGRepository) FindDetailByID(idProduk int) (*entities.Produk, error) {
	var pro entities.Produk
	err := p.db.Preload("Merk").
		Preload("Tipe").
		Preload("FotoProduk").
		Preload("FotoProduk.Warna").
		Preload("Varian.Ukuran").
		Preload("Varian.Warna").
		Preload("Varian.Produk").
		First(&pro, "id_produk = ?", idProduk).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pro, nil
}

func (p *produkPGRepository) SearchByName(name string) ([]entities.Produk, error) {
	var produk []entities.Produk
	query := p.db.Preload("Merk").Preload("Tipe")

	if name != "" {
		query = query.Where("LOWER(nama_kaos) LIKE ?", "%"+strings.ToLower(name)+"%")
	}

	err := query.Find(&produk).Error
	return produk, err
}

func (p *produkPGRepository) SearchProdukForAdmin(keyword string) ([]entities.Produk, error) {
	var produk []entities.Produk
	query := "%" + strings.ToLower(keyword) + "%"
	err := p.db.Model(&entities.Produk{}).
		Preload("Merk").
		Preload("Tipe").
		Joins("LEFT JOIN merk ON merk.id_merk = produk.id_merk").
		Joins("LEFT JOIN tipe ON tipe.id_tipe = produk.id_tipe").
		Where("LOWER(produk.nama_kaos) LIKE ? OR LOWER(merk.nama_merk) LIKE ? OR LOWER(tipe.nama_tipe) LIKE ?", query, query, query).
		Order("produk.id_produk ASC").
		Find(&produk).Error

	return produk, err
}
