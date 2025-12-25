package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type PesananRepository interface {
	FindAll() ([]entities.Pesanan, error)
	FindByID(idPesanan int) (*entities.Pesanan, error)
	Create(p *entities.Pesanan) error
	Update(p *entities.Pesanan) error
	Delete(idPesanan int) error

	UpdateStatusByKode(
		kodePesanan string,
		statusPembayaran string,
		statusPesanan string,
		metodePembayaran string,
	) error
}
