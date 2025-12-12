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

type UserController struct {
	UC usecase.UserUsecase
}

func NewUserController(uc usecase.UserUsecase) *UserController {
	return &UserController{UC: uc}
}

func (k *UserController) GetAll(w http.ResponseWriter, r *http.Request) {
	user, err := k.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, user)
}

func (k *UserController) GetByID(w http.ResponseWriter, r *http.Request, idUser int) {
	user, err := k.UC.GetByID(idUser)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, user)
}

func (usr *UserController) Create(w http.ResponseWriter, r *http.Request) {
	// wajib parse multipart
	r.ParseMultipartForm(10 << 20) // max 10MB

	// ambil values dari form field
	idRoleStr := r.FormValue("id_role")
	nama := r.FormValue("nama")
	username := r.FormValue("username")
	password := r.FormValue("password")
	nik := r.FormValue("nik")
	alamat := r.FormValue("alamat")
	kota := r.FormValue("kota")
	noTelp := r.FormValue("no_telp")

	// convert id_role string → int
	idRole, err := strconv.Atoi(idRoleStr)
	if err != nil {
		helper.WriteJSON(w, 400, map[string]string{"error": "invalid id_role"})
		return
	}

	// ambil file foto
	file, handler, err := r.FormFile("foto_profile")
	var photoURL string

	if err == nil { // jika foto dikirim
		defer file.Close()

		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("user/%d_%s", time.Now().Unix(), handler.Filename)

		photoURL, err = supabase.UploadUserPhoto(filename, fileBytes)
		if err != nil {
			helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
			return
		}
	}

	// simpan data ke database lewat usecase
	created, err := usr.UC.Create(
		idRole,
		nama,
		username,
		password,
		nik,
		alamat,
		kota,
		noTelp,
		photoURL,
	)
	if err != nil {
		helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, 201, created)
}

func (usr *UserController) Update(w http.ResponseWriter, r *http.Request, idUser int) {
	r.ParseMultipartForm(10 << 20)

	idRoleStr := r.FormValue("id_role")
	nama := r.FormValue("nama")
	username := r.FormValue("username")
	password := r.FormValue("password")
	nik := r.FormValue("nik")
	alamat := r.FormValue("alamat")
	kota := r.FormValue("kota")
	noTelp := r.FormValue("no_telp")

	idRole, err := strconv.Atoi(idRoleStr)
	if err != nil {
		helper.WriteJSON(w, 400, map[string]string{"error": "invalid id_role"})
		return
	}

	var photoURL string

	// cek apakah ada file
	file, handler, err := r.FormFile("foto_profile")
	if err == nil {
		defer file.Close()

		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("user/%d_%s", time.Now().Unix(), handler.Filename)

		photoURL, err = supabase.UploadUserPhoto(filename, fileBytes)
		if err != nil {
			helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
			return
		}
	}

	updated, err := usr.UC.Update(
		idUser,
		idRole,
		nama,
		username,
		password,
		nik,
		alamat,
		kota,
		noTelp,
		photoURL,
	)
	if err != nil {
		helper.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, 200, updated)
}

func (usr *UserController) Delete(w http.ResponseWriter, r *http.Request, idUser int) {
	err := usr.UC.Delete(idUser)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}
