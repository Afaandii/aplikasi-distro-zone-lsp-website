package server

import (
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"net/http"
	"strconv"
	"strings"
)

func RegisterMerkRoutes(c *controller.MerkController) {
	http.HandleFunc("/merk", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			c.GetAll(w, r)
		case http.MethodPost:
			c.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/merk/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) != 2 {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		id, err := strconv.Atoi(parts[1])
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
