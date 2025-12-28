package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
)

type AdminUsecase struct {
	AdminRepo repo.AdminRepository
}

func NewAdminUsecase(r repo.AdminRepository) *AdminUsecase {
	return &AdminUsecase{AdminRepo: r}
}

func (uc *AdminUsecase) GetPesananDiproses() ([]entities.Pesanan, error) {
	return uc.AdminRepo.FindPesananDiproses()
}

// Di dalam struct AdminUsecase
func (uc *AdminUsecase) GetPesananDikemas() ([]entities.Pesanan, error) {
	return uc.AdminRepo.FindPesananDikemas()
}

func (uc *AdminUsecase) GetPesananDikirim() ([]entities.Pesanan, error) {
	return uc.AdminRepo.FindPesananDikirim()
}

func (uc *AdminUsecase) SetPesananDikemas(kode string, adminID int) error {
	return uc.AdminRepo.UpdateStatusPesananAdmin(
		kode,
		"diproses",
		"dikemas",
		adminID,
	)
}

func (uc *AdminUsecase) SetPesananDikirim(kode string, adminID int) error {
	return uc.AdminRepo.UpdateStatusPesananAdmin(
		kode,
		"dikemas",
		"dikirim",
		adminID,
	)
}

func (uc *AdminUsecase) SetPesananSelesai(kode string, adminID int) error {
	if err := uc.AdminRepo.UpdateStatusPesananAdmin(
		kode,
		"dikirim",
		"selesai",
		adminID,
	); err != nil {
		return err
	}

	if err := uc.AdminRepo.InsertTransaksiFromPesanan(
		kode,
	); err != nil {
		return err
	}

	return nil
}
