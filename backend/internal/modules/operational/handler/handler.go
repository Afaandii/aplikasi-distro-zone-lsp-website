package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/operational/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"
)

// parseJamToTime parses time strings like "15:04" or "15:04:05"
func parseJamToTime(jam string) (time.Time, error) {
	layouts := []string{"15:04", "15:04:05"}
	for _, layout := range layouts {
		if parsed, err := time.Parse(layout, jam); err == nil {
			return parsed, nil
		}
	}
	return time.Time{}, errors.New("format jam harus HH:MM atau HH:MM:SS")
}

// ==================== JamOperasional Handler ====================

type JamOperasionalHandler struct{ UC service.JamOperasionalService }

func NewJamOperasionalHandler(uc service.JamOperasionalService) *JamOperasionalHandler {
	return &JamOperasionalHandler{UC: uc}
}

func (h *JamOperasionalHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *JamOperasionalHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "jam opersional not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *JamOperasionalHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		TipeLayanan string `json:"tipe_layanan"`
		Hari        string `json:"hari"`
		JamBuka     string `json:"jam_buka"`
		JamTutup    string `json:"jam_tutup"`
		Status      string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	jamBuka, err := parseJamToTime(p.JamBuka)
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}
	jamTutup, err := parseJamToTime(p.JamTutup)
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}

	data, err := h.UC.Create(strings.TrimSpace(p.TipeLayanan), strings.TrimSpace(p.Hari), jamBuka.Format("15:04:05"), jamTutup.Format("15:04:05"), strings.TrimSpace(p.Status))
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *JamOperasionalHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		TipeLayanan string `json:"tipe_layanan"`
		Hari        string `json:"hari"`
		JamBuka     string `json:"jam_buka"`
		JamTutup    string `json:"jam_tutup"`
		Status      string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	jamBuka, err := parseJamToTime(p.JamBuka)
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}
	jamTutup, err := parseJamToTime(p.JamTutup)
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": err.Error()})
		return
	}

	data, err := h.UC.Update(id, strings.TrimSpace(p.TipeLayanan), strings.TrimSpace(p.Hari), jamBuka.Format("15:04:05"), jamTutup.Format("15:04:05"), strings.TrimSpace(p.Status))
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "jam operasional not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *JamOperasionalHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "jam operasional not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *JamOperasionalHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== TarifPengiriman Handler ====================

type TarifPengirimanHandler struct {
	UC service.TarifPengirimanService
}

func NewTarifPengirimanHandler(uc service.TarifPengirimanService) *TarifPengirimanHandler {
	return &TarifPengirimanHandler{UC: uc}
}

func (h *TarifPengirimanHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *TarifPengirimanHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "tarif pengiriman not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *TarifPengirimanHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		Wilayah    string `json:"wilayah"`
		HargaPerKg int    `json:"harga_per_kg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(strings.TrimSpace(p.Wilayah), p.HargaPerKg)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *TarifPengirimanHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		Wilayah    string `json:"wilayah"`
		HargaPerKg int    `json:"harga_per_kg"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, strings.TrimSpace(p.Wilayah), p.HargaPerKg)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "tarif pengiriman not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *TarifPengirimanHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "tarif pengiriman not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *TarifPengirimanHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}
