package server

import (
	"aplikasi-distro-zone-lsp-website/internal/httpctx"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"net/http"
	"strings"
)

func RegisterKasirRoutes(c *controller.KasirController) {

	// GET daftar pesanan menunggu verifikasi kasir
	http.HandleFunc("/api/v1/kasir/pesanan/verifikasi", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			c.GetPesananMenungguVerifikasi(w, r)
		default:
			w.WriteHeader(http.StatusMethodNotAllowed)
		}
	})

	// APPROVE / REJECT pesanan
	http.HandleFunc("/api/v1/kasir/pesanan/", middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {

		// contoh path:
		// /api/v1/kasir/pesanan/setujui/ORD-xxx
		// /api/v1/kasir/pesanan/tolak/ORD-xxx

		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

		// minimal: api v1 kasir pesanan {aksi} {kode}
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
				c.SetujuiPesanan(w, r.WithContext(
					httpctx.ContextWithKode(r, kodePesanan),
				))
			case "tolak":
				c.TolakPesanan(w, r.WithContext(
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

		// contoh path:
		// /api/v1/kasir/pesanan/setujui/ORD-xxx
		// /api/v1/kasir/pesanan/tolak/ORD-xxx

		parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")

		// minimal: api v1 kasir pesanan {aksi} {kode}
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
				c.TolakPesananCustomer(w, r.WithContext(
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
