package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type CustomerRepository interface {
	FindAll() ([]entities.Customer, error)
	FindByID(idCustomer int) (*entities.Customer, error)
	Create(m *entities.Customer) error
	Update(m *entities.Customer) error
	Delete(idCustomer int) error
}
