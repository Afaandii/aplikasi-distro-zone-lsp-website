package handler

import (
	"net/http"
	"strconv"
	"strings"
)

func RegisterRoutes(merkH *MerkHandler, tipeH *TipeHandler, ukuranH *UkuranHandler, warnaH *WarnaHandler, masterH *MasterDataHandler) {

	// ==================== Merk ====================
	http.HandleFunc("/api/v1/merk", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			merkH.GetAll(w, r)
		case http.MethodPost:
			merkH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/merk/", func(w http.ResponseWriter, r *http.Request) {
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
			merkH.GetByID(w, r, id)
		case http.MethodPut:
			merkH.Update(w, r, id)
		case http.MethodDelete:
			merkH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/merk/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		merkH.Search(w, r)
	})

	// ==================== Tipe ====================
	http.HandleFunc("/api/v1/tipe", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			tipeH.GetAll(w, r)
		case http.MethodPost:
			tipeH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/tipe/", func(w http.ResponseWriter, r *http.Request) {
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
			tipeH.GetByID(w, r, id)
		case http.MethodPut:
			tipeH.Update(w, r, id)
		case http.MethodDelete:
			tipeH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/tipe/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		tipeH.Search(w, r)
	})

	// ==================== Ukuran ====================
	http.HandleFunc("/api/v1/ukuran", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			ukuranH.GetAll(w, r)
		case http.MethodPost:
			ukuranH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/ukuran/", func(w http.ResponseWriter, r *http.Request) {
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
			ukuranH.GetByID(w, r, id)
		case http.MethodPut:
			ukuranH.Update(w, r, id)
		case http.MethodDelete:
			ukuranH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/ukuran/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		ukuranH.Search(w, r)
	})

	// ==================== Warna ====================
	http.HandleFunc("/api/v1/warna", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			warnaH.GetAll(w, r)
		case http.MethodPost:
			warnaH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/warna/", func(w http.ResponseWriter, r *http.Request) {
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
			warnaH.GetByID(w, r, id)
		case http.MethodPut:
			warnaH.Update(w, r, id)
		case http.MethodDelete:
			warnaH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
	http.HandleFunc("/api/v1/warna/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		warnaH.Search(w, r)
	})

	// ==================== Master Data ====================
	http.HandleFunc("/api/v1/master-data/produk", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		masterH.GetProdukMasterData(w, r)
	})
}
