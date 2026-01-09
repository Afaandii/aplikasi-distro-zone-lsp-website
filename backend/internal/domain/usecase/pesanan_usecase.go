package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type PesananUsecase interface {
	GetAll() ([]entities.Pesanan, error)
	GetByID(idPesanan int) (*entities.Pesanan, error)
	Create(id_pemesan int, diverifikasi_oleh *int, id_tarif_pengiriman int, kode_pesanan string, subtotal int, berat int, biaya_ongkir int, total_bayar int, alamat_pengiriman string, bukti_pembayaran string, status_pembayaran string, status_pesanan string, metode_pembayaran string) (*entities.Pesanan, error)
	Update(idPesanan int, id_pemesan int, diverifikasi_oleh *int, id_tarif_pengiriman int, kode_pesanan string, subtotal int, berat int, biaya_ongkir int, total_bayar int, alamat_pengiriman string, bukti_pembayaran string, status_pembayaran string, status_pesanan string, metode_pembayaran string) (*entities.Pesanan, error)
	Delete(idPesanan int) error

	GetByUser(userID int) ([]entities.Pesanan, error)
	GetDetailByUser(userID int, pesananID int) (*entities.Pesanan, error)
	AutoCancelExpiredOrders() (int64, error)
}

type pesananUsecase struct {
	repo repository.PesananRepository
}

func NewPesananUsecase(r repository.PesananRepository) PesananUsecase {
	return &pesananUsecase{repo: r}
}

func (u *pesananUsecase) GetAll() ([]entities.Pesanan, error) {
	return u.repo.FindAll()
}

func (u *pesananUsecase) GetByID(idPesanan int) (*entities.Pesanan, error) {
	ps, err := u.repo.FindByID(idPesanan)
	if err != nil {
		return nil, err
	}
	if ps == nil {
		return nil, helper.PesananNotFoundError(idPesanan)
	}
	return ps, nil
}

func (u *pesananUsecase) Create(id_pemesan int, diverifikasi_oleh *int, id_tarif_pengiriman int, kode_pesanan string, subtotal int, berat int, biaya_ongkir int, total_bayar int, alamat_pengiriman string, bukti_pembayaran string, status_pembayaran string, status_pesanan string, metode_pembayaran string) (*entities.Pesanan, error) {
	m := &entities.Pesanan{
		PemesanRef:         id_pemesan,
		DiverifikasiRef:    diverifikasi_oleh,
		TarifPengirimanRef: id_tarif_pengiriman,
		KodePesanan:        kode_pesanan,
		Subtotal:           subtotal,
		Berat:              berat,
		BiayaOngkir:        biaya_ongkir,
		TotalBayar:         total_bayar,
		AlamatPengiriman:   alamat_pengiriman,
		BuktiPembayaran:    bukti_pembayaran,
		StatusPembayaran:   status_pembayaran,
		StatusPesanan:      status_pesanan,
		MetodePembayaran:   metode_pembayaran,
	}
	err := u.repo.Create(m)
	if err != nil {
		return nil, err
	}
	return m, nil
}

func (u *pesananUsecase) Update(idPesanan int, id_pemesan int, diverifikasi_oleh *int, id_tarif_pengiriman int, kode_pesanan string, subtotal int, berat int, biaya_ongkir int, total_bayar int, alamat_pengiriman string, bukti_pembayaran string, status_pembayaran string, status_pesanan string, metode_pembayaran string) (*entities.Pesanan, error) {
	existing, err := u.repo.FindByID(idPesanan)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.PesananNotFoundError(idPesanan)
	}
	existing.PemesanRef = id_pemesan
	existing.DiverifikasiRef = diverifikasi_oleh
	existing.TarifPengirimanRef = id_tarif_pengiriman
	existing.KodePesanan = kode_pesanan
	existing.Subtotal = subtotal
	existing.Berat = berat
	existing.BiayaOngkir = biaya_ongkir
	existing.TotalBayar = total_bayar
	existing.AlamatPengiriman = alamat_pengiriman
	existing.BuktiPembayaran = bukti_pembayaran
	existing.StatusPembayaran = status_pembayaran
	existing.StatusPesanan = status_pesanan
	existing.MetodePembayaran = metode_pembayaran
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *pesananUsecase) Delete(idPesanan int) error {
	existing, err := u.repo.FindByID(idPesanan)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.PesananNotFoundError(idPesanan)
	}
	return u.repo.Delete(idPesanan)
}

func (u *pesananUsecase) GetByUser(userID int) ([]entities.Pesanan, error) {
	return u.repo.FindByUserID(userID)
}

func (u *pesananUsecase) GetDetailByUser(userID int, pesananID int) (*entities.Pesanan, error) {
	pesanan, err := u.repo.FindDetailByUserAndPesananID(userID, pesananID)
	if err != nil {
		return nil, err
	}
	if pesanan == nil {
		return nil, helper.PesananNotFoundError(pesananID)
	}
	return pesanan, nil
}

func (u *pesananUsecase) AutoCancelExpiredOrders() (int64, error) {
	return u.repo.AutoCancelExpiredOrders()
}
