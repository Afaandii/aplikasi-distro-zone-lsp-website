package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
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

// internal/domain/usecase/report_kasir_usecase.go
func (uc *ReportKasirUsecase) FindTransaksiByKasirAndPeriode(
	kasirID int,
	startDate string,
	endDate string,
	metodePembayaran string, // ← tambahkan
) ([]entities.Transaksi, error) {
	return uc.Repo.FindTransaksiByKasirAndPeriode(
		kasirID,
		startDate,
		endDate,
		metodePembayaran,
	)
}

func (uc *ReportKasirUsecase) FindDetailLaporanByTransaksiID(
	transaksiID int,
	kasirID int,
) (*entities.Transaksi, []entities.DetailTransaksi, error) {

	transaksi, items, err :=
		uc.Repo.FindDetailTransaksiByID(transaksiID, kasirID)

	if err != nil {
		return nil, nil, err
	}

	if transaksi == nil {
		return nil, nil, errors.New("transaksi tidak ditemukan")
	}

	return transaksi, items, nil
}
