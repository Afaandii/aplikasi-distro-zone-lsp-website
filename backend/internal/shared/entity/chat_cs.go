package entity

import "time"

type ChatCS struct {
	IDPesan    int       `json:"id_pesan" gorm:"primaryKey;column:id_pesan;autoIncrement"`
	IDPengirim int       `json:"id_pengirim" gorm:"column:id_pengirim;index"`
	IDPenerima int       `json:"id_penerima" gorm:"column:id_penerima;index"`
	IsiPesan   string    `json:"isi_pesan" gorm:"type:text"`
	TipePesan  string    `json:"tipe_pesan" gorm:"type:varchar(50)"`
	WaktuKirim time.Time `json:"waktu_kirim"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	Pengirim User `gorm:"foreignKey:IDPengirim;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Penerima User `gorm:"foreignKey:IDPenerima;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (ChatCS) TableName() string {
	return "chat_cs"
}
