package usecase

import (
	"errors"

	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
)

type KasirUsecase struct {
	KasirRepo repo.KasirRepository
}

func NewKasirUsecase(r repo.KasirRepository) *KasirUsecase {
	return &KasirUsecase{KasirRepo: r}
}

// Ambil pesanan yang menunggu verifikasi kasir
func (u *KasirUsecase) GetPesananMenungguVerifikasi() ([]entities.Pesanan, error) {
	return u.KasirRepo.FindMenungguVerifikasi()
}

// Setujui pesanan
func (u *KasirUsecase) SetujuiPesanan(kodePesanan string, kasirID int) error {
	if kodePesanan == "" {
		return errors.New("kode pesanan tidak boleh kosong")
	}

	return u.KasirRepo.UpdateVerifikasiKasir(
		kodePesanan,
		"diproses",
		kasirID,
	)
}

// Tolak pesanan
func (u *KasirUsecase) TolakPesanan(kodePesanan string, kasirID int) error {
	if kodePesanan == "" {
		return errors.New("kode pesanan tidak boleh kosong")
	}

	return u.KasirRepo.UpdateVerifikasiKasir(
		kodePesanan,
		"dibatalkan",
		kasirID,
	)
}
