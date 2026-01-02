package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type TarifPengirimanController struct {
	UC usecase.TarifPengirimanUsecase
}

func NewTarifPengirimanController(uc usecase.TarifPengirimanUsecase) *TarifPengirimanController {
	return &TarifPengirimanController{UC: uc}
}

func (tp *TarifPengirimanController) GetAll(w http.ResponseWriter, r *http.Request) {
	trfp, err := tp.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, trfp)
}

func (tp *TarifPengirimanController) GetByID(w http.ResponseWriter, r *http.Request, idTarifPengiriman int) {
	trfp, err := tp.UC.GetByID(idTarifPengiriman)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "tarif pengiriman not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, trfp)
}

func (tp *TarifPengirimanController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Wilayah    string `json:"wilayah"`
		HargaPerKg int    `json:"harga_per_kg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := tp.UC.Create(
		strings.TrimSpace(payload.Wilayah),
		payload.HargaPerKg,
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (tp *TarifPengirimanController) Update(w http.ResponseWriter, r *http.Request, idTarifPengiriman int) {
	var payload struct {
		Wilayah    string `json:"wilayah"`
		HargaPerKg int    `json:"harga_per_kg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := tp.UC.Update(
		idTarifPengiriman,
		strings.TrimSpace(payload.Wilayah),
		payload.HargaPerKg,
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "tarif pengiriman not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (tp *TarifPengirimanController) Delete(w http.ResponseWriter, r *http.Request, idTarifPengiriman int) {
	err := tp.UC.Delete(idTarifPengiriman)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "tarif pengiriman not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}

func (tp *TarifPengirimanController) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")

	// Panggil usecase
	taper, err := tp.UC.Search(keyword)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, taper)
}
