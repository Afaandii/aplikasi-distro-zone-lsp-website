package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"encoding/json"
	"net/http"
	"strconv"
)

type RefundController struct {
	Usecase *usecase.RefundUsecase
}

func NewRefundController(u *usecase.RefundUsecase) *RefundController {
	return &RefundController{Usecase: u}
}

// CUSTOMER
func (c *RefundController) CreateRefund(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	userID := claims.UserID

	var req struct {
		IDTransaksi uint   `json:"id_transaksi"`
		Reason      string `json:"reason"`
	}

	json.NewDecoder(r.Body).Decode(&req)

	if req.IDTransaksi == 0 {
		http.Error(w, "ID transaksi wajib diisi", http.StatusBadRequest)
		return
	}

	refund := &entities.Refund{
		TransaksiRef: req.IDTransaksi,
		UserRef:      uint(userID),
		Reason:       req.Reason,
	}

	err := c.Usecase.CreateRefund(refund)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(refund)
}

func (c *RefundController) GetMyRefunds(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	userID := claims.UserID
	data, _ := c.Usecase.GetRefundByUser(uint(userID))
	json.NewEncoder(w).Encode(data)
}

// ADMIN
func (c *RefundController) GetAllRefunds(w http.ResponseWriter, r *http.Request) {
	data, _ := c.Usecase.GetAllRefunds()
	json.NewEncoder(w).Encode(data)
}

func (c *RefundController) ProcessRefund(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	id, _ := strconv.Atoi(idStr)

	var req struct {
		Status    string  `json:"status"`
		AdminNote *string `json:"admin_note"`
	}

	json.NewDecoder(r.Body).Decode(&req)

	err := c.Usecase.ProcessRefund(uint(id), req.Status, req.AdminNote)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Write([]byte(`{"message":"refund processed"}`))
}
