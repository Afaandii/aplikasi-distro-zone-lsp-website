package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"math"
	"strings"

	"github.com/google/uuid"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

type PembayaranUsecase struct {
	PesananRepo repo.PesananRepository
	ProdukRepo  repo.ProdukRepository
	UserRepo    repo.UserRepository
	TarifRepo   repo.TarifPengirimanRepository
}

type ItemRequest struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Quantity int    `json:"quantity"`
}

func mapKotaKeWilayah(kota string) string {
	k := strings.ToLower(kota)

	switch k {
	case "jakarta", "jakarta timur", "jakarta barat", "jakarta selatan", "jakarta utara":
		return "Jakarta"
	case "depok", "bekasi":
		return "Jabodetabek"
	case "sidoarjo", "surabaya", "malang":
		return "Jawa Timur"
	case "semarang", "solo", "magelang":
		return "Jawa Tengah"
	default:
		return "Jawa Timur"
	}
}

func (u *PembayaranUsecase) CreatePembayaran(
	userID int,
	alamat string,
	items []ItemRequest,
) (string, error) {

	if len(items) == 0 {
		return "", errors.New("item tidak boleh kosong")
	}

	// 1. Ambil user
	user, err := u.UserRepo.FindByID(userID)
	if err != nil {
		return "", err
	}

	// 2. Hitung subtotal & total berat (GRAM)
	var subtotal int
	var totalBeratGram float64

	for _, item := range items {
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return "", err
		}

		// VALIDASI WAJIB
		if produk.Berat <= 0 {
			return "", errors.New("berat produk tidak valid")
		}

		subtotal += produk.HargaJual * item.Quantity
		totalBeratGram += produk.Berat * float64(item.Quantity)
	}

	// 3. Konversi gram → kg (WAJIB CEIL)
	totalBeratKg := int(math.Ceil(totalBeratGram / 1000))
	if totalBeratKg <= 0 {
		totalBeratKg = 1 // pengaman terakhir
	}

	// 4. Tentukan wilayah
	wilayah := mapKotaKeWilayah(strings.ToLower(user.Kota))

	// 5. Ambil tarif pengiriman
	tarif, err := u.TarifRepo.FindByWilayah(wilayah)
	if err != nil {
		return "", err
	}

	// 6. Hitung ongkir
	ongkir := totalBeratKg * tarif.HargaPerKg
	total := subtotal + ongkir

	// 7. Simpan pesanan
	pesanan := entities.Pesanan{
		PemesanRef:         userID,
		DiverifikasiRef:    2, // sementara
		TarifPengirimanRef: tarif.IDTarifPengiriman,
		KodePesanan:        "ORD-" + uuid.New().String(),
		Subtotal:           subtotal,
		Berat:              totalBeratKg, // 🔥 FIX PASTI MASUK
		BiayaOngkir:        ongkir,
		TotalBayar:         total,
		AlamatPengiriman:   alamat,
		StatusPembayaran:   "pending",
		StatusPesanan:      "menunggu_pembayaran",
	}

	if err := u.PesananRepo.Create(&pesanan); err != nil {
		return "", err
	}

	// 8. Midtrans Snap
	return u.createMidtransSnap(pesanan)
}

func (u *PembayaranUsecase) createMidtransSnap(p entities.Pesanan) (string, error) {
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  p.KodePesanan,
			GrossAmt: int64(p.TotalBayar),
		},
	}

	resp, err := snap.CreateTransaction(req)
	if err != nil {
		return "", err
	}

	return resp.Token, nil
}
