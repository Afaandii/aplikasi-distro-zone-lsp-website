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

type ProdukController struct {
	UC usecase.ProdukUsecase
}

func NewProdukController(uc usecase.ProdukUsecase) *ProdukController {
	return &ProdukController{UC: uc}
}

func (p *ProdukController) GetAll(w http.ResponseWriter, r *http.Request) {
	produk, err := p.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, produk)
}

func (p *ProdukController) GetByID(w http.ResponseWriter, r *http.Request, idProduk int) {
	produk, err := p.UC.GetByID(idProduk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "produk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, produk)
}

func (p *ProdukController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		IdMerk      int    `json:"id_merk"`
		IdTipe      int    `json:"id_tipe"`
		NamaKaos    string `json:"nama_kaos"`
		HargaJual   int    `json:"harga_jual"`
		HargaPokok  int    `json:"harga_pokok"`
		Deskripsi   string `json:"deskripsi"`
		Spesifikasi string `json:"spesifikasi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := p.UC.Create(
		payload.IdMerk,
		payload.IdTipe,
		strings.TrimSpace(payload.NamaKaos),
		payload.HargaJual,
		payload.HargaPokok,
		payload.Deskripsi,
		payload.Spesifikasi,
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (p *ProdukController) Update(w http.ResponseWriter, r *http.Request, idProduk int) {
	var payload struct {
		IdMerk      int    `json:"id_merk"`
		IdTipe      int    `json:"id_tipe"`
		NamaKaos    string `json:"nama_kaos"`
		HargaJual   int    `json:"harga_jual"`
		HargaPokok  int    `json:"harga_pokok"`
		Deskripsi   string `json:"deskripsi"`
		Spesifikasi string `json:"spesifikasi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := p.UC.Update(
		idProduk,
		payload.IdMerk,
		payload.IdTipe,
		strings.TrimSpace(payload.NamaKaos),
		payload.HargaJual,
		payload.HargaPokok,
		payload.Deskripsi,
		payload.Spesifikasi,
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "produk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (p *ProdukController) Delete(w http.ResponseWriter, r *http.Request, idProduk int) {
	err := p.UC.Delete(idProduk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "produk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}

func (p *ProdukController) GetProductDetailByID(w http.ResponseWriter, r *http.Request, idProduk int) {
	produk, err := p.UC.GetProductDetailByID(idProduk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "produk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, produk)
}
