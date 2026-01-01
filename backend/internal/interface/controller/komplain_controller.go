package controller

import (
	"encoding/json"
	"net/http"
	"strconv"

	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

type KomplainController struct {
	Usecase *usecase.KomplainUsecase
}

func NewKomplainController(u *usecase.KomplainUsecase) *KomplainController {
	return &KomplainController{Usecase: u}
}

// POST /customer
func (c *KomplainController) BuatKomplain(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	var req struct {
		IDPesanan     int    `json:"id_pesanan"`
		JenisKomplain string `json:"jenis_komplain"`
		Deskripsi     string `json:"deskripsi"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := c.Usecase.BuatKomplain(
		userID,
		req.IDPesanan,
		req.JenisKomplain,
		req.Deskripsi,
	)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// GET /customer
func (c *KomplainController) GetKomplainSaya(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	data, err := c.Usecase.GetKomplainByUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}

// ADMIN
func (c *KomplainController) GetAllKomplain(w http.ResponseWriter, r *http.Request) {
	data, err := c.Usecase.GetAllKomplain()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}

func (c *KomplainController) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := httpctx.GetParam(r, "id")
	if idStr == "" {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}
	id, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid ID", http.StatusBadRequest)
		return
	}

	var req struct {
		Status string `json:"status"`
	}

	json.NewDecoder(r.Body).Decode(&req)

	err = c.Usecase.UpdateStatus(id, req.Status)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
