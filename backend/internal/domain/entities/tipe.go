package entities

import "time"

type Tipe struct {
	IDTipe     int       `json:"id_tipe" gorm:"primaryKey;column:id_tipe;autoIncrement"`
	NamaTipe   string    `json:"nama_tipe" gorm:"type:varchar(255)"`
	Keterangan string    `json:"keterangan" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// hasmany ke produk
	Produk []Produk `gorm:"foreignKey:TipeRef;references:IDTipe"`
}

func (Tipe) TableName() string {
	return "tipe"
}
