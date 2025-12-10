package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type rolePGRepository struct {
	db *gorm.DB
}

func NewRolePGRepository(db *gorm.DB) repo.RoleRepository {
	return &rolePGRepository{db: db}
}

func (r *rolePGRepository) FindAll() ([]entities.Role, error) {
	var list []entities.Role
	if err := r.db.Order("id_role").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *rolePGRepository) FindByID(idRole int) (*entities.Role, error) {
	var rol entities.Role
	if err := r.db.First(&rol, idRole).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *rolePGRepository) Create(c *entities.Role) error {
	return r.db.Create(c).Error
}

func (r *rolePGRepository) Update(c *entities.Role) error {
	result := r.db.Model(&entities.Role{}).
		Where("id_role = ?", c.IDRole).
		Updates(map[string]interface{}{
			"nama_role":  c.NamaRole,
			"keterangan": c.Keterangan,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *rolePGRepository) Delete(idRole int) error {
	result := r.db.Delete(&entities.Role{}, idRole)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
