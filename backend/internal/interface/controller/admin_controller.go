package controller

import (
	"encoding/json"
	"net/http"

	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

type AdminController struct {
	UC *usecase.AdminUsecase
}

func NewAdminController(uc *usecase.AdminUsecase) *AdminController {
	return &AdminController{UC: uc}
}

func (c *AdminController) GetPesananProses(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananDiproses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *AdminController) GetPesananDikemas(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananDikemas()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *AdminController) GetPesananDikirim(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananDikirim()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *AdminController) SetPesananDikemas(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	adminID := claims.UserID

	if err := c.UC.SetPesananDikemas(kode, adminID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (c *AdminController) SetPesananDikirim(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	adminID := claims.UserID

	if err := c.UC.SetPesananDikirim(kode, adminID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (c *AdminController) SetPesananSelesai(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	adminID := claims.UserID

	if err := c.UC.SetPesananSelesai(kode, adminID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
