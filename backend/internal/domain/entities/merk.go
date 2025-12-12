package entities

import "time"

type Merk struct {
	IDMerk     int       `json:"id_merk" gorm:"primaryKey;column:id_merk;autoIncrement"`
	NamaMerk   string    `json:"nama_merk" gorm:"type:varchar(255)"`
	Keterangan string    `json:"keterangan" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	//has many produk
	Produk []Produk `gorm:"foreignKey:IdMerk;references:IDMerk"`
}

func (Merk) TableName() string {
	return "merk"
}
