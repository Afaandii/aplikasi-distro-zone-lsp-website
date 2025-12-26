package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type DetailPesananRepository interface {
	Create(detail *entities.DetailPesanan) error
}
