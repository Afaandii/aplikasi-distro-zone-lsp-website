package usecase

import (
	"errors"

	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
)

type KomplainUsecase struct {
	Repo repo.KomplainRepository
}

func NewKomplainUsecase(r repo.KomplainRepository) *KomplainUsecase {
	return &KomplainUsecase{Repo: r}
}

// CUSTOMER
func (uc *KomplainUsecase) BuatKomplain(
	userID int,
	idPesanan int,
	jenis string,
	deskripsi string,
) error {

	if jenis == "" || deskripsi == "" {
		return errors.New("jenis dan deskripsi wajib diisi")
	}

	komplain := &entities.Komplain{
		PesananRef:     idPesanan,
		UserRef:        userID,
		JenisKomplain:  jenis,
		Deskripsi:      deskripsi,
		StatusKomplain: "menunggu",
	}

	return uc.Repo.InsertKomplain(komplain)
}

// CUSTOMER
func (uc *KomplainUsecase) GetKomplainByUser(userID int) ([]entities.Komplain, error) {
	return uc.Repo.FindKomplainByUser(userID)
}

// ADMIN
func (uc *KomplainUsecase) GetAllKomplain() ([]entities.Komplain, error) {
	return uc.Repo.FindAllKomplain()
}

// ADMIN
func (uc *KomplainUsecase) UpdateStatus(
	idKomplain int,
	status string,
) error {

	valid := map[string]bool{
		"menunggu": true,
		"diproses": true,
		"selesai":  true,
	}

	if !valid[status] {
		return errors.New("status komplain tidak valid")
	}

	return uc.Repo.UpdateStatusKomplain(idKomplain, status)
}

func (uc *KomplainUsecase) GetKomplainByID(id int) (*entities.Komplain, error) {
	return uc.Repo.FindKomplainByID(id)
}
