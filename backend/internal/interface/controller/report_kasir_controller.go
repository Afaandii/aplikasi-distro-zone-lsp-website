package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	response "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
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

	data, err := c.Usecase.FindTransaksiByKasirAndPeriode(
		kasirID,
		startDate,
		endDate,
	)

	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, data)
}
