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
	PesananRepo    repo.PesananRepository
	PembayaranRepo repo.PembayaranRepository
	DetailPesanan  repo.DetailPesananRepository
	ProdukRepo     repo.ProdukRepository
	UserRepo       repo.UserRepository
	TarifRepo      repo.TarifPengirimanRepository
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

func (u *PembayaranUsecase) HitungCheckoutPreview(
	userID int,
	alamat string,
	items []ItemRequest,
) (int, int, int, error) {

	user, err := u.UserRepo.FindByID(userID)
	if err != nil {
		return 0, 0, 0, err
	}

	var subtotal int
	var totalQty int

	for _, item := range items {
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return 0, 0, 0, err
		}

		subtotal += produk.HargaJual * item.Quantity
		totalQty += item.Quantity
	}

	// aturan LSP
	beratKg := int(math.Ceil(float64(totalQty) / 3))

	wilayah := mapKotaKeWilayah(strings.ToLower(user.Kota))

	tarif, err := u.TarifRepo.FindByWilayah(wilayah)
	if err != nil {
		return 0, 0, 0, err
	}

	ongkir := beratKg * tarif.HargaPerKg
	total := subtotal + ongkir

	return subtotal, ongkir, total, nil
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

	// 2. Hitung subtotal & jumlah kaos
	var subtotal int
	var totalQty int

	for _, item := range items {
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return "", err
		}

		subtotal += produk.HargaJual * item.Quantity
		totalQty += item.Quantity
	}

	// 3. Hitung berat ongkir
	// 1 kg = 3 kaos
	totalBeratKg := int(math.Ceil(float64(totalQty) / 3))

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
		DiverifikasiRef:    nil,
		TarifPengirimanRef: tarif.IDTarifPengiriman,
		KodePesanan:        "ORD-" + uuid.New().String(),
		Subtotal:           subtotal,
		Berat:              totalBeratKg,
		BiayaOngkir:        ongkir,
		TotalBayar:         total,
		AlamatPengiriman:   alamat,
		StatusPembayaran:   "pending",
		StatusPesanan:      "menunggu_pembayaran",
	}

	if err := u.PesananRepo.Create(&pesanan); err != nil {
		return "", err
	}

	// 8. Simpan detail pesanan
	for _, item := range items {
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return "", err
		}

		detail := entities.DetailPesanan{
			PesananRef:  pesanan.IDPesanan,
			ProdukRef:   produk.IDProduk,
			Jumlah:      item.Quantity,
			HargaSatuan: produk.HargaJual,
			Total:       produk.HargaJual * item.Quantity,
		}

		if err := u.DetailPesanan.Create(&detail); err != nil {
			return "", err
		}
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
