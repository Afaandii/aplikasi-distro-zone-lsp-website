package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type RoleRepository interface {
	FindAll() ([]entities.Role, error)
	FindByID(idRole int) (*entities.Role, error)
	Create(m *entities.Role) error
	Update(m *entities.Role) error
	Delete(idRole int) error
}
