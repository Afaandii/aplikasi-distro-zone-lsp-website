package server

import (
	"net/http"
	"strings"

	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

func RegisterAdminReportRoutes(c *controller.ReportAdminController) {
	http.HandleFunc("/api/v1/admin/laporan-transaksi",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				c.GetAllTransaksi(w, r)
				return
			}
			w.WriteHeader(http.StatusMethodNotAllowed)
		}),
	)

	http.HandleFunc("/api/v1/admin/laporan-transaksi/detail/",
		func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodGet {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}

			parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
			if len(parts) < 5 {
				http.Error(w, "Not Found", http.StatusNotFound)
				return
			}

			c.GetDetailTransaksiByIDTransaksi(w, r)
		},
	)

	http.HandleFunc("/api/v1/admin/laporan-transaksi/",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				c.GetTransaksiByPeriode(w, r)
				return
			}
			w.WriteHeader(http.StatusMethodNotAllowed)
		}),
	)

	http.HandleFunc("/api/v1/admin/laporan-rugi-laba/",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			if r.Method == http.MethodGet {
				c.GetLaporanRugiLaba(w, r)
				return
			}
			w.WriteHeader(http.StatusMethodNotAllowed)
		}),
	)
}
