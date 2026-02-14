package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/complaint/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/pkg/service"
	"errors"
	"fmt"
	"strings"
	"time"
)

// ==================== Komplain Service ====================

type KomplainService struct{ Repo repository.KomplainRepository }

func NewKomplainService(r repository.KomplainRepository) *KomplainService {
	return &KomplainService{Repo: r}
}

func (s *KomplainService) BuatKomplain(userID, idPesanan int, jenis, deskripsi string) error {
	if jenis == "" || deskripsi == "" {
		return errors.New("jenis dan deskripsi wajib diisi")
	}
	k := &entity.Komplain{PesananRef: idPesanan, UserRef: userID, JenisKomplain: jenis, Deskripsi: deskripsi, StatusKomplain: "menunggu"}
	return s.Repo.InsertKomplain(k)
}

func (s *KomplainService) GetKomplainByUser(userID int) ([]entity.Komplain, error) {
	return s.Repo.FindKomplainByUser(userID)
}
func (s *KomplainService) GetAllKomplain() ([]entity.Komplain, error) {
	return s.Repo.FindAllKomplain()
}
func (s *KomplainService) GetKomplainByID(id int) (*entity.Komplain, error) {
	return s.Repo.FindKomplainByID(id)
}

func (s *KomplainService) UpdateStatus(idKomplain int, status string) error {
	valid := map[string]bool{"menunggu": true, "diproses": true, "selesai": true}
	if !valid[status] {
		return errors.New("status komplain tidak valid")
	}
	return s.Repo.UpdateStatusKomplain(idKomplain, status)
}

// ==================== Refund Service ====================

type RefundService struct {
	RefundRepo repository.RefundRepository
	Payment    service.PaymentGateway
}

func NewRefundService(repo repository.RefundRepository, payment service.PaymentGateway) *RefundService {
	return &RefundService{RefundRepo: repo, Payment: payment}
}

func (s *RefundService) CreateRefund(refund *entity.Refund) error {
	refund.Status = "PENDING"
	kode, total, err := s.RefundRepo.GetTransaksiInfo(refund.TransaksiRef)
	if err != nil {
		return errors.New("transaksi tidak ditemukan")
	}
	kode = strings.TrimPrefix(kode, "TRX-")
	refund.MidtransOrderID = kode
	refund.RefundAmount = int64(total)
	return s.RefundRepo.Create(refund)
}

func (s *RefundService) GetRefundByUser(userID uint) ([]entity.Refund, error) {
	return s.RefundRepo.FindByUser(userID)
}
func (s *RefundService) GetAllRefunds() ([]entity.Refund, error) { return s.RefundRepo.FindAll() }
func (s *RefundService) GetRefundDetail(id uint) (*entity.Refund, error) {
	return s.RefundRepo.FindByID(id)
}

func (s *RefundService) ApproveRefund(id uint, adminNote string) error {
	refund, err := s.RefundRepo.FindByID(id)
	if err != nil {
		return err
	}
	if refund.Status != "PENDING" {
		return errors.New("refund sudah diproses")
	}
	metodePembayaran := refund.Transaksi.MetodePembayaran
	upperMethod := strings.ToUpper(metodePembayaran)
	manualMethods := []string{"BCA", "VA", "BANK", "MANDIRI", "BRI", "BNI", "PERMATA", "ALFAMART", "INDOMARET", "DANA"}
	isManual := false
	for _, keyword := range manualMethods {
		if strings.Contains(upperMethod, keyword) {
			isManual = true
			break
		}
	}
	if isManual {
		fmt.Printf("🔍 Processing Manual Refund for Metode: %s\n", metodePembayaran)
		refund.Status = "APPROVED"
		refund.AdminNote = &adminNote
		refund.RefundKey = nil
		return s.RefundRepo.Update(refund)
	}
	fmt.Printf("🔍 Processing API Refund for Metode: %s\n", metodePembayaran)
	refundKey := fmt.Sprintf("refund-%d", time.Now().Unix())
	err = s.Payment.Refund(refund.MidtransOrderID, refund.RefundAmount, refundKey)
	if err != nil {
		msg := fmt.Sprintf("%v", err)
		if !strings.Contains(msg, "Duplicate") && !strings.Contains(msg, "406") {
			return err
		}
	}
	refund.Status = "APPROVED"
	refund.AdminNote = &adminNote
	refund.RefundKey = &refundKey
	return s.RefundRepo.Update(refund)
}

func (s *RefundService) RejectRefund(id uint, adminNote string) error {
	refund, err := s.RefundRepo.FindByID(id)
	if err != nil {
		return err
	}
	if refund.Status != "PENDING" {
		return errors.New("refund sudah diproses")
	}
	refund.Status = "REJECTED"
	refund.AdminNote = &adminNote
	return s.RefundRepo.Update(refund)
}
