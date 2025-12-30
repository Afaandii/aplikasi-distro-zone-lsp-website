package entities

import "time"

type Komplain struct {
	IDKomplain     int       `gorm:"primaryKey;column:id_komplain"`
	PesananRef     int       `gorm:"column:id_pesanan"`
	UserRef        int       `gorm:"column:id_user"`
	JenisKomplain  string    `gorm:"type:varchar(100)"`
	Deskripsi      string    `gorm:"type:text"`
	StatusKomplain string    `gorm:"type:varchar(100);default:'menunggu'"`
	CreatedAt      time.Time `gorm:"column:created_at"`
	UpdatedAt      time.Time `gorm:"column:updated_at"`

	Pesanan Pesanan `gorm:"foreignKey:PesananRef;references:IDPesanan;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	User    User    `gorm:"foreignKey:UserRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Komplain) TableName() string {
	return "komplain"
}
