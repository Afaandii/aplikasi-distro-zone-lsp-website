package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type ReportAdminRepository interface {
	FindAllTransaksi() ([]entities.Transaksi, error)
	FindAllTransaksiByPeriode(startDate, endDate string) ([]entities.Transaksi, error)
	FindDetailTransaksiByID(
		transaksiID int,
	) ([]entities.DetailTransaksi, error)

	GetLaporanRugiLaba(startDate, endDate string) (*entities.LaporanRugiLaba, error)
}
