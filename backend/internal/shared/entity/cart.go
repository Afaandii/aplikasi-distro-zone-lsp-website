package entity

import "time"

type Cart struct {
	IDCart    int       `json:"id_cart" gorm:"primaryKey;column:id_cart;autoIncrement"`
	UserRef   int       `json:"id_user" gorm:"column:id_user"`
	Status    string    `json:"status" gorm:"type:varchar(100)"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	User User `gorm:"foreignKey:UserRef;references:IDUser;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`

	CartItem []CartItem `gorm:"foreignKey:CartRef;references:IDCart"`
}

func (Cart) TableName() string {
	return "cart"
}
