package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/order/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"context"
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"

	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

// ==================== Cart Service ====================

type CartService interface {
	GetCartProducts(ctx context.Context, userID int) (*entity.Cart, []entity.CartItem, error)
	UpdateQuantity(ctx context.Context, cartItemID, quantity int) error
	RemoveItem(ctx context.Context, cartItemID int) error
	RemoveAllItems(ctx context.Context, cartID int) error
	AddItem(ctx context.Context, userID, productID, quantity, price, warnaID, ukuranID int) error
}

type cartService struct{ repo repository.CartRepository }

func NewCartService(r repository.CartRepository) CartService { return &cartService{repo: r} }

func (s *cartService) GetCartProducts(ctx context.Context, userID int) (*entity.Cart, []entity.CartItem, error) {
	cart, err := s.repo.GetActiveCartByUserID(ctx, userID)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get cart: %w", err)
	}
	if cart == nil {
		newCart := &entity.Cart{UserRef: userID, Status: "active"}
		if err := s.repo.CreateCart(ctx, newCart); err != nil {
			return nil, nil, fmt.Errorf("failed to create cart: %w", err)
		}
		cart = newCart
	}
	items, err := s.repo.GetCartItemsByCartID(ctx, cart.IDCart)
	if err != nil {
		return nil, nil, fmt.Errorf("failed to get cart items: %w", err)
	}
	return cart, items, nil
}

func (s *cartService) UpdateQuantity(ctx context.Context, cartItemID, quantity int) error {
	if quantity < 1 {
		return errors.New("quantity must be at least 1")
	}
	item, err := s.repo.GetCartItemByID(ctx, cartItemID)
	if err != nil {
		return fmt.Errorf("failed to find cart item: %w", err)
	}
	item.Quantity = quantity
	if err := s.repo.UpdateCartItem(ctx, item); err != nil {
		return fmt.Errorf("failed to update cart item: %w", err)
	}
	return nil
}

func (s *cartService) RemoveItem(ctx context.Context, cartItemID int) error {
	return s.repo.DeleteCartItem(ctx, cartItemID)
}

func (s *cartService) RemoveAllItems(ctx context.Context, cartID int) error {
	return s.repo.DeleteAllCartItems(ctx, cartID)
}

func (s *cartService) AddItem(ctx context.Context, userID, productID, quantity, price, warnaID, ukuranID int) error {
	cart, err := s.repo.GetActiveCartByUserID(ctx, userID)
	if err != nil {
		return fmt.Errorf("failed to get cart: %w", err)
	}
	if cart == nil {
		newCart := &entity.Cart{UserRef: userID, Status: "active"}
		if err := s.repo.CreateCart(ctx, newCart); err != nil {
			return fmt.Errorf("failed to create cart: %w", err)
		}
		cart = newCart
	}
	newItem := &entity.CartItem{CartRef: cart.IDCart, ProdukRef: productID, Quantity: quantity, Price: price, WarnaRef: warnaID, UkuranRef: ukuranID}
	return s.repo.CreateCartItem(ctx, newItem)
}

// ==================== Pesanan Service ====================

type PesananService interface {
	GetAll() ([]entity.Pesanan, error)
	GetByID(id int) (*entity.Pesanan, error)
	Create(idPemesan int, diverifikasiOleh *int, idTarifPengiriman int, kodePesanan string, subtotal, berat, biayaOngkir, totalBayar int, alamatPengiriman, buktiPembayaran, statusPembayaran, statusPesanan, metodePembayaran string) (*entity.Pesanan, error)
	Update(idPesanan, idPemesan int, diverifikasiOleh *int, idTarifPengiriman int, kodePesanan string, subtotal, berat, biayaOngkir, totalBayar int, alamatPengiriman, buktiPembayaran, statusPembayaran, statusPesanan, metodePembayaran string) (*entity.Pesanan, error)
	Delete(id int) error
	GetByUser(userID int) ([]entity.Pesanan, error)
	GetDetailByUser(userID, pesananID int) (*entity.Pesanan, error)
	AutoCancelExpiredOrders() (int64, error)
}

