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

func ContextWithParam(r *http.Request, key string, val string) context.Context {
	return context.WithValue(r.Context(), ContextKey(key), val)
}

func GetParam(r *http.Request, key string) string {
	if v := r.Context().Value(ContextKey(key)); v != nil {
		return v.(string)
	}
	return ""
}
