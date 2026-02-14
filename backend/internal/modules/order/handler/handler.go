package handler

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/order/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/order/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/internal/shared/response"
	helperPkg "aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"strings"
)

// ==================== Cart Handler ====================

type CartHandler struct{ svc service.CartService }

func NewCartHandler(svc service.CartService) *CartHandler { return &CartHandler{svc: svc} }

func (h *CartHandler) GetCartProducts(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	cart, items, err := h.svc.GetCartProducts(r.Context(), claims.UserID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get cart: %v", err), 500)
		return
	}

	responseItems := make([]map[string]interface{}, len(items))
	for i, item := range items {
		var namaWarna, namaUkuran, imageUrl string
		if item.WarnaRef != 0 && item.Warna.NamaWarna != "" {
			namaWarna = item.Warna.NamaWarna
		}
		if item.UkuranRef != 0 && item.Ukuran.NamaUkuran != "" {
			namaUkuran = item.Ukuran.NamaUkuran
		}
		found := false
		if len(item.Produk.FotoProduk) > 0 {
			for _, foto := range item.Produk.FotoProduk {
				if foto.WarnaRef == item.WarnaRef {
					imageUrl = foto.UrlFoto
					found = true
					break
				}
			}
		}
		if !found && len(item.Produk.FotoProduk) > 0 {
			imageUrl = item.Produk.FotoProduk[0].UrlFoto
		}
		responseItems[i] = map[string]interface{}{
			"id": item.IDCartItem, "cart_id": item.CartRef, "product_id": item.ProdukRef,
			"quantity": item.Quantity, "price": item.Price, "created_at": item.CreatedAt, "updated_at": item.UpdatedAt,
			"id_warna": item.Warna.IDWarna, "id_ukuran": item.Ukuran.IDUkuran, "warna": namaWarna, "ukuran": namaUkuran,
			"product": map[string]interface{}{"id": item.Produk.IDProduk, "product_name": item.Produk.NamaKaos, "image_url": imageUrl},
		}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "data": map[string]interface{}{"cart_id": cart.IDCart, "items": responseItems}})
}

func (h *CartHandler) UpdateQuantity(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	_ = claims
	var req struct {
		CartItemID int `json:"cart_item_id"`
		Quantity   int `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", 400)
		return
	}
	if req.Quantity < 1 {
		http.Error(w, "Quantity must be at least 1", 400)
		return
	}
	if err := h.svc.UpdateQuantity(r.Context(), req.CartItemID, req.Quantity); err != nil {
		http.Error(w, fmt.Sprintf("Failed to update quantity: %v", err), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "message": "Quantity updated successfully"})
}

func (h *CartHandler) RemoveItem(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	_ = claims
	var req struct {
		CartItemID int `json:"cart_item_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", 400)
		return
	}
	if err := h.svc.RemoveItem(r.Context(), req.CartItemID); err != nil {
		http.Error(w, fmt.Sprintf("Failed to remove item: %v", err), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "message": "Item removed from cart"})
}

func (h *CartHandler) RemoveAllItems(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	cart, _, err := h.svc.GetCartProducts(r.Context(), claims.UserID)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to get cart: %v", err), 500)
		return
	}
	if err := h.svc.RemoveAllItems(r.Context(), cart.IDCart); err != nil {
		http.Error(w, fmt.Sprintf("Failed to remove all items: %v", err), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "message": "All items removed from cart"})
}

