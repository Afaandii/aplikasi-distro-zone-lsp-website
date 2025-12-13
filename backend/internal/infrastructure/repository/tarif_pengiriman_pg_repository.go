package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type tarifPengirimanPGRepository struct {
	db *gorm.DB
}

func NewTarifPengirimanPGRepository(db *gorm.DB) repo.TarifPengirimanRepository {
	return &tarifPengirimanPGRepository{db: db}
}

func (tp *tarifPengirimanPGRepository) FindAll() ([]entities.TarifPengiriman, error) {
	var list []entities.TarifPengiriman
	if err := tp.db.Order("id_tarif_pengiriman").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (tp *tarifPengirimanPGRepository) FindByID(idTarifPengiriman int) (*entities.TarifPengiriman, error) {
	var trfp entities.TarifPengiriman
	if err := tp.db.First(&trfp, idTarifPengiriman).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &trfp, nil
}

func (tp *tarifPengirimanPGRepository) Create(c *entities.TarifPengiriman) error {
	return tp.db.Create(c).Error
}

func (tp *tarifPengirimanPGRepository) Update(c *entities.TarifPengiriman) error {
	result := tp.db.Model(&entities.TarifPengiriman{}).
		Where("id_tarif_pengiriman = ?", c.IDTarifPengiriman).
		Updates(map[string]interface{}{
			"wilayah":      c.Wilayah,
			"harga_per_kg": c.HargaPerKg,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (tp *tarifPengirimanPGRepository) Delete(idTarifPengiriman int) error {
	result := tp.db.Delete(&entities.TarifPengiriman{}, idTarifPengiriman)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
