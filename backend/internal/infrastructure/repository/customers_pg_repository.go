package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type customerPGRepository struct {
	db *gorm.DB
}

func NewCustomerPGRepository(db *gorm.DB) repo.CustomerRepository {
	return &customerPGRepository{db: db}
}

func (r *customerPGRepository) FindAll() ([]entities.Customer, error) {
	var list []entities.Customer
	if err := r.db.Preload("Role").Order("id_customer").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *customerPGRepository) FindByID(idCustomer int) (*entities.Customer, error) {
	var customer entities.Customer
	err := r.db.
		Preload("Role").
		First(&customer, "id_customer = ?", idCustomer).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &customer, nil
}

func (r *customerPGRepository) Create(c *entities.Customer) error {
	return r.db.Create(c).Error
}

func (r *customerPGRepository) Update(c *entities.Customer) error {
	result := r.db.Model(&entities.Customer{}).
		Where("id_customer = ?", c.IDCustomer).
		Updates(c)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *customerPGRepository) Delete(idCustomer int) error {
	result := r.db.Delete(&entities.Customer{}, idCustomer)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}
