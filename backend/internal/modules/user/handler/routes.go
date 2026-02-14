package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strconv"
	"strings"
)

func RegisterRoutes(userH *UserHandler, roleH *RoleHandler, adminH *AdminHandler, kasirH *KasirHandler) {

	// ==================== Auth Routes ====================

	http.HandleFunc("/api/v1/auth/login", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		userH.Login(w, r)
	})

	http.HandleFunc("/api/v1/auth/logout", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		userH.Logout(w, r)
	}))

	http.HandleFunc("/api/v1/auth/register", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		userH.Register(w, r)
	})

	// ==================== User Routes ====================

	http.HandleFunc("/api/v1/user", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			userH.GetAll(w, r)
		case http.MethodPost:
			userH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/user/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 4 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}
		idStr := parts[len(parts)-1]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			userH.GetByID(w, r, id)
		case http.MethodPut:
			userH.Update(w, r, id)
		case http.MethodDelete:
			userH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/v1/user/kasir", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		userH.GetCashiers(w, r)
	}))

	http.HandleFunc("/api/v1/user/address", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPut {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		userH.UpdateAddress(w, r)
	}))

	http.HandleFunc("/api/v1/user/transaksi",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodGet {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			userH.GetTransaksiByUser(w, r)
		}),
	)

	http.HandleFunc("/api/v1/user/pesanan",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodGet {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			userH.GetPesananByUser(w, r)
		}),
	)

	http.HandleFunc("/api/v1/user/search", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		userH.Search(w, r)
	}))

	// ==================== Role Routes ====================

	http.HandleFunc("/api/v1/role", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			roleH.GetAll(w, r)
		case http.MethodPost:
			roleH.Create(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/role/", func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 4 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}
		idStr := parts[len(parts)-1]
		id, err := strconv.Atoi(idStr)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		switch r.Method {
		case http.MethodGet:
			roleH.GetByID(w, r, id)
		case http.MethodPut:
			roleH.Update(w, r, id)
		case http.MethodDelete:
			roleH.Delete(w, r, id)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	// ==================== Admin Routes ====================

	http.HandleFunc("/api/v1/admin/pesanan/diproses",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				adminH.GetPesananProses(w, r)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	http.HandleFunc("/api/v1/admin/pesanan/dikemas",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				adminH.GetPesananDikemas(w, r)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	http.HandleFunc("/api/v1/admin/pesanan/dikirim",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				adminH.GetPesananDikirim(w, r)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	http.HandleFunc("/api/v1/admin/pesanan/",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

			if len(parts) < 6 {
				http.Error(w, "Not Found", http.StatusNotFound)
				return
			}

			aksi := parts[len(parts)-2]
			kodePesanan := parts[len(parts)-1]

			if kodePesanan == "" {
				http.Error(w, "Kode pesanan tidak valid", http.StatusBadRequest)
				return
			}

			switch r.Method {
			case http.MethodPut:
				ctx := httpctx.ContextWithKode(r, kodePesanan)

				switch aksi {
				case "dikemas":
					adminH.SetPesananDikemas(w, r.WithContext(ctx))

				case "dikirim":
					adminH.SetPesananDikirim(w, r.WithContext(ctx))

				case "selesai":
					adminH.SetPesananSelesai(w, r.WithContext(ctx))

				default:
					http.Error(w, "Not Found", http.StatusNotFound)
				}

			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	// ==================== Kasir Routes ====================

	http.HandleFunc("/api/v1/kasir/pesanan/verifikasi", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			kasirH.GetPesananMenungguVerifikasi(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	http.HandleFunc("/api/v1/kasir/pesanan/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

		if len(parts) < 6 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		aksi := parts[len(parts)-2]
		kodePesanan := parts[len(parts)-1]

		if kodePesanan == "" {
			http.Error(w, "Kode pesanan tidak valid", http.StatusBadRequest)
			return
		}

		switch r.Method {
		case http.MethodPut:
			switch aksi {
			case "setujui":
				kasirH.SetujuiPesanan(w, r.WithContext(
					httpctx.ContextWithKode(r, kodePesanan),
				))
			case "tolak":
				kasirH.TolakPesanan(w, r.WithContext(
					httpctx.ContextWithKode(r, kodePesanan),
				))
			default:
				http.Error(w, "Not Found", http.StatusNotFound)
			}

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))

	http.HandleFunc("/api/v1/customer/pesanan/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

		if len(parts) < 6 {
			http.Error(w, "Not Found", http.StatusNotFound)
			return
		}

		aksi := parts[len(parts)-2]
		kodePesanan := parts[len(parts)-1]

		if kodePesanan == "" {
			http.Error(w, "Kode pesanan tidak valid", http.StatusBadRequest)
			return
		}

		switch r.Method {
		case http.MethodPut:
			switch aksi {
			case "tolak":
				kasirH.TolakPesananCustomer(w, r.WithContext(
					httpctx.ContextWithKode(r, kodePesanan),
				))
			default:
				http.Error(w, "Not Found", http.StatusNotFound)
			}

		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	}))
}
