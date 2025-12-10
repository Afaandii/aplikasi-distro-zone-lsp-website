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

type CustomerController struct {
	UC usecase.CustomerUsecase
}

func NewCustomerController(uc usecase.CustomerUsecase) *CustomerController {
	return &CustomerController{UC: uc}
}

func (c *CustomerController) GetAll(w http.ResponseWriter, r *http.Request) {
	customer, err := c.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, customer)
}

func (c *CustomerController) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	customer, err := c.UC.GetByID(id)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "customer not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, customer)
}

func (c *CustomerController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Alamat   string `json:"alamat"`
		Kota     string `json:"kota"`
		NoTelp   string `json:"no_telp"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := c.UC.Create(
		strings.TrimSpace(payload.Username),
		strings.TrimSpace(payload.Email),
		strings.TrimSpace(payload.Password),
		strings.TrimSpace(payload.Alamat),
		strings.TrimSpace(payload.Kota),
		strings.TrimSpace(payload.NoTelp),
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (c *CustomerController) Update(w http.ResponseWriter, r *http.Request, idCustomer int) {
	var payload struct {
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Alamat   string `json:"alamat"`
		Kota     string `json:"kota"`
		NoTelp   string `json:"no_telp"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := c.UC.Update(
		idCustomer,
		strings.TrimSpace(payload.Username),
		strings.TrimSpace(payload.Email),
		strings.TrimSpace(payload.Password),
		strings.TrimSpace(payload.Alamat),
		strings.TrimSpace(payload.Kota),
		strings.TrimSpace(payload.NoTelp),
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "customer not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (m *CustomerController) Delete(w http.ResponseWriter, r *http.Request, idCustomer int) {
	err := m.UC.Delete(idCustomer)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "customer not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
