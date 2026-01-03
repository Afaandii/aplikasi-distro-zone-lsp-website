package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"context"
)

type CartRepository interface {
	GetActiveCartByUserID(ctx context.Context, userID int) (*entities.Cart, error)
	CreateCart(ctx context.Context, cart *entities.Cart) error
	GetCartItemsByCartID(ctx context.Context, cartID int) ([]entities.CartItem, error)
	GetCartItemByID(ctx context.Context, id int) (*entities.CartItem, error)
	CreateCartItem(ctx context.Context, item *entities.CartItem) error
	UpdateCartItem(ctx context.Context, item *entities.CartItem) error
	DeleteCartItem(ctx context.Context, id int) error
	DeleteAllCartItems(ctx context.Context, cartID int) error
}
