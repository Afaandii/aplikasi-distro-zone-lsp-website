package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type ReportKasirRepository interface {
	FindTransaksiByKasir(kasirID int) ([]entities.Transaksi, error)
	FindTransaksiByKasirAndPeriode(
		kasirID int,
		startDate string,
		endDate string,
	) ([]entities.Transaksi, error)
}
