package server

import (
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strconv"
	"strings"
)

func RegisterPesananRoutes(c *controller.PesananController) {
	http.HandleFunc("/api/v1/pesanan", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			c.GetAll(w, r)
		case http.MethodPost:
			c.Create(w, r)
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

	http.HandleFunc("/api/v1/pesanan/my", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			c.GetMyPesanan(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	// ✅ CUSTOMER - DETAIL PESANAN
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
			c.GetMyPesananDetail(w, r, id)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))
}
