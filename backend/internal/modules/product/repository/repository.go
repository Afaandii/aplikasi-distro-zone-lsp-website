package repository

import "aplikasi-distro-zone-lsp-website/internal/shared/entity"

type ProdukRepository interface {
	FindAll() ([]entity.Produk, error)
	FindByID(idProduk int) (*entity.Produk, error)
	Create(p *entity.Produk) error
	Update(p *entity.Produk) error
	Delete(idProduk int) error
	FindDetailByID(idProduk int) (*entity.Produk, error)
	SearchByName(name string) ([]entity.Produk, error)
	SearchProdukForAdmin(keyword string) ([]entity.Produk, error)
}

type VarianRepository interface {
	FindAll() ([]entity.Varian, error)
	FindByID(idVarian int) (*entity.Varian, error)
	Create(v *entity.Varian) error
	Update(v *entity.Varian) error
	Delete(idVarian int) error
	Search(keyword string) ([]entity.Varian, error)
	FindByProdukWarnaUkuran(idProduk, idWarna, idUkuran int) (*entity.Varian, error)
	FindByProduk(idProduk int) ([]entity.Varian, error)
	DeleteByProduk(idProduk int) error
}

type FotoProdukRepository interface {
	FindAll() ([]entity.FotoProduk, error)
	FindByID(idFotoProduk int) (*entity.FotoProduk, error)
	Create(fp *entity.FotoProduk) error
	Update(fp *entity.FotoProduk) error
	Delete(idFotoProduk int) error
	Search(keyword string) ([]entity.FotoProduk, error)
	FindByProduk(idProduk int) ([]entity.FotoProduk, error)
	DeleteByProduk(idProduk int) error
}
