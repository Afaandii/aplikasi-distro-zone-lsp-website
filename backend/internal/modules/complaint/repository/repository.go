package repository

import "aplikasi-distro-zone-lsp-website/internal/shared/entity"

type KomplainRepository interface {
	InsertKomplain(komplain *entity.Komplain) error
	FindKomplainByUser(userID int) ([]entity.Komplain, error)
	FindAllKomplain() ([]entity.Komplain, error)
	FindKomplainByID(id int) (*entity.Komplain, error)
	UpdateStatusKomplain(idKomplain int, status string) error
}

type RefundRepository interface {
	Create(refund *entity.Refund) error
	FindByUser(userID uint) ([]entity.Refund, error)
	FindAll() ([]entity.Refund, error)
	FindByID(id uint) (*entity.Refund, error)
	Update(refund *entity.Refund) error
	GetTransaksiInfo(transaksiID uint) (kodeTransaksi string, total int, err error)
}
