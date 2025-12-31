package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type PembayaranRepository interface {
	Create(p *entities.Pembayaran) error
	FindByMidtransOrderID(orderID string) (*entities.Pembayaran, error)
	// update callback fields received from midtrans
	UpdateCallbackMidtrans(orderID string, status string, transactionID string, paymentType string, va string, pdf string) error
}
