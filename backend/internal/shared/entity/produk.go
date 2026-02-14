package entity

import "time"

type Produk struct {
	IDProduk    int       `json:"id_produk" gorm:"primaryKey;column:id_produk;autoIncrement"`
	MerkRef     int       `json:"id_merk" gorm:"column:id_merk;not null"`
	TipeRef     int       `json:"id_tipe" gorm:"column:id_tipe;not null"`
	NamaKaos    string    `json:"nama_kaos" gorm:"type:varchar(255)"`
	HargaJual   int       `json:"harga_jual" gorm:"type:int"`
	HargaPokok  int       `json:"harga_pokok" gorm:"type:int"`
	Berat       float64   `json:"berat" gorm:"type:numeric(5,2);not null;default:0"`
	Deskripsi   string    `json:"deskripsi" gorm:"type:text"`
	Spesifikasi string    `json:"spesifikasi" gorm:"type:text"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// relasi
	Merk Merk `gorm:"foreignKey:MerkRef;references:IDMerk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Tipe Tipe `gorm:"foreignKey:TipeRef;references:IDTipe;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`

	FotoProduk      []FotoProduk      `gorm:"foreignKey:ProdukRef;references:IDProduk"`
	DetailPesanan   []DetailPesanan   `gorm:"foreignKey:ProdukRef;references:IDProduk"`
	DetailTransaksi []DetailTransaksi `gorm:"foreignKey:PrudukRef;references:IDProduk"`
	Varian          []Varian          `gorm:"foreignKey:ProdukRef;references:IDProduk"`
	CartItem        []CartItem        `gorm:"foreignKey:ProdukRef;references:IDProduk"`
}

func (Produk) TableName() string {
	return "produk"
}
