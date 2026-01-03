package controller

import (
	"encoding/json"
	"net/http"

	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

type CheckoutController struct {
	PembayaranUC *usecase.PembayaranUsecase
}

type CheckoutRequest struct {
	UserID int                   `json:"user_id"`
	Alamat string                `json:"alamat_pengiriman"`
	Items  []usecase.ItemRequest `json:"items"`
}

type CheckoutResponse struct {
	SnapToken string `json:"snap_token"`
}

func mapItems(reqItems []struct {
	ID       int
	Quantity int
}) []usecase.ItemRequest {

	items := make([]usecase.ItemRequest, 0)

	for _, i := range reqItems {
		items = append(items, usecase.ItemRequest{
			ID:       i.ID,
			Quantity: i.Quantity,
		})
	}

	return items
}

func (c *CheckoutController) Preview(w http.ResponseWriter, r *http.Request) {
	var req CheckoutRequest
	json.NewDecoder(r.Body).Decode(&req)

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	userID := claims.UserID

	subtotal, ongkir, total, err :=
		c.PembayaranUC.HitungCheckoutPreview(userID, req.Alamat, req.Items)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	json.NewEncoder(w).Encode(map[string]int{
		"subtotal": subtotal,
		"ongkir":   ongkir,
		"total":    total,
	})
}

func (c *CheckoutController) Checkout(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AlamatPengiriman string                `json:"alamat_pengiriman"`
		Items            []usecase.ItemRequest `json:"items"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "payload tidak valid",
		})
		return
	}

	if len(req.Items) == 0 {
		helper.WriteJSON(w, http.StatusBadRequest, map[string]string{
			"error": "item kosong",
		})
		return
	}

	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		helper.WriteJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "unauthorized",
		})
		return
	}

	items := make([]usecase.ItemRequest, 0)
	for _, i := range req.Items {
		items = append(items, usecase.ItemRequest{
			ID:       i.ID,
			Quantity: i.Quantity,
		})
	}

	snapToken, err := c.PembayaranUC.CreatePembayaran(
		claims.UserID,
		req.AlamatPengiriman,
		req.Items,
	)

	if err != nil {
		helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
		return
	}

	helper.WriteJSON(w, http.StatusOK, map[string]string{
		"snap_token": snapToken,
	})
}
