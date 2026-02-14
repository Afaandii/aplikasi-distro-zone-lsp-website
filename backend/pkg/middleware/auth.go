package middleware

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	jwtPkg "aplikasi-distro-zone-lsp-website/pkg/jwt"
	"context"
	"net/http"
	"strings"
)

// Buat key untuk context agar tidak bentrok
type contextKey string

const UserContextKey = contextKey("user")

// AuthMiddleware adalah middleware untuk memvalidasi JWT token
func AuthMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			response.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "Authorization header is required"})
			return
		}

		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		if tokenString == authHeader {
			response.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "Format header harus 'Bearer <token>'"})
			return
		}

		// --- PENGGUNAAN CLAIMS ---
		// ValidateToken akan mengembalikan struct claims yang sudah diisi
		claims, err := jwtPkg.ValidateToken(tokenString)
		if err != nil {
			response.WriteJSON(w, http.StatusUnauthorized, map[string]string{"error": "Invalid token: " + err.Error()})
			return
		}

		// Tambahkan info user ke context request agar bisa diakses di handler selanjutnya
		ctx := context.WithValue(r.Context(), UserContextKey, *claims)

		// Lanjut ke handler berikutnya dengan context yang sudah berisi data user
		next(w, r.WithContext(ctx))
	}
}
