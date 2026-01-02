package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type JamOperasionalRepository interface {
	FindAll() ([]entities.JamOperasional, error)
	FindByID(idJamOperasional int) (*entities.JamOperasional, error)
	Create(jo *entities.JamOperasional) error
	Update(jo *entities.JamOperasional) error
	Delete(idJamOperasional int) error
	Search(keyword string) ([]entities.JamOperasional, error)
}
