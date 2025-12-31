package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type pesananPGRepository struct {
	db *gorm.DB
}

func NewPesananPGRepository(db *gorm.DB) repo.PesananRepository {
	return &pesananPGRepository{db: db}
}

func (r *pesananPGRepository) FindAll() ([]entities.Pesanan, error) {
	var list []entities.Pesanan
	if err := r.db.Order("id_pesanan").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *pesananPGRepository) FindByID(idPesanan int) (*entities.Pesanan, error) {
	var pes entities.Pesanan
	if err := r.db.First(&pes, idPesanan).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pes, nil
}

func (r *pesananPGRepository) Create(c *entities.Pesanan) error {
	return r.db.Create(c).Error
}

func (r *pesananPGRepository) Update(c *entities.Pesanan) error {
	result := r.db.Model(&entities.Pesanan{}).
		Where("id_pesanan = ?", c.IDPesanan).
		Updates(map[string]interface{}{
			"id_pemesan":          c.PemesanRef,
			"diverifikasi_oleh":   c.DiverifikasiRef,
			"id_tarif_pengiriman": c.TarifPengirimanRef,
			"kode_pesanan":        c.KodePesanan,
			"subtotal":            c.Subtotal,
			"berat":               c.Berat,
			"biaya_ongkir":        c.BiayaOngkir,
			"total_bayar":         c.TotalBayar,
			"alamat_pengiriman":   c.AlamatPengiriman,
			"bukti_pembayaran":    c.BuktiPembayaran,
			"status_pembayaran":   c.StatusPembayaran,
			"status_pesanan":      c.StatusPesanan,
			"metode_pembayaran":   c.MetodePembayaran,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *pesananPGRepository) UpdateStatusByKode(
	kodePesanan string,
	statusPembayaran string,
	statusPesanan string,
	metode string,
) error {

	result := r.db.Model(&entities.Pesanan{}).
		Where("kode_pesanan = ?", kodePesanan).
		Updates(map[string]interface{}{
			"status_pembayaran": statusPembayaran,
			"status_pesanan":    statusPesanan,
			"metode_pembayaran": metode,
		})

	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("pesanan tidak ditemukan")
	}
	return nil
}

func (r *pesananPGRepository) FindByKode(kodePesanan string) (*entities.Pesanan, error) {
	var pes entities.Pesanan
	if err := r.db.Where("kode_pesanan = ?", kodePesanan).First(&pes).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pes, nil
}

func (r *pesananPGRepository) Delete(idPesanan int) error {
	result := r.db.Delete(&entities.Pesanan{}, idPesanan)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *pesananPGRepository) FindByUserID(userID int) ([]entities.Pesanan, error) {
	var list []entities.Pesanan
	err := r.db.Preload("Diverifikasi").Preload("Pemesan").Preload("TarifPengiriman").Preload("DetailPesanan").Preload("DetailPesanan.Produk").Preload("DetailPesanan.Produk.FotoProduk").Preload("DetailPesanan.Produk.FotoProduk.Warna").Preload("DetailPesanan.Produk.Merk").Preload("DetailPesanan.Produk.Tipe").Preload("DetailPesanan.Produk.Varian").Preload("DetailPesanan.Produk.Varian.Ukuran").Preload("DetailPesanan.Produk.Varian.Warna").
		Where("id_pemesan = ?", userID).
		Order("created_at DESC").
		Find(&list).Error

	if err != nil {
		return nil, err
	}
	return list, nil
}
func (r *pesananPGRepository) FindDetailByUserAndPesananID(userID int, pesananID int) (*entities.Pesanan, error) {
	var pesanan entities.Pesanan

	err := r.db.
		Preload("DetailPesanan").Preload("Pemesan").Preload("Diverifikasi").Preload("TarifPengiriman").Preload("DetailPesanan.Produk").Preload("DetailPesanan.Produk.FotoProduk").Preload("DetailPesanan.Produk.FotoProduk.Warna").Preload("DetailPesanan.Produk.Merk").Preload("DetailPesanan.Produk.Tipe").Preload("DetailPesanan.Produk.Varian").Preload("DetailPesanan.Produk.Varian.Ukuran").Preload("DetailPesanan.Produk.Varian.Warna").
		Where("id_pesanan = ? AND id_pemesan = ?", pesananID, userID).
		First(&pesanan).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &pesanan, nil
}
