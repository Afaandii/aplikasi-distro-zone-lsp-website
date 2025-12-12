package entities

import "time"

type TarifPengiriman struct {
	IDTarifPengiriman int       `json:"id_tarif_pengiriman" gorm:"primaryKey;column:id_tarif_pengiriman;autoIncrement"`
	Wilayah           string    `json:"wilayah" gorm:"type:varchar(255)"`
	HargaPerKg        int       `json:"harga_per_kg" gorm:"type:int"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}

func (TarifPengiriman) TableName() string {
	return "tarif_pengiriman"
}
