package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type ProdukRepository interface {
	FindAll() ([]entities.Produk, error)
	FindByID(idProduk int) (*entities.Produk, error)
	Create(p *entities.Produk) error
	Update(p *entities.Produk) error
	Delete(idProduk int) error
}