func (h *CartHandler) AddItem(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	var req struct {
		ProductID int `json:"product_id"`
		Quantity  int `json:"quantity"`
		Price     int `json:"price"`
		WarnaID   int `json:"warna_id"`
		UkuranID  int `json:"ukuran_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON body", 400)
		return
	}
	if req.ProductID <= 0 || req.Quantity <= 0 || req.Price <= 0 {
		http.Error(w, "Invalid input data", 400)
		return
	}
	if err := h.svc.AddItem(r.Context(), claims.UserID, req.ProductID, req.Quantity, req.Price, req.WarnaID, req.UkuranID); err != nil {
		http.Error(w, fmt.Sprintf("Failed to add item: %v", err), 500)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	json.NewEncoder(w).Encode(map[string]interface{}{"status": "success", "message": "Item added to cart successfully"})
}

// ==================== Pesanan Handler ====================

type PesananHandler struct{ svc service.PesananService }

func NewPesananHandler(svc service.PesananService) *PesananHandler { return &PesananHandler{svc: svc} }

func (h *PesananHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	data, err := h.svc.GetAll()
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *PesananHandler) GetByID(w http.ResponseWriter, r *http.Request, id int) {
	data, err := h.svc.GetByID(id)
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "pesanan not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *PesananHandler) Create(w http.ResponseWriter, r *http.Request) {
	var p struct {
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
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.svc.Create(p.IDPemesan, p.DiverfikasiOleh, p.IDTarifPengiriman, strings.TrimSpace(p.KodePesanan), p.Subtotal, p.Berat, p.BiayaOngkir, p.TotalBayar, strings.TrimSpace(p.AlamatPengiriman), strings.TrimSpace(p.BuktiPembayaran), strings.TrimSpace(p.StatusPembayaran), strings.TrimSpace(p.StatusPesanan), strings.TrimSpace(p.MetodePembayaran))
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 201, data)
}

func (h *PesananHandler) Update(w http.ResponseWriter, r *http.Request, id int) {
	var p struct {
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
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "invalid payload"})
		return
	}
	data, err := h.svc.Update(id, p.IDPemesan, p.DiverfikasiOleh, p.IDTarifPengiriman, strings.TrimSpace(p.KodePesanan), p.Subtotal, p.Berat, p.BiayaOngkir, p.TotalBayar, strings.TrimSpace(p.AlamatPengiriman), strings.TrimSpace(p.BuktiPembayaran), strings.TrimSpace(p.StatusPembayaran), strings.TrimSpace(p.StatusPesanan), strings.TrimSpace(p.MetodePembayaran))
	if err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "pesanan not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, data)
}

func (h *PesananHandler) Delete(w http.ResponseWriter, r *http.Request, id int) {
	if err := h.svc.Delete(id); err != nil {
		var nf *helperPkg.NotFoundError
		if errors.As(err, &nf) {
			response.WriteJSON(w, 404, map[string]string{"error": "pesanan not found"})
			return
		}
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"message": "deleted successfully!"})
}

func (h *PesananHandler) GetMyPesanan(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	list, err := h.svc.GetByUser(claims.UserID)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	response.WriteJSON(w, 200, list)
}

func (h *PesananHandler) GetMyPesananDetail(w http.ResponseWriter, r *http.Request, id int) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	data, err := h.svc.GetDetailByUser(claims.UserID, id)
	if err != nil {
		http.Error(w, "pesanan not found", 404)
		return
	}
	response.WriteJSON(w, 200, data)
}

// ==================== Checkout Handler ====================

type CheckoutHandler struct{ svc *service.PembayaranService }

func NewCheckoutHandler(svc *service.PembayaranService) *CheckoutHandler {
	return &CheckoutHandler{svc: svc}
}

func (h *CheckoutHandler) Preview(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Alamat string                `json:"alamat_pengiriman"`
		Items  []service.ItemRequest `json:"items"`
	}
	json.NewDecoder(r.Body).Decode(&req)
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		http.Error(w, "Unauthorized", 401)
		return
	}
	subtotal, ongkir, total, err := h.svc.HitungCheckoutPreview(claims.UserID, req.Alamat, req.Items)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	json.NewEncoder(w).Encode(map[string]int{"subtotal": subtotal, "ongkir": ongkir, "total": total})
}

func (h *CheckoutHandler) Checkout(w http.ResponseWriter, r *http.Request) {
	var req struct {
		AlamatPengiriman string                `json:"alamat_pengiriman"`
		Items            []service.ItemRequest `json:"items"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteJSON(w, 400, map[string]string{"error": "payload tidak valid"})
		return
	}
	if len(req.Items) == 0 {
		response.WriteJSON(w, 400, map[string]string{"error": "item kosong"})
		return
	}
	claims, ok := r.Context().Value(middleware.UserContextKey).(jwt.Claims)
	if !ok {
		response.WriteJSON(w, 401, map[string]string{"error": "unauthorized"})
		return
	}
	snapToken, err := h.svc.CreatePembayaran(claims.UserID, req.AlamatPengiriman, req.Items)
	if err != nil {
		response.WriteJSON(w, 500, map[string]string{"error": err.Error()})
		return
	}
	response.WriteJSON(w, 200, map[string]string{"snap_token": snapToken})
}

