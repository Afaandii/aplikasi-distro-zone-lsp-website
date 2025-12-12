package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type TarifPengirimanRepository interface {
	FindAll() ([]entities.TarifPengiriman, error)
	FindByID(idTarifPengiriman int) (*entities.TarifPengiriman, error)
	Create(tp *entities.TarifPengiriman) error
	Update(tp *entities.TarifPengiriman) error
	Delete(idTarifPengiriman int) error
}
