package entities

import "time"

type Role struct {
	IDRole     int       `json:"id_role" gorm:"primaryKey;column:id_role;autoIncrement"`
	NamaRole   string    `json:"nama_role" gorm:"type:varchar(255)"`
	Keterangan string    `json:"keterangan" gorm:"type:varchar(255)"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

func (Role) TableName() string {
	return `"role"`
}
