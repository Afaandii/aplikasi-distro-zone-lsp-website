package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"encoding/json"
	"errors"
	"net/http"
)

type VarianController struct {
	UC usecase.VarianUsecase
}

func NewVarianController(uc usecase.VarianUsecase) *VarianController {
	return &VarianController{UC: uc}
}

func (v *VarianController) GetAll(w http.ResponseWriter, r *http.Request) {
	varian, err := v.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, varian)
}

func (v *VarianController) GetByID(w http.ResponseWriter, r *http.Request, idVarian int) {
	varian, err := v.UC.GetByID(idVarian)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "varian not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, varian)
}

func (v *VarianController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		IdProduk int `json:"id_produk"`
		IdUkuran int `json:"id_ukuran"`
		IdWarna  int `json:"id_warna"`
		StokKaos int `json:"stok_kaos"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := v.UC.Create(
		payload.IdProduk,
		payload.IdUkuran,
		payload.IdWarna,
		payload.StokKaos,
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (v *VarianController) Update(w http.ResponseWriter, r *http.Request, idVarian int) {
	var payload struct {
		IdProduk int `json:"id_produk"`
		IdUkuran int `json:"id_ukuran"`
		IdWarna  int `json:"id_warna"`
		StokKaos int `json:"stok_kaos"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := v.UC.Update(
		idVarian,
		payload.IdProduk,
		payload.IdUkuran,
		payload.IdWarna,
		payload.StokKaos,
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "varian not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (v *VarianController) Delete(w http.ResponseWriter, r *http.Request, idVarian int) {
	err := v.UC.Delete(idVarian)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "varian not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
