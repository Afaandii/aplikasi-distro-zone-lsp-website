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

type TipeController struct {
	UC usecase.TipeUsecase
}

func NewTipeController(uc usecase.TipeUsecase) *TipeController {
	return &TipeController{UC: uc}
}

func (t *TipeController) GetAll(w http.ResponseWriter, r *http.Request) {
	tipe, err := t.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, tipe)
}

func (t *TipeController) GetByID(w http.ResponseWriter, r *http.Request, idTipe int) {
	tipe, err := t.UC.GetByID(idTipe)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "tipe not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, tipe)
}

func (t *TipeController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		NamaTipe   string `json:"nama_tipe"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := t.UC.Create(strings.TrimSpace(payload.NamaTipe), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (t *TipeController) Update(w http.ResponseWriter, r *http.Request, idTipe int) {
	var payload struct {
		NamaTipe   string `json:"nama_tipe"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := t.UC.Update(idTipe, strings.TrimSpace(payload.NamaTipe), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "tipe not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (t *TipeController) Delete(w http.ResponseWriter, r *http.Request, idTipe int) {
	err := t.UC.Delete(idTipe)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "tipe not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
