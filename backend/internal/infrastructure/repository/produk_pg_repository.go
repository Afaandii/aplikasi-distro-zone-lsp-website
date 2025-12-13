package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

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
	if err := p.db.Order("id_produk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (p *produkPGRepository) FindByID(idProduk int) (*entities.Produk, error) {
	var pro entities.Produk
	if err := p.db.First(&pro, idProduk).Error; err != nil {
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
			"id_ukuran":   u.UkuranRef,
			"id_warna":    u.WarnaRef,
			"nama_kaos":   u.NamaKaos,
			"harga_jual":  u.HargaJual,
			"harga_pokok": u.HargaPokok,
			"stok_kaos":   u.StokKaos,
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
