package handler

import (
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strconv"
	"strings"
)

func RegisterRoutes(cartH *CartHandler, pesananH *PesananHandler, checkoutH *CheckoutHandler, callbackH *MidtransCallbackHandler) {

	// ==================== Cart ====================
	http.HandleFunc("/api/v1/cart-product", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			cartH.GetCartProducts(w, r)
		case http.MethodPost:
			cartH.AddItem(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))
	http.HandleFunc("/api/v1/cart-product-update", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			cartH.UpdateQuantity(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))
	http.HandleFunc("/api/v1/cart-product-delete", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			cartH.RemoveItem(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))
	http.HandleFunc("/api/v1/cart-product-delete-all", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodDelete {
			cartH.RemoveAllItems(w, r)
		} else {
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// ==================== Pesanan ====================
	http.HandleFunc("/api/v1/pesanan", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			pesananH.GetAll(w, r)
		case http.MethodPost:
			pesananH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/pesanan/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 4 {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		id, err := strconv.Atoi(parts[len(parts)-1])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			pesananH.GetByID(w, r, id)
		case http.MethodPut:
			pesananH.Update(w, r, id)
		case http.MethodDelete:
			pesananH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/pesanan/my", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			pesananH.GetMyPesanan(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))
	http.HandleFunc("/api/v1/pesanan/my/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 5 {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		id, err := strconv.Atoi(parts[len(parts)-1])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		if r.Method == http.MethodGet {
			pesananH.GetMyPesananDetail(w, r, id)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	// ==================== Checkout / Pembayaran ====================
	http.HandleFunc("/api/checkout", middleware.AuthMiddleware(checkoutH.Checkout))
	http.HandleFunc("/api/checkout/preview", middleware.AuthMiddleware(checkoutH.Preview))
	http.HandleFunc("/api/v1/payment-notification", callbackH.Handle)
}
