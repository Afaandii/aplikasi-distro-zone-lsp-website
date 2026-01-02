package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type UkuranRepository interface {
	FindAll() ([]entities.Ukuran, error)
	FindByID(idUkuran int) (*entities.Ukuran, error)
	Create(u *entities.Ukuran) error
	Update(u *entities.Ukuran) error
	Delete(idUkuran int) error
	Search(keyword string) ([]entities.Ukuran, error)
}
