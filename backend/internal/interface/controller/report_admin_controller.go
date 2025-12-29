package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	response "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
)

type ReportAdminController struct {
	Usecase *usecase.ReportAdminUsecase
}

func NewReportAdminController(u *usecase.ReportAdminUsecase) *ReportAdminController {
	return &ReportAdminController{Usecase: u}
}

func (c *ReportAdminController) GetAllTransaksi(w http.ResponseWriter, r *http.Request) {
	data, err := c.Usecase.GetAllTransaksi()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}

func (c *ReportAdminController) GetDetailTransaksiByIDTransaksi(w http.ResponseWriter, r *http.Request) {
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

	items, err := c.Usecase.GetDetailTransaksiByTransaksiID(transaksiID)
	if err != nil {
		response.WriteJSON(w, http.StatusNotFound, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"items": items,
	})
}

func (c *ReportAdminController) GetTransaksiByPeriode(w http.ResponseWriter, r *http.Request) {
	path := strings.Split(r.URL.Path, "/")
	startDate := path[len(path)-2]
	endDate := path[len(path)-1]

	data, err := c.Usecase.GetAllTransaksiByPeriode(startDate, endDate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}

func (c *ReportAdminController) GetLaporanRugiLaba(w http.ResponseWriter, r *http.Request) {
	path := strings.Split(r.URL.Path, "/")
	startDate := path[len(path)-2]
	endDate := path[len(path)-1]

	data, err := c.Usecase.GetLaporanRugiLaba(startDate, endDate)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}
