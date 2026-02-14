package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/complaint/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
)

// ==================== Komplain Handler ====================

type KomplainHandler struct{ svc *service.KomplainService }

func NewKomplainHandler(svc *service.KomplainService) *KomplainHandler {
	return &KomplainHandler{svc: svc}
}

func (h *KomplainHandler) BuatKomplain(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	var req struct {
		IDPesanan     int    `json:"id_pesanan"`
		JenisKomplain string `json:"jenis_komplain"`
		Deskripsi     string `json:"deskripsi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	if err := h.svc.BuatKomplain(claims.UserID, req.IDPesanan, req.JenisKomplain, req.Deskripsi); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(201)
}

func (h *KomplainHandler) GetKomplainSaya(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	data, err := h.svc.GetKomplainByUser(claims.UserID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(data)
}

func (h *KomplainHandler) GetAllKomplain(w http.ResponseWriter, r *http.Request) {
	data, err := h.svc.GetAllKomplain()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(data)
}

func (h *KomplainHandler) UpdateStatus(w http.ResponseWriter, r *http.Request, id int) {
	var req struct {
		Status string `json:"status"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if err := h.svc.UpdateStatus(id, req.Status); err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	w.WriteHeader(200)
}

func (h *KomplainHandler) GetKomplainByID(id int) (*entity.Komplain, error) {
	return h.svc.GetKomplainByID(id)
}

// ==================== Refund Handler ====================

type RefundHandler struct{ svc *service.RefundService }

func NewRefundHandler(svc *service.RefundService) *RefundHandler { return &RefundHandler{svc: svc} }

func getIDFromPath(r *http.Request) (uint, error) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) == 0 {
		return 0, fmt.Errorf("invalid path")
	}
	id, err := strconv.Atoi(parts[len(parts)-1])
	return uint(id), err
}

func (h *RefundHandler) CreateRefund(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	var req struct {
		IDTransaksi uint   `json:"id_transaksi"`
		Reason      string `json:"reason"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	refund := &entity.Refund{UserRef: uint(claims.UserID), TransaksiRef: req.IDTransaksi, Reason: req.Reason}
	if err := h.svc.CreateRefund(refund); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, refund)
}

func (h *RefundHandler) GetMyRefunds(w http.ResponseWriter, r *http.Request) {
	claims := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	data, _ := h.svc.GetRefundByUser(uint(claims.UserID))
	response.WriteJSON(w, 200, data)
}

func (h *RefundHandler) GetAllRefunds(w http.ResponseWriter, r *http.Request) {
	data, _ := h.svc.GetAllRefunds()
	response.WriteJSON(w, 200, data)
}

func (h *RefundHandler) GetRefundDetail(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	refundID, err := getIDFromPath(r)
	if err != nil {
		http.Error(w, "invalid refund id", 400)
		return
	}
	data, err := h.svc.GetRefundDetail(refundID)
	if err != nil {
		http.Error(w, err.Error(), 404)
		return
	}
	json.NewEncoder(w).Encode(data)
}

func (h *RefundHandler) ApproveRefund(w http.ResponseWriter, r *http.Request) {
	_, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	refundID, err := getIDFromPath(r)
	if err != nil {
		http.Error(w, "invalid refund id", 400)
		return
	}
	var req struct {
		AdminNote string `json:"admin_note"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if err := h.svc.ApproveRefund(refundID, req.AdminNote); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "refund approved"})
}

func (h *RefundHandler) RejectRefund(w http.ResponseWriter, r *http.Request) {
	id, _ := strconv.Atoi(r.URL.Query().Get("id"))
	var req struct {
		AdminNote string `json:"admin_note"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	if err := h.svc.RejectRefund(uint(id), req.AdminNote); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "refund rejected"})
}
