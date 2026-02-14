package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/report/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

// ==================== Report Admin Handler ====================

type ReportAdminHandler struct{ svc *service.ReportAdminService }

func NewReportAdminHandler(svc *service.ReportAdminService) *ReportAdminHandler {
	return &ReportAdminHandler{svc: svc}
}

func (h *ReportAdminHandler) GetAllTransaksi(w http.ResponseWriter, r *http.Request) {
	data, err := h.svc.GetAllTransaksi()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(data)
}

func (h *ReportAdminHandler) GetDetailTransaksiByIDTransaksi(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 5 || parts[len(parts)-1] == "" {
		response.WriteJSON(w, 400, "ID transaksi diperlukan")
		return
	}
	transaksiID, err := strconv.Atoi(parts[len(parts)-1])
	if err != nil {
		response.WriteJSON(w, 400, "ID transaksi tidak valid")
		return
	}
	items, err := h.svc.GetDetailTransaksiByTransaksiID(transaksiID)
	if err != nil {
		response.WriteJSON(w, 404, err.Error())
		return
	}
	response.WriteJSON(w, 200, map[string]interface{}{"items": items})
}

func (h *ReportAdminHandler) GetTransaksiByPeriode(w http.ResponseWriter, r *http.Request) {
	path := strings.Split(r.URL.Path, "/")
	startDate := path[len(path)-2]
	endDate := path[len(path)-1]
	data, err := h.svc.GetAllTransaksiByPeriode(startDate, endDate)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(data)
}

func (h *ReportAdminHandler) GetLaporanRugiLaba(w http.ResponseWriter, r *http.Request) {
	path := strings.Split(r.URL.Path, "/")
	startDate := path[len(path)-2]
	endDate := path[len(path)-1]
	data, err := h.svc.GetLaporanRugiLaba(startDate, endDate)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	json.NewEncoder(w).Encode(data)
}

// ==================== Report Kasir Handler ====================

type ReportKasirHandler struct{ svc *service.ReportKasirService }

func NewReportKasirHandler(svc *service.ReportKasirService) *ReportKasirHandler {
	return &ReportKasirHandler{svc: svc}
}

func (h *ReportKasirHandler) FindLaporanByKasir(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	data, err := h.svc.FindTransaksiByKasir(claims.UserID)
	if err != nil {
		response.WriteJSON(w, 500, err.Error())
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ReportKasirHandler) FindLaporanByKasirAndPeriode(w http.ResponseWriter, r *http.Request, startDate, endDate string) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", 401)
		return
	}
	if startDate == "" || endDate == "" {
		response.WriteJSON(w, 400, "Periode tanggal wajib diisi")
		return
	}
	metode := r.URL.Query().Get("metode")
	data, err := h.svc.FindTransaksiByKasirAndPeriode(claims.UserID, startDate, endDate, metode)
	if err != nil {
		response.WriteJSON(w, 500, err.Error())
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ReportKasirHandler) FindDetailLaporanByID(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 5 || parts[len(parts)-1] == "" {
		response.WriteJSON(w, 400, "ID transaksi diperlukan")
		return
	}
	transaksiID, err := strconv.Atoi(parts[len(parts)-1])
	if err != nil {
		response.WriteJSON(w, 400, "ID transaksi tidak valid")
		return
	}
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		response.WriteJSON(w, 401, "unauthorized")
		return
	}
	transaksi, items, err := h.svc.FindDetailLaporanByTransaksiID(transaksiID, claims.UserID)
	if err != nil {
		response.WriteJSON(w, 404, err.Error())
		return
	}
	response.WriteJSON(w, 200, map[string]interface{}{"transaksi": transaksi, "items": items})
}
