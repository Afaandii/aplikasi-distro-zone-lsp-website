package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"
	"encoding/json"
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

type LoginRequest struct {
	Username   string `json:"username"`
	Password   string `json:"password"`
	RememberMe bool   `json:"remember_me"`
}

type RegisterRequest struct {
	Nama     string `json:"nama"`
	Username string `json:"username"`
	Password string `json:"password"`
	NoTelp   string `json:"no_telp"`
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

func (k *UserController) GetCashiers(w http.ResponseWriter, r *http.Request) {
	cashiers, err := k.UC.GetCashiers()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, cashiers)
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
		if r.FormValue("id_role") == "" {
			helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "id_role is required"})
		} else {
			helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id_role format"})
		}
		return
	}

	// AMBIL DATA USER YANG SUDAH ADA UNTUK MENDAPATKAN FOTO LAMA
	existingUser, err := usr.UC.GetByID(idUser)
	if err != nil {
		helper.WriteJSON(w, 404, map[string]string{"error": "user not found"})
		return
	}

	// GUNAKAN FOTO LAMA SEBAGAI NILAI DEFAULT
	var photoURL string = existingUser.FotoProfile

	// cek apakah ada file baru
	file, handler, err := r.FormFile("foto_profile")
	if err == nil {
		defer file.Close()

		// HAPUS FOTO LAMA JIKA ADA
		if existingUser.FotoProfile != "" {
			err = supabase.DeleteUserPhoto(existingUser.FotoProfile)
			if err != nil {
				fmt.Printf("Gagal menghapus foto lama: %v\n", err)
			}
		}

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
	user, err := usr.UC.GetByID(idUser)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	if user.FotoProfile != "" {
		err = supabase.DeleteUserPhoto(user.FotoProfile)
		if err != nil {
			fmt.Printf("Gagal menghapus foto user: %v\n", err)
		}
	}

	err = usr.UC.Delete(idUser)
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

func (usr *UserController) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	// set cookie
	var maxAge int
	if req.RememberMe {
		maxAge = 30 * 24 * 60 * 60
	} else {
		maxAge = 8 * 60 * 60
	}

	// Terima token dari usecase
	user, token, err := usr.UC.Login(req.Username, req.Password, req.RememberMe)
	if err != nil {
		var authErr *helperPkg.AuthenticationError
		if errors.As(err, &authErr) {
			helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": authErr.Message})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Expires:  time.Now().Add(time.Duration(maxAge) * time.Second),
		MaxAge:   maxAge,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	// --- LOGIKA BARU: KIRIM TOKEN KE FRONTEND ---
	helper.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Login successful",
		"user":    user,
		"token":   token,
	})
}

func (usr *UserController) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	// Validate required fields
	if req.Nama == "" || req.Username == "" || req.Password == "" || req.NoTelp == "" {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "All fields are required"})
		return
	}

	user, err := usr.UC.Register(req.Nama, req.Username, req.Password, req.NoTelp)
	if err != nil {
		var conflictErr *helperPkg.ConflictError
		if errors.As(err, &conflictErr) {
			helper.WriteJSON(w, http.StatusConflict, map[string]string{"error": conflictErr.Message})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusCreated, map[string]interface{}{
		"message": "Registration successful",
		"user":    user,
	})
}

func (usr *UserController) Logout(w http.ResponseWriter, r *http.Request) {
	// Untuk JWT, logout sebenarnya terjadi di sisi klien dengan menghapus token
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	helper.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "Logout successful",
	})
}

func (c *UserController) UpdateAddress(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Alamat string `json:"alamat"`
		Kota   string `json:"kota"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "payload tidak valid",
		})
		return
	}

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	user, err := c.UC.UpdateAddress(
		claims.UserID,
		req.Alamat,
		req.Kota,
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	helper.WriteJSON(w, http.StatusOK, user)
}

func (c *UserController) GetTransaksiByUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	userID := claims.UserID

	// Panggil usecase untuk mendapatkan transaksi berdasarkan user ID
	transaksi, err := c.UC.GetTransaksiByUser(userID)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, transaksi)
}

func (c *UserController) GetPesananByUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	userID := claims.UserID

	// Panggil usecase untuk mendapatkan pesanan berdasarkan user ID
	pesanan, err := c.UC.GetPesananByUser(userID)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, pesanan)
}

func (c *UserController) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")

	users, err := c.UC.Search(keyword)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	helper.WriteJSON(w, http.StatusOK, users)
}
