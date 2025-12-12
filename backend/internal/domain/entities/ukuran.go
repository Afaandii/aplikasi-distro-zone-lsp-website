package entities

import "time"

type Ukuran struct {
	IDUkuran   int       `json:"id_ukuran" gorm:"primaryKey;column:id_ukuran;autoIncrement"`
	NamaUkuran string    `json:"nama_ukuran" gorm:"type:varchar(255)"`
	Keterangan string    `json:"keterangan" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// hasmany ke produk
	Produk []Produk `gorm:"foreignKey:IdUkuran;references:IDUkuran;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Ukuran) TableName() string {
	return "ukuran"
}