type pesananService struct{ repo repository.PesananRepository }

func NewPesananService(r repository.PesananRepository) PesananService {
	return &pesananService{repo: r}
}

func (s *pesananService) GetAll() ([]entity.Pesanan, error) { return s.repo.FindAll() }
func (s *pesananService) GetByUser(userID int) ([]entity.Pesanan, error) {
	return s.repo.FindByUserID(userID)
}
func (s *pesananService) AutoCancelExpiredOrders() (int64, error) {
	return s.repo.AutoCancelExpiredOrders()
}

func (s *pesananService) GetByID(id int) (*entity.Pesanan, error) {
	ps, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if ps == nil {
		return nil, helper.PesananNotFoundError(id)
	}
	return ps, nil
}

func (s *pesananService) Create(idPemesan int, diverifikasiOleh *int, idTarifPengiriman int, kodePesanan string, subtotal, berat, biayaOngkir, totalBayar int, alamatPengiriman, buktiPembayaran, statusPembayaran, statusPesanan, metodePembayaran string) (*entity.Pesanan, error) {
	m := &entity.Pesanan{
		PemesanRef: idPemesan, DiverifikasiRef: diverifikasiOleh, TarifPengirimanRef: idTarifPengiriman,
		KodePesanan: kodePesanan, Subtotal: subtotal, Berat: berat, BiayaOngkir: biayaOngkir,
		TotalBayar: totalBayar, AlamatPengiriman: alamatPengiriman, BuktiPembayaran: buktiPembayaran,
		StatusPembayaran: statusPembayaran, StatusPesanan: statusPesanan, MetodePembayaran: metodePembayaran,
	}
	if err := s.repo.Create(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (s *pesananService) Update(idPesanan, idPemesan int, diverifikasiOleh *int, idTarifPengiriman int, kodePesanan string, subtotal, berat, biayaOngkir, totalBayar int, alamatPengiriman, buktiPembayaran, statusPembayaran, statusPesanan, metodePembayaran string) (*entity.Pesanan, error) {
	existing, err := s.repo.FindByID(idPesanan)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.PesananNotFoundError(idPesanan)
	}
	existing.PemesanRef = idPemesan
	existing.DiverifikasiRef = diverifikasiOleh
	existing.TarifPengirimanRef = idTarifPengiriman
	existing.KodePesanan = kodePesanan
	existing.Subtotal = subtotal
	existing.Berat = berat
	existing.BiayaOngkir = biayaOngkir
	existing.TotalBayar = totalBayar
	existing.AlamatPengiriman = alamatPengiriman
	existing.BuktiPembayaran = buktiPembayaran
	existing.StatusPembayaran = statusPembayaran
	existing.StatusPesanan = statusPesanan
	existing.MetodePembayaran = metodePembayaran
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *pesananService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.PesananNotFoundError(id)
	}
	return s.repo.Delete(id)
}

func (s *pesananService) GetDetailByUser(userID, pesananID int) (*entity.Pesanan, error) {
	pesanan, err := s.repo.FindDetailByUserAndPesananID(userID, pesananID)
	if err != nil {
		return nil, err
	}
	if pesanan == nil {
		return nil, helper.PesananNotFoundError(pesananID)
	}
	return pesanan, nil
}

// ==================== Pembayaran (Checkout) Service ====================

// ItemRequest is the checkout item request payload
type ItemRequest struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Quantity int    `json:"quantity"`
	WarnaID  int    `json:"warna_id"`
	UkuranID int    `json:"ukuran_id"`
}

// PembayaranService handles checkout with Midtrans integration
// It requires cross-module dependencies injected via interfaces
type PembayaranService struct {
	PesananRepo    repository.PesananRepository
	PembayaranRepo repository.PembayaranRepository
	DetailPesanan  repository.DetailPesananRepository
	// Cross-module dependencies (injected from other modules)
	ProdukFinder        ProdukFinder
	UserFinder          UserFinder
	TarifFinder         TarifFinder
	VarianFinderUpdater VarianFinderUpdater
}

