package entities

import "time"

type User struct {
	IDUser      int       `json:"id_user" gorm:"primaryKey;column:id_user;autoIncrement"`
	IdRole      int       `json:"id_role" gorm:"column:id_role;not null"`
	Nama        string    `json:"nama" gorm:"type:varchar(255)"`
	Username    string    `json:"username" gorm:"type:varchar(255);unique"`
	Password    string    `json:"password" gorm:"type:varchar(255)"`
	Nik         string    `json:"nik" gorm:"type:varchar(100);null"`
	Alamat      string    `json:"alamat" gorm:"type:text;null"`
	Kota        string    `json:"kota" gorm:"type:varchar(100);null"`
	NoTelp      string    `json:"no_telp" gorm:"type:varchar(50);null"`
	FotoProfile string    `json:"foto_profile" gorm:"type:text;null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Relasi
	Role Role `gorm:"foreignKey:IdRole;references:IDRole;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (User) TableName() string {
	return "user"
}
