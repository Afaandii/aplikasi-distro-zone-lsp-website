package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type PesananRepository interface {
	FindAll() ([]entities.Pesanan, error)
	FindByID(idPesanan int) (*entities.Pesanan, error)
	Create(p *entities.Pesanan) error
	Update(p *entities.Pesanan) error
	Delete(idPesanan int) error

	// find by kode (kode_pesanan / order id string)
	FindByKode(kodePesanan string) (*entities.Pesanan, error)

	UpdateStatusByKode(
		kodePesanan string,
		statusPembayaran string,
		statusPesanan string,
		metodePembayaran string,
	) error
	FindByUserID(userID int) ([]entities.Pesanan, error)
	FindDetailByUserAndPesananID(userID int, pesananID int) (*entities.Pesanan, error)
	AutoCancelExpiredOrders() (int64, error)
}
