package repository

import "aplikasi-distro-zone-lsp-website/internal/shared/entity"

type JamOperasionalRepository interface {
	FindAll() ([]entity.JamOperasional, error)
	FindByID(idJamOperasional int) (*entity.JamOperasional, error)
	Create(jo *entity.JamOperasional) error
	Update(jo *entity.JamOperasional) error
	Delete(idJamOperasional int) error
	Search(keyword string) ([]entity.JamOperasional, error)
}

type TarifPengirimanRepository interface {
	FindAll() ([]entity.TarifPengiriman, error)
	FindByID(idTarifPengiriman int) (*entity.TarifPengiriman, error)
	FindByWilayah(wilayah string) (*entity.TarifPengiriman, error)
	Create(tp *entity.TarifPengiriman) error
	Update(tp *entity.TarifPengiriman) error
	Delete(idTarifPengiriman int) error
	Search(keyword string) ([]entity.TarifPengiriman, error)
}
