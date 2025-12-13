package entities

import "time"

type Transaksi struct {
	IDTransaksi      int       `json:"id_transaksi" gorm:"primaryKey;column:id_transaksi;autoIncrement"`
	UserRef          int       `json:"id_user" gorm:"column:id_user;not null"`
	KodeTransaksi    string    `json:"kode_transaksi" gorm:"type:varchar(255)"`
	Total            int       `json:"total" gorm:"type:int"`
	MetodePembayaran string    `json:"metode_pembayaran" gorm:"type:varchar(255)"`
	StatusTransaksi  string    `json:"status_transaksi" gorm:"type:varchar(255)"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`

	User User `gorm:"foreignKey:UserRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`

	DetailTransaksi []DetailTransaksi `gorm:"foreignKey:TransaksiRef;references:IDTransaksi"`
}

func (Transaksi) TableName() string {
	return "transaksi"
}
