package entities

import "time"

type Produk struct {
	IDProduk   int       `json:"id_produk" gorm:"primaryKey;column:id_produk;autoIncrement"`
	IdMerk     int       `json:"id_merk" gorm:"column:id_merk;not null"`
	IdTipe     int       `json:"id_tipe" gorm:"column:id_tipe;not null"`
	IdUkuran   int       `json:"id_ukuran" gorm:"column:id_ukuran;not null"`
	IdWarna    int       `json:"id_warna" gorm:"id_warna;not null"`
	NamaKaos   string    `json:"nama_kaos" gorm:"type:varchar(255)"`
	HargaJual  int       `json:"harga_jual" gorm:"type:int"`
	HargaPokok int       `json:"harga_pokok" gorm:"type:int"`
	StokKaos   int       `json:"stok_kaos" gorm:"type:int"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// relasi
	Merk   Merk   `gorm:"foreignKey:IdMerk;references:IDMerk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Tipe   Tipe   `gorm:"foreignKey:IdTipe;references:IDTipe;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Ukuran Ukuran `gorm:"foreignKey:IdUkuran;references:IDUkuran;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Warna  Warna  `gorm:"foreignKey:IdWarna;references:IDWarna;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Produk) TableName() string {
	return `"produk"`
}
