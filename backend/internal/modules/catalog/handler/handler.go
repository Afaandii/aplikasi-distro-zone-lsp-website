package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/catalog/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

// ==================== Merk Handler ====================

type MerkHandler struct{ UC service.MerkService }

func NewMerkHandler(uc service.MerkService) *MerkHandler { return &MerkHandler{UC: uc} }

func (h *MerkHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *MerkHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "merk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *MerkHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		NamaMerk   string `json:"nama_merk"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(strings.TrimSpace(p.NamaMerk), strings.TrimSpace(p.Keterangan))
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *MerkHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		NamaMerk   string `json:"nama_merk"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, strings.TrimSpace(p.NamaMerk), strings.TrimSpace(p.Keterangan))
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "merk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *MerkHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "merk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *MerkHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== Tipe Handler ====================

type TipeHandler struct{ UC service.TipeService }

func NewTipeHandler(uc service.TipeService) *TipeHandler { return &TipeHandler{UC: uc} }

func (h *TipeHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *TipeHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "tipe not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *TipeHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		NamaTipe   string `json:"nama_tipe"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(strings.TrimSpace(p.NamaTipe), strings.TrimSpace(p.Keterangan))
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *TipeHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		NamaTipe   string `json:"nama_tipe"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, strings.TrimSpace(p.NamaTipe), strings.TrimSpace(p.Keterangan))
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "tipe not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *TipeHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "tipe not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *TipeHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== Ukuran Handler ====================

type UkuranHandler struct{ UC service.UkuranService }

func NewUkuranHandler(uc service.UkuranService) *UkuranHandler { return &UkuranHandler{UC: uc} }

func (h *UkuranHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *UkuranHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "ukuran not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *UkuranHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		NamaUkuran string `json:"nama_ukuran"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(strings.TrimSpace(p.NamaUkuran), strings.TrimSpace(p.Keterangan))
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *UkuranHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		NamaUkuran string `json:"nama_ukuran"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, strings.TrimSpace(p.NamaUkuran), strings.TrimSpace(p.Keterangan))
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "ukuran not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *UkuranHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "ukuran not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *UkuranHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== Warna Handler ====================

type WarnaHandler struct{ UC service.WarnaService }

func NewWarnaHandler(uc service.WarnaService) *WarnaHandler { return &WarnaHandler{UC: uc} }

func (h *WarnaHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *WarnaHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "warna not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *WarnaHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		NamaWarna  string `json:"nama_warna"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(strings.TrimSpace(p.NamaWarna), strings.TrimSpace(p.Keterangan))
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *WarnaHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		NamaWarna  string `json:"nama_warna"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, strings.TrimSpace(p.NamaWarna), strings.TrimSpace(p.Keterangan))
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "warna not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *WarnaHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "warna not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *WarnaHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== Master Data Handler ====================

type MasterDataHandler struct {
	ProdukSvc interface {
		GetAll() ([]entity.Produk, error)
	}
	MerkSvc   service.MerkService
	TipeSvc   service.TipeService
	UkuranSvc service.UkuranService
	WarnaSvc  service.WarnaService
}

func (c *MasterDataHandler) GetProdukMasterData(w http.ResponseWriter, r *http.Request) {
	produkChan := make(chan []entity.Produk, 1)
	merkChan := make(chan []entity.Merk, 1)
	tipeChan := make(chan []entity.Tipe, 1)
	ukuranChan := make(chan []entity.Ukuran, 1)
	warnaChan := make(chan []entity.Warna, 1)
	errChan := make(chan error, 5)

	go func() {
		data, err := c.ProdukSvc.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		produkChan <- data
	}()
	go func() {
		data, err := c.MerkSvc.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		merkChan <- data
	}()
	go func() {
		data, err := c.TipeSvc.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		tipeChan <- data
	}()
	go func() {
		data, err := c.UkuranSvc.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		ukuranChan <- data
	}()
	go func() {
		data, err := c.WarnaSvc.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		warnaChan <- data
	}()

	masterData := make(map[string]interface{})
	for i := 0; i < 5; i++ {
		select {
		case err := <-errChan:
			response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
			return
		case d := <-produkChan:
			masterData["produk"] = d
		case d := <-merkChan:
			masterData["merk"] = d
		case d := <-tipeChan:
			masterData["tipe"] = d
		case d := <-ukuranChan:
			masterData["ukuran"] = d
		case d := <-warnaChan:
			masterData["warna"] = d
		}
	}

	response.WriteJSON(w, 200, masterData)
}
