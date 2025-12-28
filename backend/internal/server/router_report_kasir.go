package server

import (
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strings"
)

func RegisterKasirReportRoutes(c *controller.ReportKasirController) {
	http.HandleFunc("/api/v1/kasir/laporan",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {

			if r.Method != http.MethodGet {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}

			c.FindLaporanByKasir(w, r)
		}),
	)

	// 📅 laporan kasir by periode
	http.HandleFunc("/api/v1/kasir/laporan/",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {

			if r.Method != http.MethodGet {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}
			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
			if len(parts) < 6 {
				http.Error(w, "Format tanggal tidak valid", http.StatusBadRequest)
				return
			}

			startDate := parts[len(parts)-2]
			endDate := parts[len(parts)-1]

			c.FindLaporanByKasirAndPeriode(w, r, startDate, endDate)
		}),
	)

	http.HandleFunc("/api/v1/kasir/laporan/detail/",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {

			if r.Method != http.MethodGet {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}

			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
			if len(parts) < 6 {
				http.Error(w, "Not Found", http.StatusNotFound)
				return
			}

			c.FindDetailLaporanByID(w, r)
		}),
	)
}
