package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type RoleRepository interface {
	FindAll() ([]entities.Role, error)
	FindByID(idRole int) (*entities.Role, error)
	Create(r *entities.Role) error
	Update(r *entities.Role) error
	Delete(idRole int) error
}
