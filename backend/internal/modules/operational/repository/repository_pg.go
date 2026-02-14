package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"errors"
	"strconv"
	"strings"

	"gorm.io/gorm"
)

// ==================== JamOperasional PG ====================

type jamOperasionalPGRepository struct{ db *gorm.DB }

func NewJamOperasionalPGRepository(db *gorm.DB) JamOperasionalRepository {
	return &jamOperasionalPGRepository{db: db}
}

func (r *jamOperasionalPGRepository) FindAll() ([]entity.JamOperasional, error) {
	var list []entity.JamOperasional
	if err := r.db.Order("id_jam_operasional").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *jamOperasionalPGRepository) FindByID(id int) (*entity.JamOperasional, error) {
	var jo entity.JamOperasional
	if err := r.db.First(&jo, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &jo, nil
}

func (r *jamOperasionalPGRepository) Create(jo *entity.JamOperasional) error {
	return r.db.Create(jo).Error
}

func (r *jamOperasionalPGRepository) Update(jo *entity.JamOperasional) error {
	result := r.db.Model(&entity.JamOperasional{}).Where("id_jam_operasional = ?", jo.IDJamOperasional).Updates(map[string]interface{}{
		"tipe_layanan": jo.TipeLayanan, "hari": jo.Hari, "jam_buka": jo.JamBuka, "jam_tutup": jo.JamTutup, "status": jo.Status,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *jamOperasionalPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.JamOperasional{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *jamOperasionalPGRepository) Search(keyword string) ([]entity.JamOperasional, error) {
	var list []entity.JamOperasional
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Where("LOWER(tipe_layanan) LIKE ? OR LOWER(hari) LIKE ?", q, q).
		Order("jam_operasional.id_jam_operasional ASC").Find(&list).Error
	return list, err
}

// ==================== TarifPengiriman PG ====================

type tarifPengirimanPGRepository struct{ db *gorm.DB }

func NewTarifPengirimanPGRepository(db *gorm.DB) TarifPengirimanRepository {
	return &tarifPengirimanPGRepository{db: db}
}

func (r *tarifPengirimanPGRepository) FindAll() ([]entity.TarifPengiriman, error) {
	var list []entity.TarifPengiriman
	if err := r.db.Order("id_tarif_pengiriman").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *tarifPengirimanPGRepository) FindByID(id int) (*entity.TarifPengiriman, error) {
	var tp entity.TarifPengiriman
	if err := r.db.First(&tp, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &tp, nil
}

func (r *tarifPengirimanPGRepository) FindByWilayah(wilayah string) (*entity.TarifPengiriman, error) {
	var tp entity.TarifPengiriman
	err := r.db.Where("LOWER(wilayah) = LOWER(?)", wilayah).First(&tp).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("tarif pengiriman tidak ditemukan untuk wilayah: " + wilayah)
		}
		return nil, err
	}
	return &tp, nil
}

func (r *tarifPengirimanPGRepository) Create(tp *entity.TarifPengiriman) error {
	return r.db.Create(tp).Error
}

func (r *tarifPengirimanPGRepository) Update(tp *entity.TarifPengiriman) error {
	result := r.db.Model(&entity.TarifPengiriman{}).Where("id_tarif_pengiriman = ?", tp.IDTarifPengiriman).Updates(map[string]interface{}{
		"wilayah": tp.Wilayah, "harga_per_kg": tp.HargaPerKg,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *tarifPengirimanPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.TarifPengiriman{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *tarifPengirimanPGRepository) Search(keyword string) ([]entity.TarifPengiriman, error) {
	var list []entity.TarifPengiriman
	if harga, err := strconv.Atoi(keyword); err == nil {
		r.db.Where("harga_per_kg = ?", harga).Order("tarif_pengiriman.id_tarif_pengiriman ASC").Find(&list)
	} else {
		q := "%" + strings.ToLower(keyword) + "%"
		r.db.Where("LOWER(wilayah) LIKE ?", q).Order("tarif_pengiriman.id_tarif_pengiriman ASC").Find(&list)
	}
	return list, nil
}
