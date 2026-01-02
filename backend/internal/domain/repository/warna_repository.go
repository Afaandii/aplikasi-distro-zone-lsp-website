package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type WarnaRepository interface {
	FindAll() ([]entities.Warna, error)
	FindByID(idWarna int) (*entities.Warna, error)
	Create(w *entities.Warna) error
	Update(w *entities.Warna) error
	Delete(idWarna int) error
	Search(keyword string) ([]entities.Warna, error)
}
