package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/service"
	"errors"
	"fmt"
	"strings"
	"time"
)

type RefundUsecase struct {
	RefundRepo repository.RefundRepository
	Payment    service.PaymentGateway
}

func NewRefundUsecase(repo repository.RefundRepository, payment service.PaymentGateway) *RefundUsecase {
	return &RefundUsecase{
		RefundRepo: repo,
		Payment:    payment,
	}
}

//
// ================= CUSTOMER =================
//

func (u *RefundUsecase) CreateRefund(refund *entities.Refund) error {
	refund.Status = "PENDING"

	kode, total, err := u.RefundRepo.GetTransaksiInfo(refund.TransaksiRef)
	if err != nil {
		return errors.New("transaksi tidak ditemukan")
	}

	kode = strings.TrimPrefix(kode, "TRX-")

	refund.MidtransOrderID = kode
	refund.RefundAmount = int64(total)

	return u.RefundRepo.Create(refund)
}

func (u *RefundUsecase) GetRefundByUser(userID uint) ([]entities.Refund, error) {
	return u.RefundRepo.FindByUser(userID)
}

//
// ================= ADMIN =================
//

func (u *RefundUsecase) GetAllRefunds() ([]entities.Refund, error) {
	return u.RefundRepo.FindAll()
}

func (u *RefundUsecase) GetRefundDetail(id uint) (*entities.Refund, error) {
	return u.RefundRepo.FindByID(id)
}

func (u *RefundUsecase) ApproveRefund(id uint, adminNote string) error {
	refund, err := u.RefundRepo.FindByID(id)
	if err != nil {
		return err
	}

	if refund.Status != "PENDING" {
		return errors.New("refund sudah diproses")
	}

	metodePembayaran := refund.Transaksi.MetodePembayaran
	upperMethod := strings.ToUpper(metodePembayaran)
	manualMethods := []string{"BCA", "VA", "BANK", "MANDIRI", "BRI", "BNI", "PERMATA", "ALFAMART", "INDOMARET"}

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

		return u.RefundRepo.Update(refund)
	}
	fmt.Printf("🔍 Processing API Refund for Metode: %s\n", metodePembayaran)

	refundKey := fmt.Sprintf("refund-%d", time.Now().Unix())

	err = u.Payment.Refund(
		refund.MidtransOrderID,
		refund.RefundAmount,
		refundKey,
	)
	if err != nil {
		return err
	}

	refund.Status = "APPROVED"
	refund.AdminNote = &adminNote
	refund.RefundKey = &refundKey

	return u.RefundRepo.Update(refund)
}

func (u *RefundUsecase) RejectRefund(id uint, adminNote string) error {
	refund, err := u.RefundRepo.FindByID(id)
	if err != nil {
		return err
	}

	if refund.Status != "PENDING" {
		return errors.New("refund sudah diproses")
	}

	refund.Status = "REJECTED"
	refund.AdminNote = &adminNote

	return u.RefundRepo.Update(refund)
}
