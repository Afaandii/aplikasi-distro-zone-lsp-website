package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"context"
	"errors"
	"fmt"
	"time"

	"gorm.io/gorm"
)

// ==================== Cart PG ====================

type cartPGRepository struct{ db *gorm.DB }

func NewCartPGRepository(db *gorm.DB) CartRepository { return &cartPGRepository{db: db} }

func (r *cartPGRepository) GetActiveCartByUserID(ctx context.Context, userID int) (*entity.Cart, error) {
	var cart entity.Cart
	err := r.db.WithContext(ctx).Where("id_user = ? AND status = ?", userID, "active").First(&cart).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get active cart: %w", err)
	}
	return &cart, nil
}

func (r *cartPGRepository) CreateCart(ctx context.Context, cart *entity.Cart) error {
	return r.db.WithContext(ctx).Create(cart).Error
}

func (r *cartPGRepository) GetCartItemsByCartID(ctx context.Context, cartID int) ([]entity.CartItem, error) {
	var items []entity.CartItem
	err := r.db.WithContext(ctx).Preload("Produk").Preload("Produk.FotoProduk").Preload("Warna").Preload("Ukuran").
		Where("id_cart = ?", cartID).Find(&items).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get cart items: %w", err)
	}
	return items, nil
}

func (r *cartPGRepository) GetCartItemByID(ctx context.Context, id int) (*entity.CartItem, error) {
	var item entity.CartItem
	err := r.db.WithContext(ctx).Preload("Cart").Preload("Produk").Preload("Produk.FotoProduk").Preload("Warna").Preload("Ukuran").
		Where("id_cart_item = ?", id).First(&item).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("cart item not found")
		}
		return nil, fmt.Errorf("failed to get cart item: %w", err)
	}
	return &item, nil
}

func (r *cartPGRepository) CreateCartItem(ctx context.Context, item *entity.CartItem) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *cartPGRepository) UpdateCartItem(ctx context.Context, item *entity.CartItem) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *cartPGRepository) DeleteCartItem(ctx context.Context, id int) error {
	result := r.db.WithContext(ctx).Delete(&entity.CartItem{}, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete cart item: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return errors.New("cart item not found")
	}
	return nil
}

