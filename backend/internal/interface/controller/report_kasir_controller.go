package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	response "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strconv"
	"strings"
)

type ReportKasirController struct {
	Usecase *usecase.ReportKasirUsecase
}

func NewReportKasirController(u *usecase.ReportKasirUsecase) *ReportKasirController {
	return &ReportKasirController{Usecase: u}
}

func (c *ReportKasirController) FindLaporanByKasir(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	data, err := c.Usecase.FindTransaksiByKasir(
		kasirID,
	)

	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, data)
}

// internal/interface/controller/report_kasir_controller.go
func (c *ReportKasirController) FindLaporanByKasirAndPeriode(w http.ResponseWriter, r *http.Request, startDate string, endDate string) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	if startDate == "" || endDate == "" {
		response.WriteJSON(w, http.StatusBadRequest, "Periode tanggal wajib diisi")
		return
	}

	// 🔥 Ambil metode dari query string
	metode := r.URL.Query().Get("metode")

	data, err := c.Usecase.FindTransaksiByKasirAndPeriode(
		kasirID,
		startDate,
		endDate,
		metode,
	)

	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, data)
}

func (c *ReportKasirController) FindDetailLaporanByID(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
	if len(parts) < 5 || parts[len(parts)-1] == "" {
		response.WriteJSON(w, http.StatusBadRequest, "ID transaksi diperlukan")
		return
	}

	idStr := parts[len(parts)-1]
	transaksiID, err := strconv.Atoi(idStr)
	if err != nil {
		response.WriteJSON(w, http.StatusBadRequest, "ID transaksi tidak valid")
		return
	}

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		response.WriteJSON(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	kasirID := claims.UserID

	transaksi, items, err := c.Usecase.FindDetailLaporanByTransaksiID(transaksiID, kasirID)
	if err != nil {
		response.WriteJSON(w, http.StatusNotFound, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"transaksi": transaksi,
		"items":     items,
	})
}
