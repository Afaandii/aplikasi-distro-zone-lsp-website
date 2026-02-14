package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/internal/modules/user/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
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

// ==================== User Handler ====================

type UserHandler struct {
	UC service.UserService
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

func NewUserHandler(uc service.UserService) *UserHandler {
	return &UserHandler{UC: uc}
}

func (k *UserHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	user, err := k.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, user)
}

func (k *UserHandler) GetByID(w http.ResponseWriter, r *http.Request, idUser int) {
	user, err := k.UC.GetByID(idUser)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			response.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, user)
}

func (k *UserHandler) GetCashiers(w http.ResponseWriter, r *http.Request) {
	cashiers, err := k.UC.GetCashiers()
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, cashiers)
}

func (usr *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
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
		response.WriteJSON(w, 400, map[string]string{"error": "invalid id_role"})
		return
	}

	file, handler, err := r.FormFile("foto_profile")
	var photoURL string

	if err == nil {
		defer file.Close()

		fileBytes, _ := io.ReadAll(file)
		filename := fmt.Sprintf("user/%d_%s", time.Now().Unix(), handler.Filename)

		photoURL, err = supabase.UploadUserPhoto(filename, fileBytes)
		if err != nil {
			response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
			return
		}
	}

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
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}

	response.WriteJSON(w, 201, created)
}

func (usr *UserHandler) Update(w http.ResponseWriter, r *http.Request, idUser int) {
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
			response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "id_role is required"})
		} else {
			response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid id_role format"})
		}
		return
	}

	existingUser, err := usr.UC.GetByID(idUser)
	if err != nil {
		response.WriteJSON(w, 404, map[string]string{"error": "user not found"})
		return
	}

	var photoURL string = existingUser.FotoProfile

	file, handler, err := r.FormFile("foto_profile")
	if err == nil {
		defer file.Close()

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
			response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
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
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}

	response.WriteJSON(w, 200, updated)
}

func (usr *UserHandler) Delete(w http.ResponseWriter, r *http.Request, idUser int) {
	user, err := usr.UC.GetByID(idUser)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			response.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
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
			response.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "user not found"})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}

func (usr *UserHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	var maxAge int
	if req.RememberMe {
		maxAge = 30 * 24 * 60 * 60
	} else {
		maxAge = 8 * 60 * 60
	}

	user, token, err := usr.UC.Login(req.Username, req.Password, req.RememberMe)
	if err != nil {
		var authErr *helperPkg.AuthenticationError
		if errors.As(err, &authErr) {
			response.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": authErr.Message})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
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

	response.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"message": "Login successful",
		"user":    user,
		"token":   token,
	})
}

func (usr *UserHandler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "Invalid request body"})
		return
	}

	if req.Nama == "" || req.Username == "" || req.Password == "" || req.NoTelp == "" {
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "All fields are required"})
		return
	}

	user, err := usr.UC.Register(req.Nama, req.Username, req.Password, req.NoTelp)
	if err != nil {
		var conflictErr *helperPkg.ConflictError
		if errors.As(err, &conflictErr) {
			response.WriteJSON(w, http.StatusConflict, map[string]string{"error": conflictErr.Message})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	response.WriteJSON(w, http.StatusCreated, map[string]interface{}{
		"message": "Registration successful",
		"user":    user,
	})
}

func (usr *UserHandler) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteStrictMode,
	})

	response.WriteJSON(w, http.StatusOK, map[string]string{
		"message": "Logout successful",
	})
}

func (c *UserHandler) UpdateAddress(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Alamat string `json:"alamat"`
		Kota   string `json:"kota"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "payload tidak valid",
		})
		return
	}

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		response.WriteJSON(w, http.StatusUnauthorized, map[string]string{
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
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": err.Error(),
		})
		return
	}

	response.WriteJSON(w, http.StatusOK, user)
}

func (c *UserHandler) GetTransaksiByUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		response.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	userID := claims.UserID

	transaksi, err := c.UC.GetTransaksiByUser(userID)
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	response.WriteJSON(w, http.StatusOK, transaksi)
}

func (c *UserHandler) GetPesananByUser(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		response.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	userID := claims.UserID

	pesanan, err := c.UC.GetPesananByUser(userID)
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	response.WriteJSON(w, http.StatusOK, pesanan)
}

func (c *UserHandler) Search(w http.ResponseWriter, r *http.Request) {
	keyword := r.URL.Query().Get("q")

	users, err := c.UC.Search(keyword)
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}

	response.WriteJSON(w, http.StatusOK, users)
}

// ==================== Role Handler ====================

type RoleHandler struct {
	UC service.RoleService
}

func NewRoleHandler(uc service.RoleService) *RoleHandler {
	return &RoleHandler{UC: uc}
}

func (rl *RoleHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	role, err := rl.UC.GetAll()
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, role)
}

func (rl *RoleHandler) GetByID(w http.ResponseWriter, r *http.Request, idRole int) {
	role, err := rl.UC.GetByID(idRole)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			response.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "role not found"})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, role)
}

func (rl *RoleHandler) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		NamaRole   string `json:"nama_role"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := rl.UC.Create(payload.NamaRole, payload.Keterangan)
	if err != nil {
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusCreated, created)
}

func (rl *RoleHandler) Update(w http.ResponseWriter, r *http.Request, idRole int) {
	var payload struct {
		NamaRole   string `json:"nama_role"`
		Keterangan string `json:"keterangan"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		response.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := rl.UC.Update(idRole, payload.NamaRole, payload.Keterangan)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			response.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "role not found"})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, updated)
}

func (rl *RoleHandler) Delete(w http.ResponseWriter, r *http.Request, idRole int) {
	err := rl.UC.Delete(idRole)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			response.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "role not found"})
			return
		}
		response.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}

// ==================== Admin Handler ====================

type AdminHandler struct {
	UC *service.AdminService
}

func NewAdminHandler(uc *service.AdminService) *AdminHandler {
	return &AdminHandler{UC: uc}
}

func (c *AdminHandler) GetPesananProses(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananDiproses()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *AdminHandler) GetPesananDikemas(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananDikemas()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *AdminHandler) GetPesananDikirim(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananDikirim()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *AdminHandler) SetPesananDikemas(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	adminID := claims.UserID

	if err := c.UC.SetPesananDikemas(kode, adminID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (c *AdminHandler) SetPesananDikirim(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	adminID := claims.UserID

	if err := c.UC.SetPesananDikirim(kode, adminID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (c *AdminHandler) SetPesananSelesai(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	adminID := claims.UserID

	if err := c.UC.SetPesananSelesai(kode, adminID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

// ==================== Kasir Handler ====================

type KasirHandler struct {
	UC *service.KasirService
}

func NewKasirHandler(uc *service.KasirService) *KasirHandler {
	return &KasirHandler{UC: uc}
}

func (c *KasirHandler) GetPesananMenungguVerifikasi(w http.ResponseWriter, r *http.Request) {
	data, err := c.UC.GetPesananMenungguVerifikasi()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func (c *KasirHandler) SetujuiPesanan(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	if err := c.UC.SetujuiPesanan(kode, kasirID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (c *KasirHandler) TolakPesanan(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	if err := c.UC.TolakPesanan(kode, kasirID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (c *KasirHandler) TolakPesananCustomer(w http.ResponseWriter, r *http.Request) {
	kode := httpctx.GetKodePesanan(r)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	kasirID := claims.UserID

	if err := c.UC.TolakPesananCustomer(kode, kasirID); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
}
