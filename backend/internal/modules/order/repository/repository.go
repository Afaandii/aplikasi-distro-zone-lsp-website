package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"context"
)

type CartRepository interface {
	GetActiveCartByUserID(ctx context.Context, userID int) (*entity.Cart, error)
	CreateCart(ctx context.Context, cart *entity.Cart) error
	GetCartItemsByCartID(ctx context.Context, cartID int) ([]entity.CartItem, error)
	GetCartItemByID(ctx context.Context, id int) (*entity.CartItem, error)
	CreateCartItem(ctx context.Context, item *entity.CartItem) error
	UpdateCartItem(ctx context.Context, item *entity.CartItem) error
	DeleteCartItem(ctx context.Context, id int) error
	DeleteAllCartItems(ctx context.Context, cartID int) error
}

type PesananRepository interface {
	FindAll() ([]entity.Pesanan, error)
	FindByID(idPesanan int) (*entity.Pesanan, error)
	Create(p *entity.Pesanan) error
	Update(p *entity.Pesanan) error
	Delete(idPesanan int) error
	FindByKode(kodePesanan string) (*entity.Pesanan, error)
	UpdateStatusByKode(kodePesanan, statusPembayaran, statusPesanan, metodePembayaran string) error
	FindByUserID(userID int) ([]entity.Pesanan, error)
	FindDetailByUserAndPesananID(userID, pesananID int) (*entity.Pesanan, error)
	AutoCancelExpiredOrders() (int64, error)
}

type DetailPesananRepository interface {
	Create(detail *entity.DetailPesanan) error
}

type PembayaranRepository interface {
	Create(p *entity.Pembayaran) error
	FindByMidtransOrderID(orderID string) (*entity.Pembayaran, error)
	UpdateCallbackMidtrans(orderID, status, transactionID, paymentType, va, pdf string) error
}