// Cross-module interfaces (to avoid circular imports)
type ProdukFinder interface {
	FindByID(id int) (*entity.Produk, error)
}

type UserFinder interface {
	FindByID(id int) (*entity.User, error)
}

type TarifFinder interface {
	FindByWilayah(wilayah string) (*entity.TarifPengiriman, error)
}

type VarianFinderUpdater interface {
	FindByProdukWarnaUkuran(produkID, warnaID, ukuranID int) (*entity.Varian, error)
	Update(v *entity.Varian) error
}

func mapKotaKeWilayah(kota string) string {
	k := strings.ToLower(strings.TrimSpace(kota))
	if k == "jakarta" || k == "jakarta pusat" || k == "jakarta utara" || k == "jakarta selatan" || k == "jakarta barat" || k == "jakarta timur" {
		return "Jakarta"
	}
	if k == "depok" {
		return "Depok"
	}
	if k == "bekasi" || k == "kota bekasi" {
		return "Bekasi"
	}
	if k == "tangerang" || k == "kota tangerang" || k == "tangerang kota" {
		return "Tangerang"
	}
	if k == "bogor" || k == "kota bogor" {
		return "Bogor"
	}
	jabar := []string{"bandung", "cimahi", "cirebon", "sukabumi", "tasikmalaya", "garut", "majalengka", "sumedang", "indramayu", "subang", "purwakarta", "karawang", "cianjur", "kuningan", "banjar", "seluruh wilayah jawa barat"}
	for _, v := range jabar {
		if k == v {
			return "Seluruh Wilayah Jawa Barat"
		}
	}
	jateng := []string{"semarang", "solo", "surakarta", "magelang", "pekalongan", "tegal", "salatiga", "banyumas", "kebumen", "wonosobo", "purworejo", "klaten", "sragen", "karanganyar", "boyolali", "grobogan", "demak", "rembang", "pati", "kudus", "jepara", "blora", "purwodadi", "cilacap", "purbalingga", "seluruh wilayah jawa tengah"}
	for _, v := range jateng {
		if k == v {
			return "Seluruh Wilayah Jawa Tengah"
		}
	}
	jatim := []string{"surabaya", "malang", "sidoarjo", "gresik", "mojokerto", "jombang", "kediri", "madiun", "blitar", "tulungagung", "banyuwangi", "probolinggo", "pasuruan", "lumajang", "jember", "situbondo", "bondowoso", "pamekasan", "sumenep", "sampang", "bangkalan", "batu", "nganjuk", "bojonegoro", "lamongan", "seluruh wilayah jawa timur"}
	for _, v := range jatim {
		if k == v {
			return "Seluruh Wilayah Jawa Timur"
		}
	}
	return ""
}

func (u *PembayaranService) HitungCheckoutPreview(userID int, alamat string, items []ItemRequest) (int, int, int, error) {
	user, err := u.UserFinder.FindByID(userID)
	if err != nil {
		return 0, 0, 0, err
	}
	if user.Kota == "" || strings.TrimSpace(user.Kota) == "" {
		var subtotal int
		for _, item := range items {
			produk, err := u.ProdukFinder.FindByID(item.ID)
			if err != nil {
				return 0, 0, 0, err
			}
			subtotal += produk.HargaJual * item.Quantity
		}
		return subtotal, 0, subtotal, nil
	}
	var subtotal int
	for _, item := range items {
		produk, err := u.ProdukFinder.FindByID(item.ID)
		if err != nil {
			return 0, 0, 0, err
		}
		subtotal += produk.HargaJual * item.Quantity
	}
	totalKaos := 0
	for _, item := range items {
		totalKaos += item.Quantity
	}
	beratKg := int(math.Ceil(float64(totalKaos) / 3.0))
	wilayah := mapKotaKeWilayah(user.Kota)
	if wilayah == "" {
		return 0, 0, 0, errors.New("wilayah tidak dikenali")
	}
	tarif, err := u.TarifFinder.FindByWilayah(wilayah)
	if err != nil {
		return 0, 0, 0, err
	}
	ongkir := beratKg * tarif.HargaPerKg
	return subtotal, ongkir, subtotal + ongkir, nil
}

