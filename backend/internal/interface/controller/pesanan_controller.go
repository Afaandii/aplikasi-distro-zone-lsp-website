package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
)

type PesananController struct {
	UC usecase.PesananUsecase
}

func NewPesananController(uc usecase.PesananUsecase) *PesananController {
	return &PesananController{UC: uc}
}

func (pes *PesananController) GetAll(w http.ResponseWriter, r *http.Request) {
	merk, err := pes.UC.GetAll()
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, merk)
}

func (pes *PesananController) GetByID(w http.ResponseWriter, r *http.Request, idPesanan int) {
	pesanan, err := pes.UC.GetByID(idPesanan)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "pesanan not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, pesanan)
}

func (pes *PesananController) Create(w http.ResponseWriter, r *http.Request) {
	var payload struct {
		IDPemesan         int    `json:"id_pemesan"`
		DiverfikasiOleh   *int   `json:"diverifikasi_oleh"`
		IDTarifPengiriman int    `json:"id_tarif_pengiriman"`
		KodePesanan       string `json:"kode_pesanan"`
		Subtotal          int    `json:"subtotal"`
		Berat             int    `json:"berat"`
		BiayaOngkir       int    `json:"biaya_ongkir"`
		TotalBayar        int    `json:"total_bayar"`
		AlamatPengiriman  string `json:"alamat_pengiriman"`
		BuktiPembayaran   string `json:"bukti_pembayaran"`
		StatusPembayaran  string `json:"status_pembayaran"`
		StatusPesanan     string `json:"status_pesanan"`
		MetodePembayaran  string `json:"metode_pembayaran"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	created, err := pes.UC.Create(
		payload.IDPemesan,
		payload.DiverfikasiOleh,
		payload.IDTarifPengiriman,
		strings.TrimSpace(payload.KodePesanan),
		payload.Subtotal,
		payload.Berat,
		payload.BiayaOngkir,
		payload.TotalBayar,
		strings.TrimSpace(payload.AlamatPengiriman),
		strings.TrimSpace(payload.BuktiPembayaran),
		strings.TrimSpace(payload.StatusPembayaran),
		strings.TrimSpace(payload.StatusPesanan),
		strings.TrimSpace(payload.MetodePembayaran),
	)
	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusCreated, created)
}

func (pes *PesananController) Update(w http.ResponseWriter, r *http.Request, idPesanan int) {
	var payload struct {
		IDPemesan         int    `json:"id_pemesan"`
		DiverfikasiOleh   *int   `json:"diverifikasi_oleh"`
		IDTarifPengiriman int    `json:"id_tarif_pengiriman"`
		KodePesanan       string `json:"kode_pesanan"`
		Subtotal          int    `json:"subtotal"`
		Berat             int    `json:"berat"`
		BiayaOngkir       int    `json:"biaya_ongkir"`
		TotalBayar        int    `json:"total_bayar"`
		AlamatPengiriman  string `json:"alamat_pengiriman"`
		BuktiPembayaran   string `json:"bukti_pembayaran"`
		StatusPembayaran  string `json:"status_pembayaran"`
		StatusPesanan     string `json:"status_pesanan"`
		MetodePembayaran  string `json:"metode_pembayaran"`
	}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	updated, err := pes.UC.Update(
		idPesanan,
		payload.IDPemesan,
		payload.DiverfikasiOleh,
		payload.IDTarifPengiriman,
		strings.TrimSpace(payload.KodePesanan),
		payload.Subtotal,
		payload.Berat,
		payload.BiayaOngkir,
		payload.TotalBayar,
		strings.TrimSpace(payload.AlamatPengiriman),
		strings.TrimSpace(payload.BuktiPembayaran),
		strings.TrimSpace(payload.StatusPembayaran),
		strings.TrimSpace(payload.StatusPesanan),
		strings.TrimSpace(payload.MetodePembayaran),
	)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "pesanan not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, updated)
}

func (pes *PesananController) Delete(w http.ResponseWriter, r *http.Request, idPesanan int) {
	err := pes.UC.Delete(idPesanan)
	if err != nil {
		var notFoundErr *helperPkg.NotFoundError
		if errors.As(err, &notFoundErr) {
			helper.WriteJSON(w, http.StatusNotFound, map[string]string{"error": "pesanan not found"})
			return
		}
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	helper.WriteJSON(w, http.StatusOK, map[string]string{"message": "deleted successfully!"})
}

func (pes *PesananController) GetMyPesanan(w http.ResponseWriter, r *http.Request) {

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	list, err := pes.UC.GetByUser(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	helper.WriteJSON(w, http.StatusOK, list)
}

func (pes *PesananController) GetMyPesananDetail(
	w http.ResponseWriter,
	r *http.Request,
	idPesanan int,
) {

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	pesanan, err := pes.UC.GetDetailByUser(userID, idPesanan)
	if err != nil {
		http.Error(w, "pesanan not found", http.StatusNotFound)
		return
	}

	helper.WriteJSON(w, http.StatusOK, pesanan)
}
