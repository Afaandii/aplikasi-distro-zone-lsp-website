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

type UkuranController struct {
	UC usecase.UkuranUsecase
}

func NewUkuranController(uc usecase.UkuranUsecase) *UkuranController {
	return &UkuranController{UC: uc}
}

func (u *UkuranController) GetAll(w http.ResponseWriter, r *http.Request) {
	uk, err := u.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, uk)
}

func (u *UkuranController) GetByID(w http.ResponseWriter, r *http.Request, idUkuran int) {
	uk, err := u.UC.GetByID(idUkuran)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "ukuran not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, uk)
}

func (u *UkuranController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		NamaUkuran string `json:"nama_ukuran"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := u.UC.Create(strings.TrimSpace(payload.NamaUkuran), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (u *UkuranController) Update(w http.ResponseWriter, r *http.Request, idUkuran int) {
	var payload struct {
		NamaUkuran string `json:"nama_ukuran"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := u.UC.Update(idUkuran, strings.TrimSpace(payload.NamaUkuran), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "ukuran not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (u *UkuranController) Delete(w http.ResponseWriter, r *http.Request, idUkuran int) {
	err := u.UC.Delete(idUkuran)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "ukuran not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
