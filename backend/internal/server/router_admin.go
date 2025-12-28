package server

import (
	"net/http"
	"strings"

	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

func RegisterAdminRoutes(c *controller.AdminController) {
	http.HandleFunc("/api/v1/admin/pesanan/diproses",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				c.GetPesananProses(w, r)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	http.HandleFunc("/api/v1/admin/pesanan/dikemas",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				c.GetPesananDikemas(w, r)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	http.HandleFunc("/api/v1/admin/pesanan/dikirim",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
			switch r.Method {
			case http.MethodGet:
				c.GetPesananDikirim(w, r)
			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)

	http.HandleFunc("/api/v1/admin/pesanan/",
		middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {

			// contoh path:
			// /api/v1/admin/pesanan/dikemas/ORD-xxx
			// /api/v1/admin/pesanan/dikirim/ORD-xxx
			// /api/v1/admin/pesanan/selesai/ORD-xxx

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
					c.SetPesananDikemas(w, r.WithContext(ctx))

				case "dikirim":
					c.SetPesananDikirim(w, r.WithContext(ctx))

				case "selesai":
					c.SetPesananSelesai(w, r.WithContext(ctx))

				default:
					http.Error(w, "Not Found", http.StatusNotFound)
				}

			default:
				w.WriteHeader(http.StatusMethodNotAllowed)
			}
		}),
	)
}