// ==================== Midtrans Callback Handler ====================

type MidtransCallbackHandler struct {
	PesananRepo    repository.PesananRepository
	PembayaranRepo repository.PembayaranRepository
}

func NewMidtransCallbackHandler(pesananRepo repository.PesananRepository, pembayaranRepo repository.PembayaranRepository) *MidtransCallbackHandler {
	return &MidtransCallbackHandler{PesananRepo: pesananRepo, PembayaranRepo: pembayaranRepo}
}

func mapMetodePembayaran(notif map[string]interface{}) string {
	paymentType, ok := notif["payment_type"].(string)
	if !ok {
		return "UNKNOWN"
	}
	switch paymentType {
	case "bank_transfer":
		if vaNumbers, ok := notif["va_numbers"].([]interface{}); ok && len(vaNumbers) > 0 {
			if va, ok := vaNumbers[0].(map[string]interface{}); ok {
				if bank, ok := va["bank"].(string); ok {
					return strings.ToUpper(bank)
				}
			}
		}
		return "BANK_TRANSFER"
	case "gopay":
		return "GOPAY"
	case "qris":
		return "QRIS"
	case "shopeepay":
		return "SHOPEEPAY"
	case "dana":
		return "DANA"
	case "credit_card":
		return "CREDIT_CARD"
	default:
		return strings.ToUpper(paymentType)
	}
}

func (h *MidtransCallbackHandler) Handle(w http.ResponseWriter, r *http.Request) {
	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", 400)
		return
	}
	orderID := payload["order_id"].(string)
	statusCode := payload["status_code"].(string)
	grossAmount := payload["gross_amount"].(string)
	signatureKey := payload["signature_key"].(string)
	transactionStatus := payload["transaction_status"].(string)

	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	raw := orderID + statusCode + grossAmount + serverKey
	hash := sha512.Sum512([]byte(raw))
	if signatureKey != hex.EncodeToString(hash[:]) {
		http.Error(w, "invalid signature", 401)
		return
	}

	metode := mapMetodePembayaran(payload)
	statusPembayaran, statusPesanan := "pending", "menunggu_pembayaran"
	switch transactionStatus {
	case "capture", "settlement":
		statusPembayaran = "paid"
		statusPesanan = "menunggu_verifikasi_kasir"
	case "expire", "cancel", "deny":
		statusPembayaran = "failed"
		statusPesanan = "dibatalkan"
	default:
		w.WriteHeader(200)
		w.Write([]byte("OK"))
		return
	}

	if err := h.PesananRepo.UpdateStatusByKode(orderID, statusPembayaran, statusPesanan, metode); err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	transactionID, _ := payload["transaction_id"].(string)
	paymentType, _ := payload["payment_type"].(string)
	pdfURL, _ := payload["midtrans_pdf_url"].(string)
	vaNumber := ""
	if vaNumbers, ok := payload["va_numbers"].([]interface{}); ok && len(vaNumbers) > 0 {
		if va, ok := vaNumbers[0].(map[string]interface{}); ok {
			if num, ok := va["va_number"].(string); ok {
				vaNumber = num
			}
		}
	}
	grossInt := 0
	fmt.Sscan(grossAmount, &grossInt)
	pesanan, err := h.PesananRepo.FindByKode(orderID)
	if err != nil || pesanan == nil {
		http.Error(w, "pesanan tidak ditemukan", 404)
		return
	}
	existing, _ := h.PembayaranRepo.FindByMidtransOrderID(orderID)
	if existing.IDPembayaran == 0 {
		pembayaran := entity.Pembayaran{
			PesananRef: pesanan.IDPesanan, UserRef: pesanan.PemesanRef, MetodePembayaran: metode,
			MidtransOrderID: orderID, MidtransTransactionID: transactionID, MidtransTransactionStatus: transactionStatus,
			MidtransPaymentType: paymentType, MidtransGrossAmount: grossInt, MidtransVANumber: vaNumber,
			MidtransPDFURL: pdfURL, TotalMasuk: grossInt, Keuntungan: 0,
		}
		_ = h.PembayaranRepo.Create(&pembayaran)
	}
	w.WriteHeader(200)
	w.Write([]byte("OK"))
}
