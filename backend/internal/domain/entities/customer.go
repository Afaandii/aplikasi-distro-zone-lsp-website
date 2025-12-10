package entities

import "time"

type Customer struct {
	IDCustomer int       `json:"id" gorm:"primaryKey;column:id_customer;autoIncrement"`
	IdRole     int       `json:"id_role" gorm:"column:id_role"`
	Username   string    `json:"username" gorm:"type:varchar(255)"`
	Email      string    `json:"email" gorm:"type:varchar(255);unique"`
	Password   string    `json:"password" gorm:"type:varchar(255)"`
	Alamat     string    `json:"alamat" gorm:"type:varchar(255)"`
	Kota       string    `json:"kota" gorm:"type:varchar(255)"`
	NoTelp     string    `json:"no_telp" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	Role Role `gorm:"foreignKey:IdRole;references:ID"`
}

// penamaan database disesuaikan sendiri ga dibuatin gorm
func (Customer) TableName() string {
	return "customer"
}
