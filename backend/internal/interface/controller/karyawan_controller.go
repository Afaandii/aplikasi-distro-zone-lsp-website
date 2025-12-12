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

type KaryawanController struct {
	UC usecase.KaryawanUsecase
}

func NewKaryawanController(uc usecase.KaryawanUsecase) *KaryawanController {
	return &KaryawanController{UC: uc}
}

func (k *KaryawanController) GetAll(w http.ResponseWriter, r *http.Request) {
	karyawan, err := k.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, karyawan)
}

func (k *KaryawanController) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	karyawan, err := k.UC.GetByID(id)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "karyawan not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, karyawan)
}

func (k *KaryawanController) Create(w http.ResponseWriter, r *http.Request) {
	// wajib parse multipart
	r.ParseMultipartForm(10 << 20) // max 10MB

	// ambil values dari form field
	idRoleStr := r.FormValue("id_role")
	nama := r.FormValue("nama")
	username := r.FormValue("username")
	password := r.FormValue("password")
	alamat := r.FormValue("alamat")
	noTelp := r.FormValue("no_telp")
	nik := r.FormValue("nik")

	// convert id_role string → int
	idRole, err := strconv.Atoi(idRoleStr)
	if err != nil {
		helper.WriteJSON(w, 400, map[string]string{"error": "invalid id_role"})
		return
	}

	// ambil file foto
	file, handler, err := r.FormFile("foto_karyawan")
	var photoURL string

	if err == nil { // jika foto dikirim
		defer file.Close()

		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("karyawan/%d_%s", time.Now().Unix(), handler.Filename)

		photoURL, err = supabase.UploadUserPhoto(filename, fileBytes)
		if err != nil {
			helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
			return
		}
	}

	// simpan data ke database lewat usecase
	created, err := k.UC.Create(
		idRole,
		nama,
		username,
		password,
		alamat,
		noTelp,
		nik,
		photoURL,
	)
	if err != nil {
		helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, 201, created)
}

func (k *KaryawanController) Update(w http.ResponseWriter, r *http.Request, idKaryawan int) {
	r.ParseMultipartForm(10 << 20)

	idRoleStr := r.FormValue("id_role")
	nama := r.FormValue("nama")
	username := r.FormValue("username")
	password := r.FormValue("password")
	alamat := r.FormValue("alamat")
	noTelp := r.FormValue("no_telp")
	nik := r.FormValue("nik")

	idRole, err := strconv.Atoi(idRoleStr)
	if err != nil {
		helper.WriteJSON(w, 400, map[string]string{"error": "invalid id_role"})
		return
	}

	var photoURL string

	// cek apakah ada file
	file, handler, err := r.FormFile("foto_karyawan")
	if err == nil {
		defer file.Close()

		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("karyawan/%d_%s", time.Now().Unix(), handler.Filename)

		photoURL, err = supabase.UploadUserPhoto(filename, fileBytes)
		if err != nil {
			helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
			return
		}
	}

	updated, err := k.UC.Update(
		idKaryawan,
		idRole,
		nama,
		username,
		password,
		alamat,
		noTelp,
		nik,
		photoURL, // bisa "" → artinya tidak update foto
	)
	if err != nil {
		helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, 200, updated)
}

func (k *KaryawanController) Delete(w http.ResponseWriter, r *http.Request, idKaryawan int) {
	err := k.UC.Delete(idKaryawan)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "karyawan not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
