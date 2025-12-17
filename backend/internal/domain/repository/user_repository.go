package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type UserRepository interface {
	FindAll() ([]entities.User, error)
	FindByID(idUser int) (*entities.User, error)
	FindByRole(roleID int) ([]entities.User, error)
	Create(u *entities.User) error
	Update(u *entities.User) error
	Delete(idUser int) error

	FindByUsername(username string) (*entities.User, error)
	Register(u *entities.User) error
}
