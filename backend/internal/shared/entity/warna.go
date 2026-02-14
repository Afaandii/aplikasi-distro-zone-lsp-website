package entity

import "time"

type Warna struct {
	IDWarna    int       `json:"id_warna" gorm:"primaryKey;column:id_warna;autoIncrement"`
	NamaWarna  string    `json:"nama_warna" gorm:"type:varchar(255)"`
	Keterangan string    `json:"keterangan" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// hasmany ke produk
	Varian     []Varian     `gorm:"foreignKey:WarnaRef;references:IDWarna"`
	FotoProduk []FotoProduk `gorm:"foreignKey:WarnaRef;references:IDWarna"`
	CartItem   []CartItem   `gorm:"foreignKey:WarnaRef;references:IDWarna"`
}

func (Warna) TableName() string {
	return "warna"
}
