package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type TipeRepository interface {
	FindAll() ([]entities.Tipe, error)
	FindByID(idTipe int) (*entities.Tipe, error)
	Create(t *entities.Tipe) error
	Update(t *entities.Tipe) error
	Delete(idTipe int) error
}
