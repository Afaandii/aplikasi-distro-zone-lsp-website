package entity

import "time"

type Varian struct {
	IDVarian  int       `json:"id_varian" gorm:"primaryKey;column:id_varian;autoIncrement"`
	ProdukRef int       `json:"id_produk" gorm:"column:id_produk;not null"`
	UkuranRef int       `json:"id_ukuran" gorm:"column:id_ukuran;not null"`
	WarnaRef  int       `json:"id_warna" gorm:"column:id_warna;not null"`
	StokKaos  int       `json:"stok_kaos" gorm:"type:int"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// relasi
	Ukuran Ukuran `gorm:"foreignKey:UkuranRef;references:IDUkuran;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Warna  Warna  `gorm:"foreignKey:WarnaRef;references:IDWarna;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Produk Produk `gorm:"foreignKey:ProdukRef;references:IDProduk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Varian) TableName() string {
	return "varian"
}
