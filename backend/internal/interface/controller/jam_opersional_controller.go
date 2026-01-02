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

// parsing jam dari string ke time
func parseJamToTime(jam string) (time.Time, error) {
	layouts := []string{
		"15:04",
		"15:04:05",
	}

	var parsed time.Time
	var err error

	for _, layout := range layouts {
		parsed, err = time.Parse(layout, jam)
		if err == nil {
			return parsed, nil
		}
	}

	return time.Time{}, errors.New("format jam harus HH:MM atau HH:MM:SS")
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
	jamBuka, err := parseJamToTime(payload.JamBuka)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	jamTutup, err := parseJamToTime(payload.JamTutup)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	// KIRIM STRING KE USECASE
	created, err := jo.UC.Create(
		strings.TrimSpace(payload.TipeLayanan),
		strings.TrimSpace(payload.Hari),
		jamBuka.Format("15:04:05"),
		jamTutup.Format("15:04:05"),
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

	jamBuka, err := parseJamToTime(payload.JamBuka)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	jamTutup, err := parseJamToTime(payload.JamTutup)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	updated, err := jo.UC.Update(
		idJamOperasional,
		strings.TrimSpace(payload.TipeLayanan),
		strings.TrimSpace(payload.Hari),
		jamBuka.Format("15:04:05"),
		jamTutup.Format("15:04:05"),
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

func (jo *JamOperasionalController) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")

	// Panggil usecase
	jop, err := jo.UC.Search(keyword)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, jop)
}
