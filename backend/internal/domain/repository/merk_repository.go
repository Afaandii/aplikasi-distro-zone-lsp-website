package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type MerkRepository interface {
	FindAll() ([]entities.Merk, error)
	FindByID(idMerk int) (*entities.Merk, error)
	Create(m *entities.Merk) error
	Update(m *entities.Merk) error
	Delete(idMerk int) error
}
