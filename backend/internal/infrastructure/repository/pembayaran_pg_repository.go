package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type PembayaranPgRepository struct {
	DB *gorm.DB
}

func NewPembayaranPgRepository(db *gorm.DB) *PembayaranPgRepository {
	return &PembayaranPgRepository{DB: db}
}

func (r *PembayaranPgRepository) Create(p *entities.Pembayaran) error {
	return r.DB.Create(p).Error
}

func (r *PembayaranPgRepository) FindByMidtransOrderID(orderID string) (*entities.Pembayaran, error) {
	var pembayaran entities.Pembayaran
	err := r.DB.Where("midtrans_order_id = ?", orderID).First(&pembayaran).Error
	return &pembayaran, err
}

func (r *PembayaranPgRepository) UpdateCallbackMidtrans(
	orderID string,
	status string,
	transactionID string,
	paymentType string,
	va string,
	pdf string,
) error {
	return r.DB.Model(&entities.Pembayaran{}).
		Where("midtrans_order_id = ?", orderID).
		Updates(map[string]interface{}{
			"midtrans_transaction_status": status,
			"midtrans_transaction_id":     transactionID,
			"midtrans_payment_type":       paymentType,
			"midtrans_va_number":          va,
			"midtrans_pdf_url":            pdf,
		}).Error
}
