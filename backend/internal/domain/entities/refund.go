package entities

import "time"

type Refund struct {
	IDRefund        uint      `json:"id_refund" gorm:"primaryKey;column:id_refund"`
	TransaksiRef    uint      `json:"id_transaksi" gorm:"column:id_transaksi"`
	UserRef         uint      `json:"id_user" gorm:"column:id_user"`
	Reason          string    `json:"reason" gorm:"type:text"`
	Status          string    `json:"status" gorm:"type:varchar(100);default:'PENDING'"`
	AdminNote       *string   `json:"admin_note" gorm:"type:text"`
	MidtransOrderID string    `json:"midtrans_order_id" gorm:"column:midtrans_order_id"`
	RefundAmount    int64     `json:"refund_amount" gorm:"column:refund_amount"`
	RefundKey       *string   `json:"refund_key" gorm:"column:refund_key"`
	CreatedAt       time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt       time.Time `json:"updated_at" gorm:"column:updated_at"`

	Transaksi Transaksi `gorm:"foreignKey:TransaksiRef;references:IDTransaksi;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	User      User      `gorm:"foreignKey:UserRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Refund) TableName() string {
	return "refund"
}
