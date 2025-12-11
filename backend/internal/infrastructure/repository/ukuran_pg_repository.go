package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type ukuranPGRepository struct {
	db *gorm.DB
}

func NewUkuranPGRepository(db *gorm.DB) repo.UkuranRepository {
	return &ukuranPGRepository{db: db}
}

func (r *ukuranPGRepository) FindAll() ([]entities.Ukuran, error) {
	var list []entities.Ukuran
	if err := r.db.Order("id_ukuran").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *ukuranPGRepository) FindByID(idUkuran int) (*entities.Ukuran, error) {
	var rol entities.Ukuran
	if err := r.db.First(&rol, idUkuran).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *ukuranPGRepository) Create(c *entities.Ukuran) error {
	return r.db.Create(c).Error
}

func (r *ukuranPGRepository) Update(c *entities.Ukuran) error {
	result := r.db.Model(&entities.Ukuran{}).
		Where("id_ukuran = ?", c.IDUkuran).
		Updates(map[string]interface{}{
			"nama_ukuran": c.NamaUkuran,
			"keterangan":  c.Keterangan,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *ukuranPGRepository) Delete(idUkuran int) error {
	result := r.db.Delete(&entities.Ukuran{}, idUkuran)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
