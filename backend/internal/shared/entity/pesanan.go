package entity

import "time"

type Pesanan struct {
	IDPesanan          int       `json:"id_pesanan" gorm:"primaryKey;column:id_pesanan;autoIncrement"`
	PemesanRef         int       `json:"id_pemesan" gorm:"column:id_pemesan"`
	DiverifikasiRef    *int      `json:"diverifikasi_oleh" gorm:"column:diverifikasi_oleh;null"`
	TarifPengirimanRef int       `json:"id_tarif_pengiriman" gorm:"column:id_tarif_pengiriman"`
	KodePesanan        string    `json:"kode_pesanan" gorm:"type:varchar(255)"`
	Subtotal           int       `json:"subtotal" gorm:"type:int"`
	Berat              int       `json:"berat" gorm:"type:int"`
	BiayaOngkir        int       `json:"biaya_ongkir" gorm:"type:int"`
	TotalBayar         int       `json:"total_bayar" gorm:"type:int"`
	AlamatPengiriman   string    `json:"alamat_pengiriman" gorm:"type:varchar(255)"`
	BuktiPembayaran    string    `json:"bukti_pembayaran" gorm:"type:text"`
	StatusPembayaran   string    `json:"status_pembayaran" gorm:"type:varchar(255)"`
	StatusPesanan      string    `json:"status_pesanan" gorm:"type:varchar(255)"`
	MetodePembayaran   string    `json:"metode_pembayaran" gorm:"type:varchar(255)"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`

	Pemesan         User            `gorm:"foreignKey:PemesanRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Diverifikasi    User            `gorm:"foreignKey:DiverifikasiRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	TarifPengiriman TarifPengiriman `gorm:"foreignKey:TarifPengirimanRef;references:IDTarifPengiriman;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`

	Pembayaran    []Pembayaran    `gorm:"foreignKey:PesananRef;references:IDPesanan"`
	DetailPesanan []DetailPesanan `gorm:"foreignKey:PesananRef;references:IDPesanan"`
	Komplain      []Komplain      `gorm:"foreignKey:PesananRef;references:IDPesanan"`
}

func (Pesanan) TableName() string {
	return "pesanan"
}
