package repository

import "aplikasi-distro-zone-lsp-website/internal/shared/entity"

type ReportAdminRepository interface {
	FindAllTransaksi() ([]entity.Transaksi, error)
	FindAllTransaksiByPeriode(startDate, endDate string) ([]entity.Transaksi, error)
	FindDetailTransaksiByID(transaksiID int) ([]entity.DetailTransaksi, error)
	GetLaporanRugiLaba(startDate, endDate string) (*entity.LaporanRugiLaba, error)
}

type ReportKasirRepository interface {
	FindTransaksiByKasir(kasirID int) ([]entity.Transaksi, error)
	FindTransaksiByKasirAndPeriode(kasirID int, startDate, endDate, metodePembayaran string) ([]entity.Transaksi, error)
	FindDetailTransaksiByID(transaksiID, kasirID int) (*entity.Transaksi, []entity.DetailTransaksi, error)
}
