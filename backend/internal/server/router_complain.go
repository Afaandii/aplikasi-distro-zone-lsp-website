package server

import (
	"encoding/json"
	"net/http"
	"strconv"
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
		idStr := parts[len(parts)-1]

		// Jika method PUT → update status
		if r.Method == http.MethodPut {
			if idStr == "" {
				http.Error(w, "Invalid ID", http.StatusBadRequest)
				return
			}
			if _, err := strconv.Atoi(idStr); err != nil {
				http.Error(w, "Invalid ID", http.StatusBadRequest)
				return
			}
			r = r.WithContext(httpctx.ContextWithParam(r, "id", idStr))
			c.UpdateStatus(w, r)
			return
		}

		// Jika method GET → ambil detail komplain
		if r.Method == http.MethodGet {
			id, err := strconv.Atoi(idStr)
			if err != nil {
				http.Error(w, "Invalid ID", http.StatusBadRequest)
				return
			}

			// Ambil data komplain berdasarkan ID
			komplain, err := c.Usecase.GetKomplainByID(id)
			if err != nil {
				http.Error(w, "Komplain not found", http.StatusNotFound)
				return
			}

			json.NewEncoder(w).Encode(komplain)
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
