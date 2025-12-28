package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
)

type ReportKasirUsecase struct {
	Repo repo.ReportKasirRepository
}

func NewReportKasirUsecase(r repo.ReportKasirRepository) *ReportKasirUsecase {
	return &ReportKasirUsecase{Repo: r}
}

func (uc *ReportKasirUsecase) FindTransaksiByKasir(
	kasirID int,
) ([]entities.Transaksi, error) {
	return uc.Repo.FindTransaksiByKasir(
		kasirID,
	)
}

func (uc *ReportKasirUsecase) FindTransaksiByKasirAndPeriode(
	kasirID int,
	startDate string,
	endDate string,
) ([]entities.Transaksi, error) {
	return uc.Repo.FindTransaksiByKasirAndPeriode(
		kasirID,
		startDate,
		endDate,
	)
}
