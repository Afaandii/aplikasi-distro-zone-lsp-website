package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"
)

type FotoProdukController struct {
	UC usecase.FotoProdukUsecase
}

func NewFotoProdukController(uc usecase.FotoProdukUsecase) *FotoProdukController {
	return &FotoProdukController{UC: uc}
}

func (fp *FotoProdukController) GetAll(w http.ResponseWriter, r *http.Request) {
	fotoProduk, err := fp.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, fotoProduk)
}

func (fp *FotoProdukController) GetByID(w http.ResponseWriter, r *http.Request, idFotoProduk int) {
	fotoProduk, err := fp.UC.GetByID(idFotoProduk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "foto produk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, fotoProduk)
}

func (fp *FotoProdukController) Create(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)

	idProdukStr := r.FormValue("id_produk")
	idProduk, err := strconv.Atoi(idProdukStr)
	if err != nil {
		helper.WriteJSON(w, 400, map[string]string{"error": "invalid id_produk"})
		return
	}

	file, handler, err := r.FormFile("url_foto")

	var urlFoto string

	// 4. Cek apakah foto dikirim, untuk Create foto ini WAJIB
	if err != nil {
		defer file.Close()
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "File foto_produk wajib diisi"})
		return
	}

	// 5. Baca file dan buat nama unik (sama seperti karyawan)
	fileBytes, _ := io.ReadAll(file)
	filename := fmt.Sprintf("foto-produk/%d_%s", time.Now().Unix(), handler.Filename)

	// 6. Upload ke Supabase menggunakan fungsi produk
	urlFoto, err = supabase.UploadProductPhoto(filename, fileBytes)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "Gagal upload foto: " + err.Error()})
		return
	}

	created, err := fp.UC.Create(
		idProduk,
		urlFoto,
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusCreated, created)
}

func (fp *FotoProdukController) Update(w http.ResponseWriter, r *http.Request, idFotoProduk int) {
	r.ParseMultipartForm(10 << 20)

	idProdukStr := r.FormValue("id_produk")
	idProduk, err := strconv.Atoi(idProdukStr)
	if err != nil {
		helper.WriteJSON(w, 400, map[string]string{"error": "invalid id_role"})
		return
	}

	var urlFoto string
	file, handler, err := r.FormFile("url_foto")

	// 4. Jika ada file baru, upload
	if err == nil {
		defer file.Close()
		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("foto-produk/%d_%s", time.Now().Unix(), handler.Filename)

		// Upload file baru ke Supabase
		urlFoto, err = supabase.UploadProductPhoto(filename, fileBytes)
		if err != nil {
			helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": "Gagal upload foto: " + err.Error()})
			return
		}
	}

	updated, err := fp.UC.Update(
		idFotoProduk,
		idProduk,
		urlFoto,
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "Foto produk tidak ditemukan"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, updated)
}

func (fp *FotoProdukController) Delete(w http.ResponseWriter, r *http.Request, idFotoProduk int) {
	err := fp.UC.Delete(idFotoProduk)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "foto produk not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}

func (fp *FotoProdukController) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")

	// Panggil usecase
	fotoProduk, err := fp.UC.Search(keyword)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, fotoProduk)
}
