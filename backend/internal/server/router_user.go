package server

import (
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strconv"
	"strings"
)

func RegisterUserRoutes(c *controller.UserController) {

	http.HandleFunc("/api/v1/auth/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		c.Login(w, r)
	})

	http.HandleFunc("/api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		c.Register(w, r)
	})

	http.HandleFunc("/api/v1/user", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			c.GetAll(w, r)
		case http.MethodPost:
			c.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/v1/user/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		// Untuk request "/api/v1/user/1", parts akan menjadi ["api", "v1", "user", "1"]
		// Kita butuh setidaknya 4 bagian untuk mendapatkan ID
		if len(parts) < 4 {
			http.Error(w, "Not Found", http.StatusNotFound)
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
	}))

	http.HandleFunc("/api/v1/user/kasir", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		c.GetCashiers(w, r)
	}))
}
