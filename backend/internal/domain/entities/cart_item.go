package entities

import "time"

type CartItem struct {
	IDCartItem int       `json:"id_cart_item" gorm:"primaryKey;column:id_cart_item;autoIncrement"`
	CartRef    int       `json:"id_cart" gorm:"column:id_cart"`
	ProdukRef  int       `json:"id_produk" gorm:"column:id_produk"`
	WarnaRef   int       `json:"id_warna" gorm:"column:id_warna"`
	UkuranRef  int       `json:"id_ukuran" gorm:"column:id_ukuran"`
	Quantity   int       `json:"quantity" gorm:"type:int"`
	Price      int       `json:"price" gorm:"type:int"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	Cart   Cart   `gorm:"foreignKey:CartRef;references:IDCart;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Produk Produk `gorm:"foreignKey:ProdukRef;references:IDProduk;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Warna  Warna  `gorm:"foreignKey:WarnaRef;references:IDWarna;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
	Ukuran Ukuran `gorm:"foreignKey:UkuranRef;references:IDUkuran;constraint:OnUpdate:RESTRICT,OnDelete:CASCADE"`
}

func (CartItem) TableName() string {
	return "cart_item"
}
