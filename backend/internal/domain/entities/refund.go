package entities

import "time"

type Refund struct {
	ID              uint      `gorm:"primaryKey;column:id_refund"`
	TransaksiRef    uint      `gorm:"column:id_transaksi"`
	UserRef         uint      `gorm:"column:id_user"`
	Reason          string    `gorm:"type:text"`
	Status          string    `gorm:"type:varchar(100);default:'PENDING'"`
	AdminNote       *string   `gorm:"type:text"`
	MidtransOrderID string    `gorm:"column:midtrans_order_id"`
	RefundAmount    int64     `gorm:"column:refund_amount"`
	RefundKey       *string   `gorm:"column:refund_key"`
	CreatedAt       time.Time `gorm:"column:created_at"`
	UpdatedAt       time.Time `gorm:"column:updated_at"`

	Transaksi Transaksi `gorm:"foreignKey:TransaksiRef;references:IDTransaksi;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Refund) TableName() string {
	return "refund"
}
