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

	http.HandleFunc("/api/v1/admin/refunds/detail/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		c.GetRefundDetail(w, r)
	}))

	http.HandleFunc("/api/v1/admin/refunds/approve/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		c.ApproveRefund(w, r)
	}))

	http.HandleFunc("/api/v1/admin/refunds/reject/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		c.RejectRefund(w, r)
	}))
}
