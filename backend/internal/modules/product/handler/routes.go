package handler

import (
	"net/http"
	"strconv"
	"strings"
)

func RegisterRoutes(produkH *ProdukHandler, varianH *VarianHandler, fotoProdukH *FotoProdukHandler) {

	// ==================== Produk ====================
	http.HandleFunc("/api/v1/produk", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			produkH.GetAll(w, r)
		case http.MethodPost:
			produkH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/produk/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 4 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}
		id, err := strconv.Atoi(parts[len(parts)-1])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			produkH.GetByID(w, r, id)
		case http.MethodPut:
			produkH.Update(w, r, id)
		case http.MethodDelete:
			produkH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/detail-produk/", func(w http.ResponseWriter, r *http.Request) {
		path := strings.TrimPrefix(r.URL.Path, "/api/v1/detail-produk/")
		id, err := strconv.Atoi(path)
		if err != nil || id <= 0 {
			http.Error(w, "Invalid ID", http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			produkH.GetProductDetailByID(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/produk/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		produkH.Search(w, r)
	})

	http.HandleFunc("/api/v1/produk/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		produkH.SearchForAdmin(w, r)
	})

	// ==================== Varian ====================
	http.HandleFunc("/api/v1/varian", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			varianH.GetAll(w, r)
		case http.MethodPost:
			varianH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/varian/", func(w http.ResponseWriter, r *http.Request) {
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
			varianH.GetByID(w, r, id)
		case http.MethodPut:
			varianH.Update(w, r, id)
		case http.MethodDelete:
			varianH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/varian/produk/", func(w http.ResponseWriter, r *http.Request) {
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
		switch r.Method {
		case http.MethodGet:
			varianH.GetAllByProduk(w, r, id)
		case http.MethodDelete:
			varianH.DeleteByProduk(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/varian/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		varianH.Search(w, r)
	})

	// ==================== FotoProduk ====================
	http.HandleFunc("/api/v1/foto-produk", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			fotoProdukH.GetAll(w, r)
		case http.MethodPost:
			fotoProdukH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/foto-produk/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 4 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}
		id, err := strconv.Atoi(parts[len(parts)-1])
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			fotoProdukH.GetByID(w, r, id)
		case http.MethodPut:
			fotoProdukH.Update(w, r, id)
		case http.MethodDelete:
			fotoProdukH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/foto-produk/produk/", func(w http.ResponseWriter, r *http.Request) {
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
		switch r.Method {
		case http.MethodGet:
			fotoProdukH.GetAllByProduk(w, r, id)
		case http.MethodDelete:
			fotoProdukH.DeleteByProduk(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/foto-produk/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		fotoProdukH.Search(w, r)
	})
}
