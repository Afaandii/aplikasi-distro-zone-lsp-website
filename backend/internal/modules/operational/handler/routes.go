package handler

import (
	"net/http"
	"strconv"
	"strings"
)

func RegisterRoutes(jamH *JamOperasionalHandler, tarifH *TarifPengirimanHandler) {

	// ==================== JamOperasional ====================
	http.HandleFunc("/api/v1/jam-operasional", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			jamH.GetAll(w, r)
		case http.MethodPost:
			jamH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/jam-operasional/", func(w http.ResponseWriter, r *http.Request) {
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
			jamH.GetByID(w, r, id)
		case http.MethodPut:
			jamH.Update(w, r, id)
		case http.MethodDelete:
			jamH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/jam-operasional/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		jamH.Search(w, r)
	})

	// ==================== TarifPengiriman ====================
	http.HandleFunc("/api/v1/tarif-pengiriman", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			tarifH.GetAll(w, r)
		case http.MethodPost:
			tarifH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/tarif-pengiriman/", func(w http.ResponseWriter, r *http.Request) {
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
			tarifH.GetByID(w, r, id)
		case http.MethodPut:
			tarifH.Update(w, r, id)
		case http.MethodDelete:
			tarifH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/tarif-pengiriman/live/search", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		tarifH.Search(w, r)
	})
}
