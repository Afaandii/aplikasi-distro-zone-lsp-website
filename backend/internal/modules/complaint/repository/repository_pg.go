package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"

	"gorm.io/gorm"
)

// ==================== Komplain PG ====================

type komplainPGRepository struct{ db *gorm.DB }

func NewKomplainPGRepository(db *gorm.DB) KomplainRepository { return &komplainPGRepository{db: db} }

func (r *komplainPGRepository) InsertKomplain(k *entity.Komplain) error { return r.db.Create(k).Error }

func (r *komplainPGRepository) FindKomplainByUser(userID int) ([]entity.Komplain, error) {
	var data []entity.Komplain
	err := r.db.Preload("Pesanan").Preload("User").Where("id_user = ?", userID).Order("created_at DESC").Find(&data).Error
	return data, err
}

func (r *komplainPGRepository) FindAllKomplain() ([]entity.Komplain, error) {
	var data []entity.Komplain
	err := r.db.Preload("Pesanan").Preload("User").Order("created_at DESC").Find(&data).Error
	return data, err
}

func (r *komplainPGRepository) UpdateStatusKomplain(idKomplain int, status string) error {
	result := r.db.Exec("UPDATE komplain SET status_komplain = ?, updated_at = NOW() WHERE id_komplain = ?", status, idKomplain)
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return result.Error
}

func (r *komplainPGRepository) FindKomplainByID(id int) (*entity.Komplain, error) {
	var k entity.Komplain
	err := r.db.Preload("User").Preload("Pesanan").Where("id_komplain = ?", id).First(&k).Error
	if err != nil {
		return nil, err
	}
	return &k, nil
}

// ==================== Refund PG ====================

type refundPGRepository struct{ db *gorm.DB }

func NewRefundPGRepository(db *gorm.DB) RefundRepository { return &refundPGRepository{db: db} }

func (r *refundPGRepository) Create(refund *entity.Refund) error { return r.db.Create(refund).Error }

func (r *refundPGRepository) FindByUser(userID uint) ([]entity.Refund, error) {
	var refunds []entity.Refund
	err := r.db.Where("id_user = ?", userID).Preload("Transaksi").Preload("User").Preload("Transaksi.Customer").Preload("Transaksi.Kasir").Find(&refunds).Error
	return refunds, err
}

func (r *refundPGRepository) FindAll() ([]entity.Refund, error) {
	var refunds []entity.Refund
	err := r.db.Preload("User").Preload("Transaksi").Preload("Transaksi.Customer").Preload("Transaksi.Kasir").Find(&refunds).Error
	return refunds, err
}

func (r *refundPGRepository) FindByID(id uint) (*entity.Refund, error) {
	var refund entity.Refund
	err := r.db.Preload("User").Preload("Transaksi").Preload("Transaksi.Customer").Preload("Transaksi.Kasir").First(&refund, "id_refund = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &refund, nil
}

func (r *refundPGRepository) Update(refund *entity.Refund) error { return r.db.Save(refund).Error }

func (r *refundPGRepository) GetTransaksiInfo(transaksiID uint) (string, int, error) {
	var kode string
	var total int
	row := r.db.Raw("SELECT kode_transaksi, total FROM transaksi WHERE id_transaksi = ?", transaksiID).Row()
	err := row.Scan(&kode, &total)
	return kode, total, err
}
