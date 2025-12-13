package entities

import "time"

type Produk struct {
	IDProduk   int       `json:"id_produk" gorm:"primaryKey;column:id_produk;autoIncrement"`
	MerkRef    int       `json:"id_merk" gorm:"column:id_merk;not null"`
	TipeRef    int       `json:"id_tipe" gorm:"column:id_tipe;not null"`
	UkuranRef  int       `json:"id_ukuran" gorm:"column:id_ukuran;not null"`
	WarnaRef   int       `json:"id_warna" gorm:"column:id_warna;not null"`
	NamaKaos   string    `json:"nama_kaos" gorm:"type:varchar(255)"`
	HargaJual  int       `json:"harga_jual" gorm:"type:int"`
	HargaPokok int       `json:"harga_pokok" gorm:"type:int"`
	StokKaos   int       `json:"stok_kaos" gorm:"type:int"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	// relasi
	Merk   Merk   `gorm:"foreignKey:MerkRef;references:IDMerk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Tipe   Tipe   `gorm:"foreignKey:TipeRef;references:IDTipe;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Ukuran Ukuran `gorm:"foreignKey:UkuranRef;references:IDUkuran;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Warna  Warna  `gorm:"foreignKey:WarnaRef;references:IDWarna;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`

	FotoProduk    []FotoProduk    `gorm:"foreignKey:ProdukRef;references:IDProduk"`
	DetailPesanan []DetailPesanan `gorm:"foreignKey:ProdukRef;references:IDProduk"`
}

func (Produk) TableName() string {
	return "produk"
}
