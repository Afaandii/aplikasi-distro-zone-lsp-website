package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type kasirPgRepository struct {
	db *gorm.DB
}

func NewKasirPgRepository(db *gorm.DB) *kasirPgRepository {
	return &kasirPgRepository{db: db}
}

func (r *kasirPgRepository) FindMenungguVerifikasi() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.Preload("Pemesan").
		Where("status_pembayaran = ? AND status_pesanan = ?", "paid", "menunggu_verifikasi_kasir").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *kasirPgRepository) UpdateVerifikasiKasir(
	kodePesanan string,
	statusPesanan string,
	kasirID int,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
		    diverifikasi_oleh = $2,
				verifikasi_pada = NOW(),
		    updated_at = NOW()
		WHERE kode_pesanan = $3
		  AND status_pembayaran = 'paid'
		  AND status_pesanan = 'menunggu_verifikasi_kasir'
	`, statusPesanan, kasirID, kodePesanan)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}

func (r *kasirPgRepository) UpdatePesananCustomer(
	kodePesanan string,
	statusPesanan string,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
				verifikasi_pada = NOW(),
		    updated_at = NOW()
		WHERE kode_pesanan = $2
		  AND status_pembayaran = 'paid'
		  AND status_pesanan IN ('diproses', 'menunggu_verifikasi_kasir')
	`, statusPesanan, kodePesanan)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}
