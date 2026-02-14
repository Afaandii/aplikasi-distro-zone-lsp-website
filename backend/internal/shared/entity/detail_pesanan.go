package entity

import "time"

type DetailPesanan struct {
	IDDetailPesanan int       `json:"id_detail_pesanan" gorm:"primaryKey;column:id_detail_pesanan;autoIncrement"`
	PesananRef      int       `json:"id_pesanan" gorm:"column:id_pesanan;not null"`
	ProdukRef       int       `json:"id_produk" gorm:"column:id_produk;not null"`
	Jumlah          int       `json:"jumlah" gorm:"type:int"`
	HargaSatuan     int       `json:"harga_satuan" gorm:"type:int"`
	Total           int       `json:"total" gorm:"type:int"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`

	Pesanan Pesanan `gorm:"foreignKey:PesananRef;references:IDPesanan;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Produk  Produk  `gorm:"foreignKey:ProdukRef;references:IDProduk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (DetailPesanan) TableName() string {
	return "detail_pesanan"
}
