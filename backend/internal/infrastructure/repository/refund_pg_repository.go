package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"

	"gorm.io/gorm"
)

type RefundPgRepository struct {
	DB *gorm.DB
}

func NewRefundPgRepository(db *gorm.DB) *RefundPgRepository {
	return &RefundPgRepository{DB: db}
}

func (r *RefundPgRepository) Create(refund *entities.Refund) error {
	return r.DB.Create(refund).Error
}

func (r *RefundPgRepository) FindByUser(userID uint) ([]entities.Refund, error) {
	var refunds []entities.Refund
	err := r.DB.Where("id_user = ?", userID).Find(&refunds).Error
	return refunds, err
}

func (r *RefundPgRepository) FindByID(id uint) (*entities.Refund, error) {
	var refund entities.Refund
	err := r.DB.First(&refund, "id_refund = ?", id).Error
	if err != nil {
		return nil, err
	}
	return &refund, nil
}

func (r *RefundPgRepository) Update(refund *entities.Refund) error {
	return r.DB.Save(refund).Error
}

func (r *RefundPgRepository) FindAll() ([]entities.Refund, error) {
	var refunds []entities.Refund
	err := r.DB.Find(&refunds).Error
	return refunds, err
}
