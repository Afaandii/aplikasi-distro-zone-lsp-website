package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

type RefundController struct {
	Usecase *usecase.RefundUsecase
}

func NewRefundController(u *usecase.RefundUsecase) *RefundController {
	return &RefundController{Usecase: u}
}

// helper
func getIDFromPath(r *http.Request) (uint, error) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) == 0 {
		return 0, fmt.Errorf("invalid path")
	}
	idStr := parts[len(parts)-1]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return 0, err
	}
	return uint(id), nil
}

//
// =============== CUSTOMER =================
//

func (c *RefundController) CreateRefund(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.Claims)

	var req struct {
		IDTransaksi uint   `json:"id_transaksi"`
		Reason      string `json:"reason"`
	}

	json.NewDecoder(r.Body).Decode(&req)

	refund := &entities.Refund{
		UserRef:      uint(claims.UserID),
		TransaksiRef: req.IDTransaksi,
		Reason:       req.Reason,
	}

	err := c.Usecase.CreateRefund(refund)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusCreated, refund)
}

func (c *RefundController) GetMyRefunds(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	data, _ := c.Usecase.GetRefundByUser(uint(claims.UserID))
	helper.WriteJSON(w, http.StatusOK, data)
}

//
// ================= ADMIN =================
//

func (c *RefundController) GetAllRefunds(w http.ResponseWriter, r *http.Request) {
	data, _ := c.Usecase.GetAllRefunds()
	helper.WriteJSON(w, http.StatusOK, data)
}

func (c *RefundController) GetRefundDetail(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	refundID, err := getIDFromPath(r)
	if err != nil {
		http.Error(w, "invalid refund id", http.StatusBadRequest)
		return
	}

	data, err := c.Usecase.GetRefundDetail(refundID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(data)
}

func (c *RefundController) ApproveRefund(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	refundID, err := getIDFromPath(r)
	if err != nil {
		http.Error(w, "invalid refund id", http.StatusBadRequest)
		return
	}

	var req struct {
		AdminNote string `json:"admin_note"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	err = c.Usecase.ApproveRefund(refundID, req.AdminNote)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "refund approved"})
}

func (c *RefundController) RejectRefund(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))

	var req struct {
		AdminNote string `json:"admin_note"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	err := c.Usecase.RejectRefund(uint(id), req.AdminNote)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "refund rejected"})
}
