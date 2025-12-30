package server

import (
	"net/http"
	"strings"

	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

func RegisterKomplainRoutes(c *controller.KomplainController) {

	// CUSTOMER
	http.HandleFunc("/api/v1/customer/komplain", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			c.BuatKomplain(w, r)
		case http.MethodGet:
			c.GetKomplainSaya(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// ADMIN
	http.HandleFunc("/api/v1/admin/komplain/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		id := parts[len(parts)-1]

		r = r.WithContext(
			httpctx.ContextWithParam(r, "id", id),
		)

		if r.Method == http.MethodPut {
			c.UpdateStatus(w, r)
			return
		}

		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	http.HandleFunc("/api/v1/admin/komplain", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			c.GetAllKomplain(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))
}
