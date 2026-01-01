package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type RefundPgRepository struct {
	DB *gorm.DB
}

func NewRefundPgRepository(db *gorm.DB) *RefundPgRepository {
	return &RefundPgRepository{DB: db}
}

func (r *RefundPgRepository) Create(refund *entities.Refund) error {
	return r.DB.Create(refund).Error
}

func (r *RefundPgRepository) FindByUser(userID uint) ([]entities.Refund, error) {
	var refunds []entities.Refund
	err := r.DB.
		Where("id_user = ?", userID).
		Preload("Transaksi").Preload("User").Preload("Transaksi.Customer").Preload("Transaksi.Kasir").
		Find(&refunds).Error
	return refunds, err
}

func (r *RefundPgRepository) FindAll() ([]entities.Refund, error) {
	var refunds []entities.Refund
	err := r.DB.
		Preload("User").
		Preload("Transaksi").
		Preload("Transaksi.Customer").
		Preload("Transaksi.Kasir").
		Find(&refunds).Error
	return refunds, err
}

func (r *RefundPgRepository) FindByID(id uint) (*entities.Refund, error) {
	var refund entities.Refund
	err := r.DB.
		Preload("User").
		Preload("Transaksi").
		Preload("Transaksi.Customer").
		Preload("Transaksi.Kasir").
		First(&refund, "id_refund = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &refund, nil
}

func (r *RefundPgRepository) Update(refund *entities.Refund) error {
	return r.DB.Save(refund).Error
}

func (r *RefundPgRepository) GetTransaksiInfo(transaksiID uint) (string, int, error) {
	var kode string
	var total int

	row := r.DB.Raw(`
		SELECT kode_transaksi, total
		FROM transaksi
		WHERE id_transaksi = ?
	`, transaksiID).Row()

	err := row.Scan(&kode, &total)
	return kode, total, err
}
