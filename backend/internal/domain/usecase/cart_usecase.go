package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"context"
	"errors"
	"fmt"
)

type CartUsecase interface {
	GetCartProducts(ctx context.Context, userID int) (*entities.Cart, []entities.CartItem, error)
	UpdateQuantity(ctx context.Context, cartItemID int, quantity int) error
	RemoveItem(ctx context.Context, cartItemID int) error
	RemoveAllItems(ctx context.Context, cartID int) error
	AddItem(ctx context.Context, userID int, productID int, quantity int, price int, warnaID int, ukuranID int) error
}

type cartUsecase struct {
	cartRepo repository.CartRepository
}

func NewCartUsecase(cartRepo repository.CartRepository) CartUsecase {
	return &cartUsecase{
		cartRepo: cartRepo,
	}
}

func (uc *cartUsecase) GetCartProducts(ctx context.Context, userID int) (*entities.Cart, []entities.CartItem, error) {
	cart, err := uc.cartRepo.GetActiveCartByUserID(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get cart: %w", err)
	}

	if cart == nil {
		// Buat keranjang baru jika belum ada
		newCart := &entities.Cart{
			UserRef: userID,
			Status:  "active",
		}
		if err := uc.cartRepo.CreateCart(ctx, newCart); err != nil {
			return nil, nil, fmt.Errorf("failed to create cart: %w", err)
		}
		cart = newCart
	}

	items, err := uc.cartRepo.GetCartItemsByCartID(ctx, cart.IDCart)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get cart items: %w", err)
	}

	return cart, items, nil
}

func (uc *cartUsecase) UpdateQuantity(ctx context.Context, cartItemID int, quantity int) error {
	if quantity < 1 {
		return errors.New("quantity must be at least 1")
	}

	item, err := uc.cartRepo.GetCartItemByID(ctx, cartItemID)
	if err != nil {
		return fmt.Errorf("failed to find cart item: %w", err)
	}

	item.Quantity = quantity
	if err := uc.cartRepo.UpdateCartItem(ctx, item); err != nil {
		return fmt.Errorf("failed to update cart item: %w", err)
	}

	return nil
}

func (uc *cartUsecase) RemoveItem(ctx context.Context, cartItemID int) error {
	if err := uc.cartRepo.DeleteCartItem(ctx, cartItemID); err != nil {
		return fmt.Errorf("failed to delete cart item: %w", err)
	}
	return nil
}

func (uc *cartUsecase) RemoveAllItems(ctx context.Context, cartID int) error {
	if err := uc.cartRepo.DeleteAllCartItems(ctx, cartID); err != nil {
		return fmt.Errorf("failed to delete all cart items: %w", err)
	}
	return nil
}

func (uc *cartUsecase) AddItem(ctx context.Context, userID int, productID int, quantity int, price int, warnaID int, ukuranID int) error {
	cart, err := uc.cartRepo.GetActiveCartByUserID(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get cart: %w", err)
	}
	if cart == nil {
		newCart := &entities.Cart{
			UserRef: userID,
			Status:  "active",
		}
		if err := uc.cartRepo.CreateCart(ctx, newCart); err != nil {
			return fmt.Errorf("failed to create cart: %w", err)
		}
		cart = newCart
	}

	newItem := &entities.CartItem{
		CartRef:   cart.IDCart,
		ProdukRef: productID,
		Quantity:  quantity,
		Price:     price,
		WarnaRef:  warnaID,
		UkuranRef: ukuranID,
	}

	if err := uc.cartRepo.CreateCartItem(ctx, newItem); err != nil {
		return fmt.Errorf("failed to add cart item: %w", err)
	}

	return nil
}
