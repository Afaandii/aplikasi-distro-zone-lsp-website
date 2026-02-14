package handler

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

func RegisterRoutes(komplainH *KomplainHandler, refundH *RefundHandler) {
	// ==================== Komplain ====================
	// CUSTOMER
	http.HandleFunc("/api/v1/customer/komplain", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			komplainH.BuatKomplain(w, r)
		case http.MethodGet:
			komplainH.GetKomplainSaya(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// ADMIN - detail/update by ID
	http.HandleFunc("/api/v1/admin/komplain/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		idStr := parts[len(parts)-1]
		if r.Method == http.MethodPut {
			if idStr == "" {
				http.Error(w, "Invalid ID", 400)
				return
			}
			id, err := strconv.Atoi(idStr)
			if err != nil {
				http.Error(w, "Invalid ID", 400)
				return
			}
			komplainH.UpdateStatus(w, r, id)
			return
		}
		if r.Method == http.MethodGet {
			id, err := strconv.Atoi(idStr)
			if err != nil {
				http.Error(w, "Invalid ID", 400)
				return
			}
			komplain, err := komplainH.GetKomplainByID(id)
			if err != nil {
				http.Error(w, "Komplain not found", 404)
				return
			}
			json.NewEncoder(w).Encode(komplain)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	// ADMIN - list all
	http.HandleFunc("/api/v1/admin/komplain", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			komplainH.GetAllKomplain(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	// ==================== Refund ====================
	// CUSTOMER
	http.HandleFunc("/api/v1/refunds", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodPost:
			refundH.CreateRefund(w, r)
		case http.MethodGet:
			refundH.GetMyRefunds(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	// ADMIN
	http.HandleFunc("/api/v1/admin/refunds", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			refundH.GetAllRefunds(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	http.HandleFunc("/api/v1/admin/refunds/detail/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		refundH.GetRefundDetail(w, r)
	}))

	http.HandleFunc("/api/v1/admin/refunds/approve/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		refundH.ApproveRefund(w, r)
	}))

	http.HandleFunc("/api/v1/admin/refunds/reject/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		refundH.RejectRefund(w, r)
	}))
}
