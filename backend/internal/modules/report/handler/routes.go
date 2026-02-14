package handler

import (
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strings"
)

func RegisterRoutes(adminH *ReportAdminHandler, kasirH *ReportKasirHandler) {
	// ==================== Admin Report ====================
	http.HandleFunc("/api/v1/admin/laporan-transaksi", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			adminH.GetAllTransaksi(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	http.HandleFunc("/api/v1/admin/laporan-transaksi/detail/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
		if len(parts) < 5 {
			http.Error(w, "Not Found", 404)
			return
		}
		adminH.GetDetailTransaksiByIDTransaksi(w, r)
	})

	http.HandleFunc("/api/v1/admin/laporan-transaksi/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			adminH.GetTransaksiByPeriode(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	http.HandleFunc("/api/v1/admin/laporan-rugi-laba/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			adminH.GetLaporanRugiLaba(w, r)
			return
		}
		w.WriteHeader(http.StatusMethodNotAllowed)
	}))

	// ==================== Kasir Report ====================
	http.HandleFunc("/api/v1/kasir/laporan", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		kasirH.FindLaporanByKasir(w, r)
	}))

	http.HandleFunc("/api/v1/kasir/laporan/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

		// Check if it's detail endpoint: /api/v1/kasir/laporan/detail/{id}
		if len(parts) >= 5 && parts[4] == "detail" {
			if len(parts) < 6 {
				http.Error(w, "Not Found", 404)
				return
			}
			kasirH.FindDetailLaporanByID(w, r)
			return
		}

		// Otherwise it's periode: /api/v1/kasir/laporan/{start}/{end}
		if len(parts) < 6 {
			http.Error(w, "Format tanggal tidak valid", 400)
			return
		}
		startDate := parts[len(parts)-2]
		endDate := parts[len(parts)-1]
		kasirH.FindLaporanByKasirAndPeriode(w, r, startDate, endDate)
	}))
}
