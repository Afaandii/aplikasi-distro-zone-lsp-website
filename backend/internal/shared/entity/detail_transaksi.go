package entity

import "time"

type DetailTransaksi struct {
	IDDetailTransaksi int       `json:"id_detail_transaksi" gorm:"primaryKey;column:id_detail_transaksi;autoIncrement"`
	TransaksiRef      int       `json:"id_transaksi" gorm:"column:id_transaksi;not null"`
	PrudukRef         int       `json:"id_produk" gorm:"column:id_produk;not null"`
	Jumlah            int       `json:"jumlah" gorm:"type:int"`
	HargaSatuan       int       `json:"harga_satuan" gorm:"type:int"`
	Subtotal          int       `json:"subtotal" gorm:"type:int"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`

	Transaksi Transaksi `gorm:"foreignKey:TransaksiRef;references:IDTransaksi;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Produk    Produk    `gorm:"foreignKey:PrudukRef;references:IDProduk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (DetailTransaksi) TableName() string {
	return "detail_transaksi"
}
