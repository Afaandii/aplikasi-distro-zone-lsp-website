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

type RoleController struct {
	UC usecase.RoleUsecase
}

func NewRoleController(uc usecase.RoleUsecase) *RoleController {
	return &RoleController{UC: uc}
}

func (m *RoleController) GetAll(w http.ResponseWriter, r *http.Request) {
	role, err := m.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, role)
}

func (m *RoleController) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	role, err := m.UC.GetByID(id)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "role not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, role)
}

func (m *RoleController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		NamaRole   string `json:"nama_role"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := m.UC.Create(strings.TrimSpace(payload.NamaRole), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (m *RoleController) Update(w http.ResponseWriter, r *http.Request, idRole int) {
	var payload struct {
		NamaRole   string `json:"nama_role"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := m.UC.Update(idRole, strings.TrimSpace(payload.NamaRole), strings.TrimSpace(payload.Keterangan))
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "role not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (m *RoleController) Delete(w http.ResponseWriter, r *http.Request, idRole int) {
	err := m.UC.Delete(idRole)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "role not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
