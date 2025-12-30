package server

import (
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
)

func RegisterRefundRoutes(c *controller.RefundController) {
	// CUSTOMER
	http.HandleFunc("/api/v1/refunds", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			c.CreateRefund(w, r)
		case http.MethodGet:
			c.GetMyRefunds(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// ADMIN
	http.HandleFunc("/api/v1/admin/refunds", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			c.GetAllRefunds(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	http.HandleFunc("/api/v1/admin/refunds/process", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPut {
			c.ProcessRefund(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))
}
