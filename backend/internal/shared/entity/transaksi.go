package entity

import "time"

type Transaksi struct {
	IDTransaksi      int       `json:"id_transaksi" gorm:"primaryKey;column:id_transaksi;autoIncrement"`
	CustomerRef      int       `json:"id_customer" gorm:"column:id_customer;not null"`
	KasirRef         int       `json:"id_kasir" gorm:"column:id_kasir;not null"`
	KodeTransaksi    string    `json:"kode_transaksi" gorm:"type:varchar(255)"`
	Total            int       `json:"total" gorm:"type:int"`
	MetodePembayaran string    `json:"metode_pembayaran" gorm:"type:varchar(255)"`
	StatusTransaksi  string    `json:"status_transaksi" gorm:"type:varchar(255)"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`

	Customer User `gorm:"foreignKey:CustomerRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Kasir    User `gorm:"foreignKey:KasirRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`

	DetailTransaksi []DetailTransaksi `gorm:"foreignKey:TransaksiRef;references:IDTransaksi"`
	Refund          []Refund          `gorm:"foreignKey:TransaksiRef;references:IDTransaksi"`
}

func (Transaksi) TableName() string {
	return "transaksi"
}
