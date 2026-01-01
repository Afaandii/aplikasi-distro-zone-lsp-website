package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type KomplainRepository interface {
	InsertKomplain(komplain *entities.Komplain) error
	FindKomplainByUser(userID int) ([]entities.Komplain, error)
	FindAllKomplain() ([]entities.Komplain, error)
	FindKomplainByID(id int) (*entities.Komplain, error)
	UpdateStatusKomplain(idKomplain int, status string) error
}
