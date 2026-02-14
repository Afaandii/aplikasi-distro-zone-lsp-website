package entity

import "time"

type Komplain struct {
	IDKomplain     int       `json:"id_komplain" gorm:"primaryKey;column:id_komplain"`
	PesananRef     int       `json:"id_pesanan" gorm:"column:id_pesanan"`
	UserRef        int       `json:"id_user" gorm:"column:id_user"`
	JenisKomplain  string    `json:"jenis_komplain" gorm:"type:varchar(100)"`
	Deskripsi      string    `json:"deskripsi" gorm:"type:text"`
	StatusKomplain string    `json:"status_komplain" gorm:"type:varchar(100);default:'menunggu'"`
	CreatedAt      time.Time `json:"created_at" gorm:"column:created_at"`
	UpdatedAt      time.Time `json:"updated_at" gorm:"column:updated_at"`

	Pesanan Pesanan `gorm:"foreignKey:PesananRef;references:IDPesanan;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	User    User    `gorm:"foreignKey:UserRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Komplain) TableName() string {
	return "komplain"
}
