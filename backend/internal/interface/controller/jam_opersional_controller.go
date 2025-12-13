package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
)

type JamOperasionalController struct {
	UC usecase.JamOperasionalUsecase
}

func NewJamOperasionalController(uc usecase.JamOperasionalUsecase) *JamOperasionalController {
	return &JamOperasionalController{UC: uc}
}

func (jo *JamOperasionalController) GetAll(w http.ResponseWriter, r *http.Request) {
	jop, err := jo.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, jop)
}

func (jo *JamOperasionalController) GetByID(w http.ResponseWriter, r *http.Request, idJamOperasional int) {
	jop, err := jo.UC.GetByID(idJamOperasional)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "jam opersional not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, jop)
}

func (jo *JamOperasionalController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		TipeLayanan string `json:"tipe_layanan"`
		Hari        string `json:"hari"`
		JamBuka     string `json:"jam_buka"`
		JamTutup    string `json:"jam_tutup"`
		Status      string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	// VALIDASI FORMAT JAM (SAJA)
	const timeLayout = "15:04"
	if _, err := time.Parse(timeLayout, payload.JamBuka); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Format jam_buka harus HH:MM (contoh: jam:menit)",
		})
		return
	}

	if _, err := time.Parse(timeLayout, payload.JamTutup); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "Format jam_tutup harus HH:MM",
		})
		return
	}

	// KIRIM STRING KE USECASE
	created, err := jo.UC.Create(
		strings.TrimSpace(payload.TipeLayanan),
		strings.TrimSpace(payload.Hari),
		payload.JamBuka,
		payload.JamTutup,
		strings.TrimSpace(payload.Status),
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusCreated, created)
}

func (jo *JamOperasionalController) Update(w http.ResponseWriter, r *http.Request, idJamOperasional int) {
	var payload struct {
		TipeLayanan string `json:"tipe_layanan"`
		Hari        string `json:"hari"`
		JamBuka     string `json:"jam_buka"`
		JamTutup    string `json:"jam_tutup"`
		Status      string `json:"status"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	const timeLayout = "15:04"
	if _, err := time.Parse(timeLayout, payload.JamBuka); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "Format jam_buka harus HH:MM"})
		return
	}

	if _, err := time.Parse(timeLayout, payload.JamTutup); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "Format jam_tutup harus HH:MM"})
		return
	}

	updated, err := jo.UC.Update(
		idJamOperasional,
		strings.TrimSpace(payload.TipeLayanan),
		strings.TrimSpace(payload.Hari),
		payload.JamBuka,
		payload.JamTutup,
		strings.TrimSpace(payload.Status),
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "jam operasional not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, updated)
}

func (jo *JamOperasionalController) Delete(w http.ResponseWriter, r *http.Request, idJamOperasional int) {
	err := jo.UC.Delete(idJamOperasional)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "jam operasional not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
