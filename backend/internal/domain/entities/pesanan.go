package entities

import "time"

type Pesanan struct {
	IDPesanan         int       `json:"id_pesanan" gorm:"primaryKey;column:id_pesanan;autoIncrement"`
	IDPemesan         int       `json:"id_pemesan" gorm:"column:id_pemesan;not null"`
	DiverifikasiOleh  int       `json:"diverifikasi_oleh" gorm:"column:diverifikasi_oleh;not null"`
	IDTarifPengiriman int       `json:"id_tarif_pengiriman" gorm:"column:id_tarif_pengiriman;not null"`
	KodePesanan       string    `json:"kode_pesanan" gorm:"type:varchar(255)"`
	Subtotal          int       `json:"subtotal" gorm:"type:int"`
	Berat             int       `json:"berat" gorm:"type:int"`
	BiayaOngkir       int       `json:"biaya_ongkir" gorm:"type:int"`
	TotalBayar        int       `json:"total_bayar" gorm:"type:int"`
	KotaTujuan        string    `json:"kota_tujuan" gorm:"type:varchar(255)"`
	BuktiPembayaran   string    `json:"bukti_pembayaran" gorm:"type:text"`
	StatusPembayaran  string    `json:"status_pembayaran" gorm:"type:varchar(255)"`
	StatusPesanan     string    `json:"status_pesanan" gorm:"type:varchar(255)"`
	MetodePembayaran  string    `json:"metode_pembayaran" gorm:"type:varchar(255)"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`

	Pemesan         User            `gorm:"foreignKey:IDPemesan;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Diverifikasi    User            `gorm:"foreignKey:DiverifikasiOleh;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	TarifPengiriman TarifPengiriman `gorm:"foreignKey:IDTarifPengiriman;references:IDTarifPengiriman;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Pesanan) TableName() string {
	return "pesanan"
}
