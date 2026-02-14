package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/report/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"errors"
)

// ==================== Report Admin Service ====================

type ReportAdminService struct {
	Repo repository.ReportAdminRepository
}

func NewReportAdminService(r repository.ReportAdminRepository) *ReportAdminService {
	return &ReportAdminService{Repo: r}
}

func (s *ReportAdminService) GetAllTransaksi() ([]entity.Transaksi, error) {
	return s.Repo.FindAllTransaksi()
}

func (s *ReportAdminService) GetDetailTransaksiByTransaksiID(transaksiID int) ([]entity.DetailTransaksi, error) {
	items, err := s.Repo.FindDetailTransaksiByID(transaksiID)
	if err != nil {
		return nil, err
	}
	return items, nil
}

func (s *ReportAdminService) GetAllTransaksiByPeriode(start, end string) ([]entity.Transaksi, error) {
	return s.Repo.FindAllTransaksiByPeriode(start, end)
}

func (s *ReportAdminService) GetLaporanRugiLaba(start, end string) (*entity.LaporanRugiLaba, error) {
	return s.Repo.GetLaporanRugiLaba(start, end)
}

// ==================== Report Kasir Service ====================

type ReportKasirService struct {
	Repo repository.ReportKasirRepository
}

func NewReportKasirService(r repository.ReportKasirRepository) *ReportKasirService {
	return &ReportKasirService{Repo: r}
}

func (s *ReportKasirService) FindTransaksiByKasir(kasirID int) ([]entity.Transaksi, error) {
	return s.Repo.FindTransaksiByKasir(kasirID)
}

func (s *ReportKasirService) FindTransaksiByKasirAndPeriode(kasirID int, startDate, endDate, metodePembayaran string) ([]entity.Transaksi, error) {
	return s.Repo.FindTransaksiByKasirAndPeriode(kasirID, startDate, endDate, metodePembayaran)
}

func (s *ReportKasirService) FindDetailLaporanByTransaksiID(transaksiID, kasirID int) (*entity.Transaksi, []entity.DetailTransaksi, error) {
	transaksi, items, err := s.Repo.FindDetailTransaksiByID(transaksiID, kasirID)
	if err != nil {
		return nil, nil, err
	}
	if transaksi == nil {
		return nil, nil, errors.New("transaksi tidak ditemukan")
	}
	return transaksi, items, nil
}
