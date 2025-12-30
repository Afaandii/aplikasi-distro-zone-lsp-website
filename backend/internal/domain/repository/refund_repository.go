package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type RefundRepository interface {
	Create(refund *entities.Refund) error
	FindByUser(userID uint) ([]entities.Refund, error)
	FindByID(id uint) (*entities.Refund, error)
	Update(refund *entities.Refund) error
	FindAll() ([]entities.Refund, error)
}