func (u *PembayaranService) CreatePembayaran(userID int, alamat string, items []ItemRequest) (string, error) {
	if len(items) == 0 {
		return "", errors.New("item tidak boleh kosong")
	}
	user, err := u.UserFinder.FindByID(userID)
	if err != nil {
		return "", err
	}
	if user.Kota == "" || strings.TrimSpace(user.Kota) == "" {
		return "", errors.New("alamat pengiriman belum lengkap, silakan tambahkan kota")
	}
	var subtotal int
	for _, item := range items {
		produk, err := u.ProdukFinder.FindByID(item.ID)
		if err != nil {
			return "", err
		}
		subtotal += produk.HargaJual * item.Quantity
	}
	totalKaos := 0
	for _, item := range items {
		totalKaos += item.Quantity
	}
	beratKg := int(math.Ceil(float64(totalKaos) / 3.0))
	wilayah := mapKotaKeWilayah(user.Kota)
	if wilayah == "" {
		return "", errors.New("wilayah tidak dikenali")
	}
	tarif, err := u.TarifFinder.FindByWilayah(wilayah)
	if err != nil {
		return "", err
	}
	ongkir := beratKg * tarif.HargaPerKg
	total := subtotal + ongkir

	pesanan := entity.Pesanan{
		PemesanRef: userID, DiverifikasiRef: nil, TarifPengirimanRef: tarif.IDTarifPengiriman,
		KodePesanan: "ORD-" + uuid.New().String(), Subtotal: subtotal, Berat: beratKg,
		BiayaOngkir: ongkir, TotalBayar: total, AlamatPengiriman: alamat,
		StatusPembayaran: "pending", StatusPesanan: "menunggu_pembayaran",
	}
	if err := u.PesananRepo.Create(&pesanan); err != nil {
		return "", err
	}

	for _, item := range items {
		if item.WarnaID == 0 || item.UkuranID == 0 {
			return "", errors.New("warna_id dan ukuran_id wajib diisi untuk setiap item")
		}
		produk, err := u.ProdukFinder.FindByID(item.ID)
		if err != nil {
			return "", err
		}
		varian, err := u.VarianFinderUpdater.FindByProdukWarnaUkuran(item.ID, item.WarnaID, item.UkuranID)
		if err != nil {
			return "", err
		}
		if varian == nil {
			return "", errors.New("varian tidak ditemukan untuk produk ID=" + strconv.Itoa(item.ID))
		}
		if varian.StokKaos < item.Quantity {
			return "", errors.New("stok tidak mencukupi untuk " + produk.NamaKaos)
		}
		varian.StokKaos -= item.Quantity
		if err := u.VarianFinderUpdater.Update(varian); err != nil {
			return "", err
		}
		detail := entity.DetailPesanan{PesananRef: pesanan.IDPesanan, ProdukRef: produk.IDProduk, Jumlah: item.Quantity, HargaSatuan: produk.HargaJual, Total: produk.HargaJual * item.Quantity}
		if err := u.DetailPesanan.Create(&detail); err != nil {
			return "", err
		}
	}
	return u.createMidtransSnap(pesanan)
}

func (u *PembayaranService) createMidtransSnap(p entity.Pesanan) (string, error) {
	loc, _ := time.LoadLocation("Asia/Jakarta")
	startTime := time.Now().In(loc).Format("2006-01-02 15:04:05 +0700")
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{OrderID: p.KodePesanan, GrossAmt: int64(p.TotalBayar)},
		Expiry:             &snap.ExpiryDetails{StartTime: startTime, Unit: "hour", Duration: 24},
	}
	resp, err := snap.CreateTransaction(req)
	if err != nil {
		return "", err
	}
	return resp.Token, nil
}
