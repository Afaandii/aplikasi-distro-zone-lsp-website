package entities

import "time"

type Pembayaran struct {
	IDPembayaran              int       `json:"id_pembayaran" gorm:"primaryKey;column:id_pembayaran;autoIncrement"`
	IDPesanan                 int       `json:"id_pesanan" gorm:"column:id_pesanan;not null"`
	IDUser                    int       `json:"id_user" gorm:"column:id_user;not null"`
	MetodePembayaran          string    `json:"metode_pembayaran" gorm:"type:varchar(255)"`
	MidtransOrderID           string    `json:"midtrans_order_id" gorm:"type:varchar(255);null"`
	MidtransTransactionID     string    `json:"midtrans_transaction_id" gorm:"type:varchar(255);null"`
	MidtransTransactionStatus string    `json:"midtrans_transaction_status" gorm:"type:varchar(100);null"`
	MidtransPaymentType       string    `json:"midtrans_payment_type" gorm:"type:varchar(100);null"`
	MidtransGrossAmount       int       `json:"midtrans_gross_amount" gorm:"type:int;null"`
	MidtransVANumber          string    `json:"midtrans_va_number" gorm:"type:varchar(255);null"`
	MidtransPDFURL            string    `json:"midtrans_pdf_url" gorm:"type:text;null"`
	TotalMasuk                int       `json:"total_masuk" gorm:"type:int"`
	Keuntungan                int       `json:"keuntungan" gorm:"type:int"`
	CreatedAt                 time.Time `json:"created_at"`
	UpdatedAt                 time.Time `json:"updated_at"`

	Pesanan Pesanan `gorm:"foreignKey:IDPesanan;references:IDPesanan;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	User    User    `gorm:"foreignKey:IDUser;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (Pembayaran) TableName() string {
	return "pembayaran"
}