func (r *cartPGRepository) DeleteAllCartItems(ctx context.Context, cartID int) error {
	result := r.db.WithContext(ctx).Where("id_cart = ?", cartID).Delete(&entity.CartItem{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete all cart items: %w", result.Error)
	}
	return nil
}

// ==================== Pesanan PG ====================

type pesananPGRepository struct{ db *gorm.DB }

func NewPesananPGRepository(db *gorm.DB) PesananRepository { return &pesananPGRepository{db: db} }

func (r *pesananPGRepository) FindAll() ([]entity.Pesanan, error) {
	var list []entity.Pesanan
	if err := r.db.Order("id_pesanan").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *pesananPGRepository) FindByID(id int) (*entity.Pesanan, error) {
	var pes entity.Pesanan
	if err := r.db.First(&pes, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pes, nil
}

func (r *pesananPGRepository) Create(p *entity.Pesanan) error { return r.db.Create(p).Error }

func (r *pesananPGRepository) Update(p *entity.Pesanan) error {
	result := r.db.Model(&entity.Pesanan{}).Where("id_pesanan = ?", p.IDPesanan).Updates(map[string]interface{}{
		"id_pemesan": p.PemesanRef, "diverifikasi_oleh": p.DiverifikasiRef, "id_tarif_pengiriman": p.TarifPengirimanRef,
		"kode_pesanan": p.KodePesanan, "subtotal": p.Subtotal, "berat": p.Berat,
		"biaya_ongkir": p.BiayaOngkir, "total_bayar": p.TotalBayar, "alamat_pengiriman": p.AlamatPengiriman,
		"bukti_pembayaran": p.BuktiPembayaran, "status_pembayaran": p.StatusPembayaran,
		"status_pesanan": p.StatusPesanan, "metode_pembayaran": p.MetodePembayaran,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}
	return nil
}

func (r *pesananPGRepository) UpdateStatusByKode(kodePesanan, statusPembayaran, statusPesanan, metode string) error {
	result := r.db.Model(&entity.Pesanan{}).Where("kode_pesanan = ?", kodePesanan).Updates(map[string]interface{}{
		"status_pembayaran": statusPembayaran, "status_pesanan": statusPesanan, "metode_pembayaran": metode,
	})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("pesanan tidak ditemukan")
	}
	return nil
}

func (r *pesananPGRepository) FindByKode(kodePesanan string) (*entity.Pesanan, error) {
	var pes entity.Pesanan
	if err := r.db.Where("kode_pesanan = ?", kodePesanan).First(&pes).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pes, nil
}

func (r *pesananPGRepository) Delete(id int) error {
	result := r.db.Delete(&entity.Pesanan{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *pesananPGRepository) FindByUserID(userID int) ([]entity.Pesanan, error) {
	var list []entity.Pesanan
	err := r.db.Preload("Diverifikasi").Preload("Pemesan").Preload("TarifPengiriman").
		Preload("DetailPesanan").Preload("DetailPesanan.Produk").Preload("DetailPesanan.Produk.FotoProduk").
		Preload("DetailPesanan.Produk.FotoProduk.Warna").Preload("DetailPesanan.Produk.Merk").Preload("DetailPesanan.Produk.Tipe").
		Preload("DetailPesanan.Produk.Varian").Preload("DetailPesanan.Produk.Varian.Ukuran").Preload("DetailPesanan.Produk.Varian.Warna").
		Where("id_pemesan = ?", userID).Order("created_at DESC").Find(&list).Error
	return list, err
}

func (r *pesananPGRepository) FindDetailByUserAndPesananID(userID, pesananID int) (*entity.Pesanan, error) {
	var pesanan entity.Pesanan
	err := r.db.Preload("DetailPesanan").Preload("Pemesan").Preload("Diverifikasi").Preload("TarifPengiriman").
		Preload("DetailPesanan.Produk").Preload("DetailPesanan.Produk.FotoProduk").Preload("DetailPesanan.Produk.FotoProduk.Warna").
		Preload("DetailPesanan.Produk.Merk").Preload("DetailPesanan.Produk.Tipe").Preload("DetailPesanan.Produk.Varian").
		Preload("DetailPesanan.Produk.Varian.Ukuran").Preload("DetailPesanan.Produk.Varian.Warna").
		Where("id_pesanan = ? AND id_pemesan = ?", pesananID, userID).First(&pesanan).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pesanan, nil
}

func (r *pesananPGRepository) AutoCancelExpiredOrders() (int64, error) {
	threshold := time.Now().Add(-24 * time.Hour)
	result := r.db.Model(&entity.Pesanan{}).Where("status_pesanan = ?", "menunggu_pembayaran").Where("created_at < ?", threshold).Update("status_pesanan", "dibatalkan")
	return result.RowsAffected, result.Error
}

// ==================== DetailPesanan PG ====================

type detailPesananPGRepository struct{ db *gorm.DB }

func NewDetailPesananPGRepository(db *gorm.DB) DetailPesananRepository {
	return &detailPesananPGRepository{db: db}
}

func (r *detailPesananPGRepository) Create(detail *entity.DetailPesanan) error {
	return r.db.Create(detail).Error
}

// ==================== Pembayaran PG ====================

type pembayaranPGRepository struct{ db *gorm.DB }

func NewPembayaranPGRepository(db *gorm.DB) PembayaranRepository {
	return &pembayaranPGRepository{db: db}
}

func (r *pembayaranPGRepository) Create(p *entity.Pembayaran) error { return r.db.Create(p).Error }

func (r *pembayaranPGRepository) FindByMidtransOrderID(orderID string) (*entity.Pembayaran, error) {
	var pembayaran entity.Pembayaran
	err := r.db.Where("midtrans_order_id = ?", orderID).First(&pembayaran).Error
	return &pembayaran, err
}

func (r *pembayaranPGRepository) UpdateCallbackMidtrans(orderID, status, transactionID, paymentType, va, pdf string) error {
	return r.db.Model(&entity.Pembayaran{}).Where("midtrans_order_id = ?", orderID).Updates(map[string]interface{}{
		"midtrans_transaction_status": status, "midtrans_transaction_id": transactionID,
		"midtrans_payment_type": paymentType, "midtrans_va_number": va, "midtrans_pdf_url": pdf,
	}).Error
}
