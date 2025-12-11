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

type MerkController struct {
	UC usecase.MerkUsecase
}

func NewMerkController(uc usecase.MerkUsecase) *MerkController {
	return &MerkController{UC: uc}
}

func (m *MerkController) GetAll(w http.ResponseWriter, r *http.Request) {
	merk, err := m.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, merk)
}

func (m *MerkController) GetByID(w http.ResponseWriter, r *http.Request, idMerk int) {
	merk, err := m.UC.GetByID(idMerk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "merk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, merk)
}

func (m *MerkController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		NamaMerk   string `json:"nama_merk"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := m.UC.Create(strings.TrimSpace(payload.NamaMerk), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (m *MerkController) Update(w http.ResponseWriter, r *http.Request, idMerk int) {
	var payload struct {
		NamaMerk   string `json:"nama_merk"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := m.UC.Update(idMerk, strings.TrimSpace(payload.NamaMerk), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "merk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (m *MerkController) Delete(w http.ResponseWriter, r *http.Request, idMerk int) {
	err := m.UC.Delete(idMerk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "merk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
