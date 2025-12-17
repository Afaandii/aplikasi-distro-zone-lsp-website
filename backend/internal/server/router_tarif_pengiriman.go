package server

import (
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"net/http"
	"strconv"
	"strings"
)

func RegisterTarifPengirimanRoutes(c *controller.TarifPengirimanController) {
	http.HandleFunc("/api/v1/tarif-pengiriman", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			c.GetAll(w, r)
		case http.MethodPost:
			c.Create(w, r)
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
		idStr := parts[len(parts)-1]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			c.GetByID(w, r, id)
		case http.MethodPut:
			c.Update(w, r, id)
		case http.MethodDelete:
			c.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})
}
