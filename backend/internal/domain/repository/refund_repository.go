package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type RefundRepository interface {
	Create(refund *entities.Refund) error

	FindByUser(userID uint) ([]entities.Refund, error)
	FindAll() ([]entities.Refund, error)

	FindByID(id uint) (*entities.Refund, error)
	Update(refund *entities.Refund) error

	// Ambil data transaksi untuk keperluan refund
	GetTransaksiInfo(transaksiID uint) (kodeTransaksi string, total int, err error)
}
