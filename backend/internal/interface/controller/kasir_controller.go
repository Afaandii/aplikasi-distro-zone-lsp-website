package controller

import (
	"encoding/json"
	"net/http"

	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"

	"github.com/go-chi/chi/v5"
)

type KasirController struct {
	UC *usecase.KasirUsecase
}

func NewKasirController(uc *usecase.KasirUsecase) *KasirController {
	return &KasirController{UC: uc}
}

// GET /api/kasir/pesanan/verifikasi
func (c *KasirController) GetPesananMenungguVerifikasi(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananMenungguVerifikasi()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

// PUT /api/kasir/pesanan/{kode}/setujui
func (c *KasirController) SetujuiPesanan(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	// 🔒 Ambil claims dari context (AMAN)
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	if err := c.UC.SetujuiPesanan(kode, kasirID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// PUT /api/kasir/pesanan/{kode}/tolak
func (c *KasirController) TolakPesanan(w http.ResponseWriter, r *http.Request) {
	kode := chi.URLParam(r, "kode")

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	if err := c.UC.TolakPesanan(kode, kasirID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
