package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/service"
	"errors"
	"fmt"
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

// CUSTOMER
func (u *RefundUsecase) CreateRefund(refund *entities.Refund) error {
	refund.Status = "PENDING"
	return u.RefundRepo.Create(refund)
}

func (u *RefundUsecase) GetRefundByUser(userID uint) ([]entities.Refund, error) {
	return u.RefundRepo.FindByUser(userID)
}

// ADMIN
func (u *RefundUsecase) GetAllRefunds() ([]entities.Refund, error) {
	return u.RefundRepo.FindAll()
}

func (u *RefundUsecase) ProcessRefund(id uint, status string, note *string) error {
	refund, err := u.RefundRepo.FindByID(id)
	if err != nil {
		return err
	}

	if refund.Status != "PENDING" {
		return errors.New("refund already processed")
	}

	refund.Status = status
	refund.AdminNote = note

	return u.RefundRepo.Update(refund)
}

func (u *RefundUsecase) RequestRefund(
	userID uint,
	transaksi entities.Transaksi,
	reason string,
) error {

	refund := &entities.Refund{
		UserRef:         userID,
		TransaksiRef:    uint(transaksi.IDTransaksi),
		Reason:          reason,
		Status:          "PENDING",
		MidtransOrderID: transaksi.KodeTransaksi,
		RefundAmount:    int64(transaksi.Total),
	}

	return u.RefundRepo.Create(refund)
}

func (u *RefundUsecase) ApproveRefund(refundID uint, adminNote string) error {
	refund, err := u.RefundRepo.FindByID(refundID)
	if err != nil {
		return err
	}

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
