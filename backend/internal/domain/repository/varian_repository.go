package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type VarianRepository interface {
	FindAll() ([]entities.Varian, error)
	FindByID(idVarian int) (*entities.Varian, error)
	Create(v *entities.Varian) error
	Update(v *entities.Varian) error
	Delete(idVarian int) error
	Search(keyword string) ([]entities.Varian, error)
	FindByProdukWarnaUkuran(idProduk, idWarna, idUkuran int) (*entities.Varian, error)
}
