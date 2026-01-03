package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"context"
	"errors"
	"fmt"

	"gorm.io/gorm"
)

type cartRepositoryImpl struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) repo.CartRepository {
	return &cartRepositoryImpl{db: db}
}

func (r *cartRepositoryImpl) GetActiveCartByUserID(ctx context.Context, userID int) (*entities.Cart, error) {
	var cart entities.Cart
	err := r.db.WithContext(ctx).Where("id_user = ? AND status = ?", userID, "active").First(&cart).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to get active cart: %w", err)
	}
	return &cart, nil
}

func (r *cartRepositoryImpl) CreateCart(ctx context.Context, cart *entities.Cart) error {
	return r.db.WithContext(ctx).Create(cart).Error
}

func (r *cartRepositoryImpl) GetCartItemsByCartID(ctx context.Context, cartID int) ([]entities.CartItem, error) {
	var items []entities.CartItem
	err := r.db.WithContext(ctx).
		Preload("Produk").Preload("Produk.FotoProduk").Preload("Warna").Preload("Ukuran").
		Where("id_cart = ?", cartID).
		Find(&items).Error
	if err != nil {
		return nil, fmt.Errorf("failed to get cart items: %w", err)
	}
	return items, nil
}

func (r *cartRepositoryImpl) GetCartItemByID(ctx context.Context, id int) (*entities.CartItem, error) {
	var item entities.CartItem
	err := r.db.WithContext(ctx).Preload("Cart").Preload("Produk").Preload("Produk.FotoProduk").Preload("Warna").Preload("Ukuran").Where("id_cart_item = ?", id).First(&item).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("cart item not found")
		}
		return nil, fmt.Errorf("failed to get cart item: %w", err)
	}
	return &item, nil
}

func (r *cartRepositoryImpl) CreateCartItem(ctx context.Context, item *entities.CartItem) error {
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *cartRepositoryImpl) UpdateCartItem(ctx context.Context, item *entities.CartItem) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *cartRepositoryImpl) DeleteCartItem(ctx context.Context, id int) error {
	result := r.db.WithContext(ctx).Delete(&entities.CartItem{}, id)
	if result.Error != nil {
		return fmt.Errorf("failed to delete cart item: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return errors.New("cart item not found")
	}
	return nil
}

func (r *cartRepositoryImpl) DeleteAllCartItems(ctx context.Context, cartID int) error {
	result := r.db.WithContext(ctx).Where("id_cart = ?", cartID).Delete(&entities.CartItem{})
	if result.Error != nil {
		return fmt.Errorf("failed to delete all cart items: %w", result.Error)
	}
	return nil
}
