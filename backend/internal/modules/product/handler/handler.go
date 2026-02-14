package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/product/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// ==================== Produk Handler ====================

type ProdukHandler struct{ UC service.ProdukService }

func NewProdukHandler(uc service.ProdukService) *ProdukHandler { return &ProdukHandler{UC: uc} }

func (h *ProdukHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ProdukHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "produk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ProdukHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		IdMerk      int    `json:"id_merk"`
		IdTipe      int    `json:"id_tipe"`
		NamaKaos    string `json:"nama_kaos"`
		HargaJual   int    `json:"harga_jual"`
		HargaPokok  int    `json:"harga_pokok"`
		Deskripsi   string `json:"deskripsi"`
		Spesifikasi string `json:"spesifikasi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(p.IdMerk, p.IdTipe, strings.TrimSpace(p.NamaKaos), p.HargaJual, p.HargaPokok, p.Deskripsi, p.Spesifikasi)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *ProdukHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		IdMerk      int    `json:"id_merk"`
		IdTipe      int    `json:"id_tipe"`
		NamaKaos    string `json:"nama_kaos"`
		HargaJual   int    `json:"harga_jual"`
		HargaPokok  int    `json:"harga_pokok"`
		Deskripsi   string `json:"deskripsi"`
		Spesifikasi string `json:"spesifikasi"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, p.IdMerk, p.IdTipe, strings.TrimSpace(p.NamaKaos), p.HargaJual, p.HargaPokok, p.Deskripsi, p.Spesifikasi)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "produk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ProdukHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "produk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *ProdukHandler) GetProductDetailByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetProductDetailByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "produk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ProdukHandler) Search(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("q")
	data, err := h.UC.SearchByName(name)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *ProdukHandler) SearchForAdmin(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.SearchProdukForAdmin(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== Varian Handler ====================

type VarianHandler struct{ UC service.VarianService }

func NewVarianHandler(uc service.VarianService) *VarianHandler { return &VarianHandler{UC: uc} }

func (h *VarianHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *VarianHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "varian not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *VarianHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
		IdProduk int `json:"id_produk"`
		IdUkuran int `json:"id_ukuran"`
		IdWarna  int `json:"id_warna"`
		StokKaos int `json:"stok_kaos"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Create(p.IdProduk, p.IdUkuran, p.IdWarna, p.StokKaos)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *VarianHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
		IdProduk int `json:"id_produk"`
		IdUkuran int `json:"id_ukuran"`
		IdWarna  int `json:"id_warna"`
		StokKaos int `json:"stok_kaos"`
	}
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.UC.Update(id, p.IdProduk, p.IdUkuran, p.IdWarna, p.StokKaos)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "varian not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *VarianHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "varian not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *VarianHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *VarianHandler) GetAllByProduk(w http.ResponseWriter, r *http.Request, idProduk int) {
	data, err := h.UC.GetAllByProduk(idProduk)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *VarianHandler) DeleteByProduk(w http.ResponseWriter, r *http.Request, idProduk int) {
	if err := h.UC.DeleteByProduk(idProduk); err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "Varian berhasil dihapus!"})
}

// ==================== FotoProduk Handler ====================

type FotoProdukHandler struct{ UC service.FotoProdukService }

func NewFotoProdukHandler(uc service.FotoProdukService) *FotoProdukHandler {
	return &FotoProdukHandler{UC: uc}
}

func (h *FotoProdukHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *FotoProdukHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.UC.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "foto produk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *FotoProdukHandler) Create(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)
	idProduk, err := strconv.Atoi(r.FormValue("id_produk"))
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid id_produk"})
		return
	}
	idWarna, err := strconv.Atoi(r.FormValue("id_warna"))
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid id_warna"})
		return
	}

	file, handler, err := r.FormFile("url_foto")
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "File foto_produk wajib diisi"})
		return
	}
	defer file.Close()

	fileBytes, _ := io.ReadAll(file)
	filename := fmt.Sprintf("foto-produk/%d_%s", time.Now().Unix(), handler.Filename)
	urlFoto, err := supabase.UploadProductPhoto(filename, fileBytes)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": "Gagal upload foto: " + err.Error()})
		return
	}

	data, err := h.UC.Create(idProduk, idWarna, urlFoto)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *FotoProdukHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	r.ParseMultipartForm(10 << 20)
	idProduk, err := strconv.Atoi(r.FormValue("id_produk"))
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid id_produk"})
		return
	}
	idWarna, err := strconv.Atoi(r.FormValue("id_warna"))
	if err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid id_warna"})
		return
	}

	var urlFoto string
	file, handler, err := r.FormFile("url_foto")
	if err == nil {
		defer file.Close()
		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("foto-produk/%d_%s", time.Now().Unix(), handler.Filename)
		urlFoto, err = supabase.UploadProductPhoto(filename, fileBytes)
		if err != nil {
			response.WriteJSON(w, 500, map[string]string{"error": "Gagal upload foto: " + err.Error()})
			return
		}
	}

	data, err := h.UC.Update(id, idProduk, idWarna, urlFoto)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "Foto produk tidak ditemukan"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *FotoProdukHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.UC.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "foto produk not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *FotoProdukHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")
	data, err := h.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *FotoProdukHandler) GetAllByProduk(w http.ResponseWriter, r *http.Request, idProduk int) {
	data, err := h.UC.GetAllByProduk(idProduk)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *FotoProdukHandler) DeleteByProduk(w http.ResponseWriter, r *http.Request, idProduk int) {
	if err := h.UC.DeleteByProduk(idProduk); err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "Foto produk berhasil dihapus!"})
}
