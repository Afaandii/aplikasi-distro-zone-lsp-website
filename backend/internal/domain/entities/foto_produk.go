package entities

import "time"

type FotoProduk struct {
	IDFotoProduk int       `json:"id_foto_produk" gorm:"primaryKey;column:id_foto_produk;autoIncrement"`
	ProdukRef    int       `json:"id_produk" gorm:"column:id_produk;not null"`
	UrlFoto      string    `json:"url_foto" gorm:"type:text"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	Produk Produk `gorm:"foreignKey:ProdukRef;references:IDProduk;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

func (FotoProduk) TableName() string {
	return "foto_produk"
}
