package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type ProdukRepository interface {
	FindAll() ([]entities.Produk, error)
	FindByID(idProduk int) (*entities.Produk, error)
	Create(p *entities.Produk) error
	Update(p *entities.Produk) error
	Delete(idProduk int) error
	FindDetailByID(idProduk int) (*entities.Produk, error)
	SearchByName(name string) ([]entities.Produk, error)
	SearchProdukForAdmin(keyword string) ([]entities.Produk, error)
}
