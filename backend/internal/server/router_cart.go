package server

import (
	"net/http"

	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

func RegisterCartRoutes(c *controller.CartController) {
	// 1. GET /api/v1/cart-product
	http.HandleFunc("/api/v1/cart-product", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			c.GetCartProducts(w, r)
		case http.MethodPost:
			c.AddItem(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// 2. PUT /api/v1/cart-product-update
	// Digunakan saat user menekan tombol tambah/kurang quantity
	http.HandleFunc("/api/v1/cart-product-update", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			c.UpdateQuantity(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// 3. DELETE /api/v1/cart-product-delete
	// Digunakan saat user menghapus satu produk tertentu
	http.HandleFunc("/api/v1/cart-product-delete", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			c.RemoveItem(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// 4. DELETE /api/v1/cart-product-delete-all
	// Digunakan saat user ingin menghapus semua isi keranjang
	http.HandleFunc("/api/v1/cart-product-delete-all", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			c.RemoveAllItems(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))
}
