package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
)

type ReportAdminUsecase struct {
	Repo repo.ReportAdminRepository
}

func NewReportAdminUsecase(r repo.ReportAdminRepository) *ReportAdminUsecase {
	return &ReportAdminUsecase{Repo: r}
}

func (uc *ReportAdminUsecase) GetAllTransaksi() ([]entities.Transaksi, error) {
	return uc.Repo.FindAllTransaksi()
}

func (uc *ReportAdminUsecase) GetDetailTransaksiByTransaksiID(
	transaksiID int,
) ([]entities.DetailTransaksi, error) {

	items, err :=
		uc.Repo.FindDetailTransaksiByID(transaksiID)

	if err != nil {
		return nil, err
	}

	return items, nil
}

func (uc *ReportAdminUsecase) GetAllTransaksiByPeriode(start, end string) ([]entities.Transaksi, error) {
	return uc.Repo.FindAllTransaksiByPeriode(start, end)
}

func (uc *ReportAdminUsecase) GetLaporanRugiLaba(start, end string) (*entities.LaporanRugiLaba, error) {
	return uc.Repo.GetLaporanRugiLaba(start, end)
}
