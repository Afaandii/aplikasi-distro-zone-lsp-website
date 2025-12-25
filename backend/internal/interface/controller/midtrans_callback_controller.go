package controller

import (
	"crypto/sha512"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strings"

	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
)

type MidtransCallbackController struct {
	PesananRepo repo.PesananRepository
}

type MidtransNotification struct {
	OrderID           string `json:"order_id"`
	TransactionStatus string `json:"transaction_status"`
	PaymentType       string `json:"payment_type"`
	FraudStatus       string `json:"fraud_status"`
	StatusCode        string `json:"status_code"`
	GrossAmount       string `json:"gross_amount"`
	SignatureKey      string `json:"signature_key"`
}

func mapMetodePembayaran(notif map[string]interface{}) string {
	paymentType, ok := notif["payment_type"].(string)
	if !ok {
		return "UNKNOWN"
	}

	switch paymentType {

	case "bank_transfer":
		// 🔥 ambil dari va_numbers
		if vaNumbers, ok := notif["va_numbers"].([]interface{}); ok && len(vaNumbers) > 0 {
			if va, ok := vaNumbers[0].(map[string]interface{}); ok {
				if bank, ok := va["bank"].(string); ok {
					return strings.ToUpper(bank) // BCA / BNI / BRI
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

func (c *MidtransCallbackController) Handle(w http.ResponseWriter, r *http.Request) {
	log.Println("MIDTRANS CALLBACK MASUK")
	var payload map[string]interface{}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "invalid payload", http.StatusBadRequest)
		return
	}

	// --- Ambil field wajib ---
	orderID := payload["order_id"].(string)
	statusCode := payload["status_code"].(string)
	grossAmount := payload["gross_amount"].(string)
	signatureKey := payload["signature_key"].(string)
	transactionStatus := payload["transaction_status"].(string)

	// 🔐 Verifikasi signature Midtrans
	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	raw := orderID + statusCode + grossAmount + serverKey

	hash := sha512.Sum512([]byte(raw))
	expectedSignature := hex.EncodeToString(hash[:])

	if signatureKey != expectedSignature {
		http.Error(w, "invalid signature", http.StatusUnauthorized)
		return
	}

	// 💳 Ambil metode pembayaran (INI PENTING)
	metode := mapMetodePembayaran(payload)

	// 🔄 Tentukan status
	statusPembayaran := "pending"
	statusPesanan := "menunggu_pembayaran"

	switch transactionStatus {
	case "capture", "settlement":
		statusPembayaran = "paid"
		statusPesanan = "diproses"

	case "expire", "cancel", "deny":
		statusPembayaran = "failed"
		statusPesanan = "dibatalkan"
	}

	// ✅ UPDATE PESANAN
	err := c.PesananRepo.UpdateStatusByKode(
		orderID,
		statusPembayaran,
		statusPesanan,
		metode,
	)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("OK"))
}
