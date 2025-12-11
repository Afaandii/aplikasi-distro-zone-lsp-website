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

type WarnaController struct {
	UC usecase.WarnaUsecase
}

func NewWarnaController(uc usecase.WarnaUsecase) *WarnaController {
	return &WarnaController{UC: uc}
}

func (wr *WarnaController) GetAll(w http.ResponseWriter, r *http.Request) {
	warna, err := wr.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, warna)
}

func (wr *WarnaController) GetByID(w http.ResponseWriter, r *http.Request, idWarna int) {
	warna, err := wr.UC.GetByID(idWarna)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "warna not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, warna)
}

func (wr *WarnaController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		NamaWarna  string `json:"nama_warna"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := wr.UC.Create(strings.TrimSpace(payload.NamaWarna), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (wr *WarnaController) Update(w http.ResponseWriter, r *http.Request, idWarna int) {
	var payload struct {
		NamaWarna  string `json:"nama_warna"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := wr.UC.Update(idWarna, strings.TrimSpace(payload.NamaWarna), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "warna not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (wr *WarnaController) Delete(w http.ResponseWriter, r *http.Request, idWarna int) {
	err := wr.UC.Delete(idWarna)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "warna not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
