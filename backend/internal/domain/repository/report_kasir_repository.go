package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type ReportKasirRepository interface {
	FindTransaksiByKasir(kasirID int) ([]entities.Transaksi, error)
	FindTransaksiByKasirAndPeriode(
		kasirID int,
		startDate string,
		endDate string,
		metodePembayaran string,
	) ([]entities.Transaksi, error)
	FindDetailTransaksiByID(
		transaksiID int,
		kasirID int,
	) (*entities.Transaksi, []entities.DetailTransaksi, error)
}
