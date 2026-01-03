package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"
	"math"
	"strconv"
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
	VarianRepo     repo.VarianRepository
}

type ItemRequest struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Quantity int    `json:"quantity"`
	WarnaID  int    `json:"warna_id"`
	UkuranID int    `json:"ukuran_id"`
}

func mapKotaKeWilayah(kota string) string {
	k := strings.ToLower(strings.TrimSpace(kota))

	// Jakarta
	if k == "jakarta" ||
		k == "jakarta pusat" ||
		k == "jakarta utara" ||
		k == "jakarta selatan" ||
		k == "jakarta barat" ||
		k == "jakarta timur" {
		return "Jakarta"
	}

	// Depok
	if k == "depok" {
		return "Depok"
	}

	// Bekasi
	if k == "bekasi" || k == "kota bekasi" {
		return "Bekasi"
	}

	// Tangerang
	if k == "tangerang" || k == "kota tangerang" || k == "tangerang kota" {
		return "Tangerang"
	}

	// Bogor
	if k == "bogor" || k == "kota bogor" {
		return "Bogor"
	}

	// Jawa Barat
	jabar := []string{
		"bandung", "cimahi", "cirebon", "sukabumi", "tasikmalaya",
		"garut", "majalengka", "sumedang", "indramayu", "subang",
		"purwakarta", "karawang", "cianjur", "kuningan", "banjar", "seluruh wilayah jawa barat",
	}
	for _, kotaJabar := range jabar {
		if k == kotaJabar {
			return "Seluruh Wilayah Jawa Barat"
		}
	}

	// Jawa Tengah
	jateng := []string{
		"semarang", "solo", "surakarta", "magelang", "pekalongan",
		"tegal", "salatiga", "banyumas", "kebumen", "wonosobo",
		"purworejo", "klaten", "sragen", "karanganyar", "boyolali",
		"grobogan", "demak", "rembang", "pati", "kudus", "jepara",
		"blora", "purwodadi", "cilacap", "banyumas", "purbalingga", "seluruh wilayah jawa tengah",
	}
	for _, kotaJateng := range jateng {
		if k == kotaJateng {
			return "Seluruh Wilayah Jawa Tengah"
		}
	}

	jatim := []string{
		"surabaya", "malang", "sidoarjo", "gresik", "mojokerto",
		"jombang", "kediri", "madiun", "blitar", "tulungagung",
		"banyuwangi", "probolinggo", "pasuruan", "lumajang", "jember",
		"situbondo", "bondowoso", "pamekasan", "sumenep", "sampang",
		"bangkalan", "batu", "nganjuk", "bojonegoro", "lamongan", "seluruh wilayah jawa timur",
	}
	for _, kotaJatim := range jatim {
		if k == kotaJatim {
			return "Seluruh Wilayah Jawa Timur"
		}
	}

	return ""
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

	// Validasi: Jika kota kosong, ongkir = 0
	if user.Kota == "" || strings.TrimSpace(user.Kota) == "" {
		var subtotal int
		for _, item := range items {
			produk, err := u.ProdukRepo.FindByID(item.ID)
			if err != nil {
				return 0, 0, 0, err
			}
			subtotal += produk.HargaJual * item.Quantity
		}
		return subtotal, 0, subtotal, nil
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

	// 3 kaos = 1 kg, dibulatkan ke atas
	totalKaos := 0
	for _, item := range items {
		totalKaos += item.Quantity
	}
	beratKg := int(math.Ceil(float64(totalKaos) / 3.0))

	wilayah := user.Kota
	if wilayah == "" {
		return 0, 0, 0, errors.New("wilayah tidak dikenali")
	}

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

	if user.Kota == "" || strings.TrimSpace(user.Kota) == "" {
		return "", errors.New("alamat pengiriman belum lengkap, silakan tambahkan kota")
	}

	// 2. Hitung subtotal & total berat
	var subtotal int
	for _, item := range items {
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return "", err
		}
		subtotal += produk.HargaJual * item.Quantity
	}

	// 3 kaos = 1 kg
	totalKaos := 0
	for _, item := range items {
		totalKaos += item.Quantity
	}
	beratKg := int(math.Ceil(float64(totalKaos) / 3.0))

	// 4. Tentukan wilayah
	// wilayah := mapKotaKeWilayah(strings.ToLower(user.Kota))
	wilayah := user.Kota
	if wilayah == "" {
		return "", errors.New("wilayah tidak dikenali")
	}

	// 5. Ambil tarif pengiriman
	tarif, err := u.TarifRepo.FindByWilayah(wilayah)
	if err != nil {
		return "", err
	}

	// 6. Hitung ongkir
	ongkir := beratKg * tarif.HargaPerKg
	total := subtotal + ongkir

	// 7. Simpan pesanan
	pesanan := entities.Pesanan{
		PemesanRef:         userID,
		DiverifikasiRef:    nil,
		TarifPengirimanRef: tarif.IDTarifPengiriman,
		KodePesanan:        "ORD-" + uuid.New().String(),
		Subtotal:           subtotal,
		Berat:              beratKg,
		BiayaOngkir:        ongkir,
		TotalBayar:         total,
		AlamatPengiriman:   alamat,
		StatusPembayaran:   "pending",
		StatusPesanan:      "menunggu_pembayaran",
	}

	if err := u.PesananRepo.Create(&pesanan); err != nil {
		return "", err
	}

	// 8. Simpan detail pesanan & kurangi stok varian
	for _, item := range items {
		if item.WarnaID == 0 || item.UkuranID == 0 {
			return "", errors.New("warna_id dan ukuran_id wajib diisi untuk setiap item")
		}

		// Ambil produk
		produk, err := u.ProdukRepo.FindByID(item.ID)
		if err != nil {
			return "", err
		}

		// Cari varian spesifik
		varian, err := u.VarianRepo.FindByProdukWarnaUkuran(item.ID, item.WarnaID, item.UkuranID)
		if err != nil {
			return "", err
		}
		if varian == nil {
			return "", errors.New("varian tidak ditemukan untuk produk ID=" + strconv.Itoa(item.ID))
		}

		// Validasi stok
		if varian.StokKaos < item.Quantity {
			return "", errors.New("stok tidak mencukupi untuk " + produk.NamaKaos)
		}

		// Kurangi stok
		varian.StokKaos -= item.Quantity
		if err := u.VarianRepo.Update(varian); err != nil {
			return "", err
		}

		// Simpan detail pesanan
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

	// 9. Midtrans Snap
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
