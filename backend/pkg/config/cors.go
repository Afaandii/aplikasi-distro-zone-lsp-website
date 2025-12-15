package config

import (
	"net/http"
)

func CorsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set header untuk mengizinkan origin dari frontend
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")

		// Set header untuk mengizinkan metode HTTP tertentu
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Set header untuk mengizinkan header tertentu dalam request
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Tangani preflight request (OPTIONS)
		// Browser akan mengirimkan request OPTIONS sebelum request sebenarnya
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Lanjutkan ke handler berikutnya jika bukan request OPTIONS
		next.ServeHTTP(w, r)
	})
}
