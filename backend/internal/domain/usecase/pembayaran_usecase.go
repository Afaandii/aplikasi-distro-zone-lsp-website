package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
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

	// 1. Ambil user (alamat & kota)
	user, err := u.UserRepo.FindByID(userID)
	if err != nil {
		return "", err
	}

	// 2. Hitung subtotal & berat
	var subtotal int
	var totalBerat float64

	for _, item := range items {
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return "", err
		}

		subtotal += produk.HargaJual * item.Quantity
		totalBerat += produk.Berat * float64(item.Quantity)
	}

	// 3. Tentukan wilayah dari kota user
	wilayah := mapKotaKeWilayah(user.Kota)

	// 4. Ambil tarif dari DB
	tarif, err := u.TarifRepo.FindByWilayah(wilayah)
	if err != nil {
		return "", err
	}

	// 5. Hitung ongkir dinamis
	ongkir := int(totalBerat * float64(tarif.HargaPerKg))
	total := subtotal + ongkir

	// 6. Simpan pesanan (BENAR)
	pesanan := entities.Pesanan{
		PemesanRef:         userID,
		DiverifikasiRef:    2,
		TarifPengirimanRef: tarif.IDTarifPengiriman,
		KodePesanan:        "ORD-" + uuid.New().String(),
		Subtotal:           subtotal,
		Berat:              int(totalBerat),
		BiayaOngkir:        ongkir,
		TotalBayar:         total,
		AlamatPengiriman:   alamat,
		StatusPembayaran:   "pending",
		StatusPesanan:      "menunggu_pembayaran",
	}

	if err := u.PesananRepo.Create(&pesanan); err != nil {
		return "", err
	}

	// 7. Midtrans Snap
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
