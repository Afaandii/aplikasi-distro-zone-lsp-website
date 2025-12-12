package entities

import "time"

type FotoProduk struct {
	IDFotoProduk int    `json:"id_foto_produk" gorm:"primaryKey;column:id_foto_produk;autoIncrement"`
	IdProduk     int    `json:"id_produk" gorm:"column:id_produk;not null"`
	UrlFoto      string `json:"url_foto" gorm:"type:text"`
	CreatedAt    time.Time

	Produk Produk `gorm:"foreignKey:IdProduk;references:IDProduk"`
}

func (FotoProduk) TableName() string {
	return `"foto_produk"`
}
