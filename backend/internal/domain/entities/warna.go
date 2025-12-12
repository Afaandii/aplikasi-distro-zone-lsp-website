package entities

import "time"

type Warna struct {
	IDWarna    int       `json:"id_warna" gorm:"primaryKey;column:id_warna;autoIncrement"`
	NamaWarna  string    `json:"nama_warna" gorm:"type:varchar(255)"`
	Keterangan string    `json:"keterangan" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	//hasmany ke produk
	Produk []Produk `gorm:"foreignKey:IdWarna;references:IDWarna;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Warna) TableName() string {
	return "warna"
}
