package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type adminPgRepository struct {
	db *gorm.DB
}

func NewAdminPgRepository(db *gorm.DB) *adminPgRepository {
	return &adminPgRepository{db: db}
}

func (r *adminPgRepository) FindPesananDiproses() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?",
			"diproses").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) FindPesananDikemas() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?", "dikemas").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) FindPesananDikirim() ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?", "dikirim").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) UpdateStatusPesananAdmin(
	kodePesanan string,
	fromStatus string,
	toStatus string,
	adminID int,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
		    updated_at = NOW()
		WHERE kode_pesanan = $2
		  AND status_pesanan = $3
	`, toStatus, kodePesanan, fromStatus)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}

func (r *adminPgRepository) InsertTransaksiFromPesanan(
	kodePesanan string,
) error {

	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	var transaksiID int

	// Insert transaksi
	err := tx.Raw(`
		INSERT INTO transaksi (
			id_customer,
			id_kasir,
			kode_transaksi,
			total,
			metode_pembayaran,
			status_transaksi,
			created_at
		)
		SELECT
			p.id_pemesan,
			p.diverifikasi_oleh,
			'TRX-' || p.kode_pesanan,
			p.total_bayar,
			p.metode_pembayaran,
			'selesai',
			NOW()
		FROM pesanan p
		WHERE p.kode_pesanan = $1
		  AND p.diverifikasi_oleh IS NOT NULL
		RETURNING id_transaksi
	`, kodePesanan).Scan(&transaksiID).Error

	if err != nil {
		tx.Rollback()
		return err
	}

	// Insert detail_transaksi
	err = tx.Exec(`
		INSERT INTO detail_transaksi (
			id_transaksi,
			id_produk,
			jumlah,
			harga_satuan,
			subtotal,
			created_at
		)
		SELECT
			$1,
			dp.id_produk,
			dp.jumlah,
			dp.harga_satuan,
			dp.total,
			NOW()
		FROM detail_pesanan dp
		JOIN pesanan p ON p.id_pesanan = dp.id_pesanan
		WHERE p.kode_pesanan = $2
	`, transaksiID, kodePesanan).Error

	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}
