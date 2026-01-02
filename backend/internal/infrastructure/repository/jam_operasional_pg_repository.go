package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"strings"

	"gorm.io/gorm"
)

type jamOperasionalPGRepository struct {
	db *gorm.DB
}

func NewJamOperasionalPGRepository(db *gorm.DB) repo.JamOperasionalRepository {
	return &jamOperasionalPGRepository{db: db}
}

func (jo *jamOperasionalPGRepository) FindAll() ([]entities.JamOperasional, error) {
	var list []entities.JamOperasional
	if err := jo.db.Order("id_jam_operasional").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (jo *jamOperasionalPGRepository) FindByID(idJamOperasional int) (*entities.JamOperasional, error) {
	var jamOps entities.JamOperasional
	if err := jo.db.First(&jamOps, idJamOperasional).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &jamOps, nil
}

func (jo *jamOperasionalPGRepository) Create(c *entities.JamOperasional) error {
	return jo.db.Create(c).Error
}

func (jo *jamOperasionalPGRepository) Update(c *entities.JamOperasional) error {
	result := jo.db.Model(&entities.JamOperasional{}).
		Where("id_jam_operasional = ?", c.IDJamOperasional).
		Updates(map[string]interface{}{
			"tipe_layanan": c.TipeLayanan,
			"hari":         c.Hari,
			"jam_buka":     c.JamBuka,
			"jam_tutup":    c.JamTutup,
			"status":       c.Status,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (jo *jamOperasionalPGRepository) Delete(idJamOperasional int) error {
	result := jo.db.Delete(&entities.JamOperasional{}, idJamOperasional)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *jamOperasionalPGRepository) Search(keyword string) ([]entities.JamOperasional, error) {
	var list []entities.JamOperasional
	query := "%" + strings.ToLower(keyword) + "%"
	err := r.db.
		Where("LOWER(tipe_layanan) LIKE ? OR LOWER(hari) LIKE ?", query, query).
		Order("jam_operasional.id_jam_operasional ASC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}
	return list, nil
}
