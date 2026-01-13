package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"encoding/json"
	"fmt"
	"net/http"
)

type CartController struct {
	cartUsecase usecase.CartUsecase
}

func NewCartController(cartUsecase usecase.CartUsecase) *CartController {
	return &CartController{
		cartUsecase: cartUsecase,
	}
}

// GET /api/v1/cart-product -> Ambil semua item cart user yang sedang login
func (c *CartController) GetCartProducts(w http.ResponseWriter, r *http.Request) {
	// Ambil user ID dari JWT Claims yang sudah diset di middleware
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	cart, items, err := c.cartUsecase.GetCartProducts(r.Context(), userID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get cart: %v", err), http.StatusInternalServerError)
		return
	}

	// Mapping response agar sesuai format JSON yang diharapkan Frontend React
	responseItems := make([]map[string]interface{}, len(items))
	for i, item := range items {
		var namaWarna string
		var namaUkuran string

		if item.WarnaRef != 0 && item.Warna.NamaWarna != "" {
			namaWarna = item.Warna.NamaWarna
		}
		if item.UkuranRef != 0 && item.Ukuran.NamaUkuran != "" {
			namaUkuran = item.Ukuran.NamaUkuran
		}
		var imageUrl string
		targetWarnaID := item.WarnaRef
		found := false
		if len(item.Produk.FotoProduk) > 0 {
			for _, foto := range item.Produk.FotoProduk {
				// Jika foto ini punya id_warna yang sama dengan id_warna di keranjang
				if foto.WarnaRef == targetWarnaID {
					imageUrl = foto.UrlFoto
					found = true
					break
				}
			}
		}
		if !found && len(item.Produk.FotoProduk) > 0 {
			imageUrl = item.Produk.FotoProduk[0].UrlFoto
		}
		responseItems[i] = map[string]interface{}{
			"id":         item.IDCartItem,
			"cart_id":    item.CartRef,
			"product_id": item.ProdukRef,
			"quantity":   item.Quantity,
			"price":      item.Price,
			"created_at": item.CreatedAt,
			"updated_at": item.UpdatedAt,
			"id_warna":   item.Warna.IDWarna,
			"id_ukuran":  item.Ukuran.IDUkuran,
			"warna":      namaWarna,
			"ukuran":     namaUkuran,
			"product": map[string]interface{}{
				"id":           item.Produk.IDProduk,
				"product_name": item.Produk.NamaKaos,
				"image_url":    imageUrl,
			},
		}
	}

	response := map[string]interface{}{
		"status": "success",
		"data": map[string]interface{}{
			"cart_id": cart.IDCart,
			"items":   responseItems,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// PUT /api/v1/cart-product-update -> Update quantity (ID dikirim via Body JSON)
func (c *CartController) UpdateQuantity(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	_ = claims // Validasi user sudah dilakukan oleh middleware

	var req struct {
		CartItemID int `json:"cart_item_id"`
		Quantity   int `json:"quantity"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if req.Quantity < 1 {
		http.Error(w, "Quantity must be at least 1", http.StatusBadRequest)
		return
	}

	if err := c.cartUsecase.UpdateQuantity(r.Context(), req.CartItemID, req.Quantity); err != nil {
		http.Error(w, fmt.Sprintf("Failed to update quantity: %v", err), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Quantity updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// DELETE /api/v1/cart-product-delete -> Hapus satu item (ID dikirim via Body JSON)
func (c *CartController) RemoveItem(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	_ = claims

	var req struct {
		CartItemID int `json:"cart_item_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if err := c.cartUsecase.RemoveItem(r.Context(), req.CartItemID); err != nil {
		http.Error(w, fmt.Sprintf("Failed to remove item: %v", err), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Item removed from cart",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

// DELETE /api/v1/cart-product-delete-all -> Hapus semua item milik user login
func (c *CartController) RemoveAllItems(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	// Cari cart active user dulu untuk dapat Cart ID
	cart, _, err := c.cartUsecase.GetCartProducts(r.Context(), userID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get cart: %v", err), http.StatusInternalServerError)
		return
	}

	if err := c.cartUsecase.RemoveAllItems(r.Context(), cart.IDCart); err != nil {
		http.Error(w, fmt.Sprintf("Failed to remove all items: %v", err), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "All items removed from cart",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func (c *CartController) AddItem(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		ProductID int `json:"product_id"`
		Quantity  int `json:"quantity"`
		Price     int `json:"price"`
		WarnaID   int `json:"warna_id"`
		UkuranID  int `json:"ukuran_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", http.StatusBadRequest)
		return
	}

	if req.ProductID <= 0 || req.Quantity <= 0 || req.Price <= 0 {
		http.Error(w, "Invalid input data", http.StatusBadRequest)
		return
	}

	if err := c.cartUsecase.AddItem(r.Context(), claims.UserID, req.ProductID, req.Quantity, req.Price, req.WarnaID, req.UkuranID); err != nil {
		http.Error(w, fmt.Sprintf("Failed to add item: %v", err), http.StatusInternalServerError)
		return
	}

	response := map[string]interface{}{
		"status":  "success",
		"message": "Item added to cart successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}
