package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type FotoProdukRepository interface {
	FindAll() ([]entities.FotoProduk, error)
	FindByID(idFotoProduk int) (*entities.FotoProduk, error)
	Create(fp *entities.FotoProduk) error
	Update(fp *entities.FotoProduk) error
	Delete(idFotoProduk int) error
}
