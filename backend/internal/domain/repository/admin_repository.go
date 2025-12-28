package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type AdminRepository interface {
	FindPesananDiproses() ([]entities.Pesanan, error)
	FindPesananDikemas() ([]entities.Pesanan, error)
	FindPesananDikirim() ([]entities.Pesanan, error)
	UpdateStatusPesananAdmin(
		kodePesanan string,
		fromSatatus string,
		toSatatus string,
		adminID int,
	) error
}
