package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type KasirRepository interface {
	FindMenungguVerifikasi() ([]entities.Pesanan, error)
	UpdateVerifikasiKasir(
		kodePesanan string,
		statusPesanan string,
		kasirID int,
	) error
	UpdatePesananCustomer(
		kodePesanan string,
		statusPesanan string,
	) error
}
