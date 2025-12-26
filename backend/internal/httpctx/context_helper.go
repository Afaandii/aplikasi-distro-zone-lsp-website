package httpctx

import (
	"context"
	"net/http"
)

type ContextKey string

const KodePesananKey ContextKey = "kode_pesanan"

func ContextWithKode(r *http.Request, kode string) context.Context {
	return context.WithValue(r.Context(), KodePesananKey, kode)
}

func GetKodePesanan(r *http.Request) string {
	if v := r.Context().Value(KodePesananKey); v != nil {
		return v.(string)
	}
	return ""
}
