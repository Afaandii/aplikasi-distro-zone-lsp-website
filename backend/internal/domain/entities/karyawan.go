package entities

import "time"

type Karyawan struct {
	IDKaryawan   int       `json:"id" gorm:"primaryKey;column:id_karyawan;autoIncrement"`
	IdRole       int       `json:"id_role" gorm:"column:id_role"`
	Nama         string    `json:"nama" gorm:"type:varchar(255)"`
	Username     string    `json:"username" gorm:"type:varchar(255);unique"`
	Password     string    `json:"password" gorm:"type:varchar(255)"`
	Alamat       string    `json:"alamat" gorm:"type:varchar(255)"`
	NoTelp       string    `json:"no_telp" gorm:"type:varchar(255)"`
	Nik          string    `json:"nik" gorm:"type:varchar(255)"`
	FotoKaryawan string    `json:"foto_karyawan" gorm:"type:text[];nullable"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`

	// buat ambil get data role ditable role
	Role Role `gorm:"foreignKey:IdRole;references:IDRole"`
}

func (Karyawan) TableName() string {
	return "karyawan"
}
