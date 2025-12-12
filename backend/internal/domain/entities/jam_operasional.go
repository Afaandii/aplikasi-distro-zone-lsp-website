package entities

import "time"

type JamOperasional struct {
	IDJamOperasional int       `json:"id_jam_operasional" gorm:"primaryKey;column:id_jam_operasional;autoIncrement"`
	TipeLayanan      string    `json:"tipe_layanan" gorm:"type:varchar(255)"`
	Hari             string    `json:"hari" gorm:"type:varchar(255)"`
	JamBuka          time.Time `json:"jam_buka" gorm:"type:time"`
	JamTutup         time.Time `json:"jam_tutup" gorm:"type:time"`
	Status           string    `json:"status" gorm:"type:varchar(255)"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

func (JamOperasional) TableName() string {
	return "jam_operasional"
}
