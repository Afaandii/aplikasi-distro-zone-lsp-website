package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"errors"
	"strings"

	"gorm.io/gorm"
)

// ==================== Merk PG ====================

type merkPGRepository struct{ db *gorm.DB }

func NewMerkPGRepository(db *gorm.DB) MerkRepository { return &merkPGRepository{db: db} }

func (r *merkPGRepository) FindAll() ([]entity.Merk, error) {
	var list []entity.Merk
	if err := r.db.Order("id_merk").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *merkPGRepository) FindByID(id int) (*entity.Merk, error) {
	var m entity.Merk
	if err := r.db.First(&m, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (r *merkPGRepository) Create(m *entity.Merk) error { return r.db.Create(m).Error }

func (r *merkPGRepository) Update(m *entity.Merk) error {
	result := r.db.Model(&entity.Merk{}).Where("id_merk = ?", m.IDMerk).Updates(map[string]interface{}{
		"nama_merk": m.NamaMerk, "keterangan": m.Keterangan,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *merkPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.Merk{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *merkPGRepository) Search(keyword string) ([]entity.Merk, error) {
	var list []entity.Merk
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Where("LOWER(nama_merk) LIKE ? OR LOWER(keterangan) LIKE ?", q, q).
		Order("merk.id_merk ASC").Find(&list).Error
	return list, err
}

// ==================== Tipe PG ====================

type tipePGRepository struct{ db *gorm.DB }

func NewTipePGRepository(db *gorm.DB) TipeRepository { return &tipePGRepository{db: db} }

func (r *tipePGRepository) FindAll() ([]entity.Tipe, error) {
	var list []entity.Tipe
	if err := r.db.Order("id_tipe").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *tipePGRepository) FindByID(id int) (*entity.Tipe, error) {
	var t entity.Tipe
	if err := r.db.First(&t, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &t, nil
}

func (r *tipePGRepository) Create(t *entity.Tipe) error { return r.db.Create(t).Error }

func (r *tipePGRepository) Update(t *entity.Tipe) error {
	result := r.db.Model(&entity.Tipe{}).Where("id_tipe = ?", t.IDTipe).Updates(map[string]interface{}{
		"nama_tipe": t.NamaTipe, "keterangan": t.Keterangan,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *tipePGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.Tipe{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *tipePGRepository) Search(keyword string) ([]entity.Tipe, error) {
	var list []entity.Tipe
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Where("LOWER(nama_tipe) LIKE ? OR LOWER(keterangan) LIKE ?", q, q).
		Order("tipe.id_tipe ASC").Find(&list).Error
	return list, err
}

// ==================== Ukuran PG ====================

type ukuranPGRepository struct{ db *gorm.DB }

func NewUkuranPGRepository(db *gorm.DB) UkuranRepository { return &ukuranPGRepository{db: db} }

func (r *ukuranPGRepository) FindAll() ([]entity.Ukuran, error) {
	var list []entity.Ukuran
	if err := r.db.Order("id_ukuran").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *ukuranPGRepository) FindByID(id int) (*entity.Ukuran, error) {
	var u entity.Ukuran
	if err := r.db.First(&u, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &u, nil
}

func (r *ukuranPGRepository) Create(u *entity.Ukuran) error { return r.db.Create(u).Error }

func (r *ukuranPGRepository) Update(u *entity.Ukuran) error {
	result := r.db.Model(&entity.Ukuran{}).Where("id_ukuran = ?", u.IDUkuran).Updates(map[string]interface{}{
		"nama_ukuran": u.NamaUkuran, "keterangan": u.Keterangan,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *ukuranPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.Ukuran{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *ukuranPGRepository) Search(keyword string) ([]entity.Ukuran, error) {
	var list []entity.Ukuran
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Where("LOWER(nama_ukuran) LIKE ? OR LOWER(keterangan) LIKE ?", q, q).
		Order("ukuran.id_ukuran ASC").Find(&list).Error
	return list, err
}

// ==================== Warna PG ====================

type warnaPGRepository struct{ db *gorm.DB }

func NewWarnaPGRepository(db *gorm.DB) WarnaRepository { return &warnaPGRepository{db: db} }

func (r *warnaPGRepository) FindAll() ([]entity.Warna, error) {
	var list []entity.Warna
	if err := r.db.Order("id_warna").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *warnaPGRepository) FindByID(id int) (*entity.Warna, error) {
	var w entity.Warna
	if err := r.db.First(&w, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &w, nil
}

func (r *warnaPGRepository) Create(w *entity.Warna) error { return r.db.Create(w).Error }

func (r *warnaPGRepository) Update(w *entity.Warna) error {
	result := r.db.Model(&entity.Warna{}).Where("id_warna = ?", w.IDWarna).Updates(map[string]interface{}{
		"nama_warna": w.NamaWarna, "keterangan": w.Keterangan,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *warnaPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.Warna{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *warnaPGRepository) Search(keyword string) ([]entity.Warna, error) {
	var list []entity.Warna
	q := "%" + strings.ToLower(keyword) + "%"
	err := r.db.Where("LOWER(nama_warna) LIKE ? OR LOWER(keterangan) LIKE ?", q, q).
		Order("warna.id_warna ASC").Find(&list).Error
	return list, err
}
