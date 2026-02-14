package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"errors"
	"strings"

	"gorm.io/gorm"
)

// ==================== Produk PG ====================

type produkPGRepository struct{ db *gorm.DB }

func NewProdukPGRepository(db *gorm.DB) ProdukRepository { return &produkPGRepository{db: db} }

func (p *produkPGRepository) FindAll() ([]entity.Produk, error) {
	var list []entity.Produk
	if err := p.db.Preload("Merk").Preload("Tipe").Order("id_produk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (p *produkPGRepository) FindByID(id int) (*entity.Produk, error) {
	var pro entity.Produk
	if err := p.db.Preload("Merk").Preload("Tipe").First(&pro, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pro, nil
}

func (p *produkPGRepository) Create(c *entity.Produk) error { return p.db.Create(c).Error }

func (p *produkPGRepository) Update(u *entity.Produk) error {
	result := p.db.Model(&entity.Produk{}).Where("id_produk = ?", u.IDProduk).Updates(map[string]interface{}{
		"id_merk": u.MerkRef, "id_tipe": u.TipeRef, "nama_kaos": u.NamaKaos,
		"harga_jual": u.HargaJual, "harga_pokok": u.HargaPokok,
		"deskripsi": u.Deskripsi, "spesifikasi": u.Spesifikasi,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (p *produkPGRepository) Delete(id int) error {
	result := p.db.Delete(&entity.Produk{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (p *produkPGRepository) FindDetailByID(id int) (*entity.Produk, error) {
	var pro entity.Produk
	err := p.db.Preload("Merk").Preload("Tipe").Preload("FotoProduk").Preload("FotoProduk.Warna").
		Preload("Varian.Ukuran").Preload("Varian.Warna").Preload("Varian.Produk").
		First(&pro, "id_produk = ?", id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pro, nil
}

func (p *produkPGRepository) SearchByName(name string) ([]entity.Produk, error) {
	var produk []entity.Produk
	query := p.db.Preload("Merk").Preload("Tipe")
	if name != "" {
		query = query.Where("LOWER(nama_kaos) LIKE ?", "%"+strings.ToLower(name)+"%")
	}
	err := query.Find(&produk).Error
	return produk, err
}

func (p *produkPGRepository) SearchProdukForAdmin(keyword string) ([]entity.Produk, error) {
	var produk []entity.Produk
	q := "%" + strings.ToLower(keyword) + "%"
	err := p.db.Model(&entity.Produk{}).Preload("Merk").Preload("Tipe").
		Joins("LEFT JOIN merk ON merk.id_merk = produk.id_merk").
		Joins("LEFT JOIN tipe ON tipe.id_tipe = produk.id_tipe").
		Where("LOWER(produk.nama_kaos) LIKE ? OR LOWER(merk.nama_merk) LIKE ? OR LOWER(tipe.nama_tipe) LIKE ?", q, q, q).
		Order("produk.id_produk ASC").Find(&produk).Error
	return produk, err
}

// ==================== Varian PG ====================

type varianPGRepository struct{ db *gorm.DB }

func NewVarianPGRepository(db *gorm.DB) VarianRepository { return &varianPGRepository{db: db} }

func (r *varianPGRepository) FindAll() ([]entity.Varian, error) {
	var list []entity.Varian
	if err := r.db.Preload("Ukuran").Preload("Warna").Preload("Produk").Order("id_varian").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *varianPGRepository) FindByID(id int) (*entity.Varian, error) {
	var v entity.Varian
	if err := r.db.Preload("Ukuran").Preload("Warna").Preload("Produk").First(&v, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &v, nil
}

func (r *varianPGRepository) Create(v *entity.Varian) error { return r.db.Create(v).Error }

func (r *varianPGRepository) Update(v *entity.Varian) error {
	result := r.db.Model(&entity.Varian{}).Where("id_varian = ?", v.IDVarian).Updates(map[string]interface{}{
		"id_produk": v.ProdukRef, "id_ukuran": v.UkuranRef, "id_warna": v.WarnaRef, "stok_kaos": v.StokKaos,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *varianPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.Varian{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *varianPGRepository) Search(keyword string) ([]entity.Varian, error) {
	var list []entity.Varian
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Preload("Ukuran").Preload("Warna").Preload("Produk").
		Joins("JOIN produk ON produk.id_produk = varian.id_produk").
		Joins("JOIN ukuran ON ukuran.id_ukuran = varian.id_ukuran").
		Joins("JOIN warna ON warna.id_warna = varian.id_warna").
		Where("LOWER(produk.nama_kaos) LIKE ? OR LOWER(ukuran.nama_ukuran) LIKE ? OR LOWER(warna.nama_warna) LIKE ?", q, q, q).
		Order("varian.id_varian ASC").Find(&list).Error
	return list, err
}

func (r *varianPGRepository) FindByProdukWarnaUkuran(idProduk, idWarna, idUkuran int) (*entity.Varian, error) {
	var v entity.Varian
	err := r.db.Where("id_produk = ? AND id_warna = ? AND id_ukuran = ?", idProduk, idWarna, idUkuran).First(&v).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	return &v, err
}

func (r *varianPGRepository) FindByProduk(idProduk int) ([]entity.Varian, error) {
	var list []entity.Varian
	err := r.db.Preload("Ukuran").Preload("Warna").Preload("Produk").
		Where("id_produk = ?", idProduk).Order("id_varian").Find(&list).Error
	return list, err
}

func (r *varianPGRepository) DeleteByProduk(idProduk int) error {
	result := r.db.Where("id_produk = ?", idProduk).Delete(&entity.Varian{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

// ==================== FotoProduk PG ====================

type fotoProdukPGRepository struct{ db *gorm.DB }

func NewFotoProdukPGRepository(db *gorm.DB) FotoProdukRepository {
	return &fotoProdukPGRepository{db: db}
}

func (r *fotoProdukPGRepository) FindAll() ([]entity.FotoProduk, error) {
	var list []entity.FotoProduk
	if err := r.db.Preload("Produk").Order("id_foto_produk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *fotoProdukPGRepository) FindByID(id int) (*entity.FotoProduk, error) {
	var fp entity.FotoProduk
	if err := r.db.Preload("Produk").First(&fp, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &fp, nil
}

func (r *fotoProdukPGRepository) Create(fp *entity.FotoProduk) error { return r.db.Create(fp).Error }

func (r *fotoProdukPGRepository) Update(fp *entity.FotoProduk) error {
	result := r.db.Model(&entity.FotoProduk{}).Where("id_foto_produk = ?", fp.IDFotoProduk).Updates(map[string]interface{}{
		"id_produk": fp.ProdukRef, "id_warna": fp.WarnaRef, "url_foto": fp.UrlFoto,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *fotoProdukPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.FotoProduk{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *fotoProdukPGRepository) Search(keyword string) ([]entity.FotoProduk, error) {
	var list []entity.FotoProduk
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Preload("Produk").Joins("JOIN produk ON produk.id_produk = foto_produk.id_produk").
		Where("LOWER(produk.nama_kaos) LIKE ?", q).Order("id_foto_produk ASC").Find(&list).Error
	return list, err
}

func (r *fotoProdukPGRepository) FindByProduk(idProduk int) ([]entity.FotoProduk, error) {
	var list []entity.FotoProduk
	err := r.db.Preload("Produk").Preload("Warna").Where("id_produk = ?", idProduk).Order("id_foto_produk").Find(&list).Error
	return list, err
}

func (r *fotoProdukPGRepository) DeleteByProduk(idProduk int) error {
	result := r.db.Where("id_produk = ?", idProduk).Delete(&entity.FotoProduk{})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
