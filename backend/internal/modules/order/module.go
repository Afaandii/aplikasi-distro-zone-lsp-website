package order

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/order/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/order/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/order/service"

	"gorm.io/gorm"
)

type Module struct {
	CartHandler             *handler.CartHandler
	PesananHandler          *handler.PesananHandler
	CheckoutHandler         *handler.CheckoutHandler
	MidtransCallbackHandler *handler.MidtransCallbackHandler

	// Exported services for cross-module usage
	PesananSvc    service.PesananService
	CartSvc       service.CartService
	PembayaranSvc *service.PembayaranService

	// Internal repos (exposed for cross-module wiring)
	PesananRepo    repository.PesananRepository
	PembayaranRepo repository.PembayaranRepository
}

// NewModule creates the order module.
// Cross-module dependencies must be injected after creation via WireCrossModuleDeps.
func NewModule(db *gorm.DB) *Module {
	cartRepo := repository.NewCartPGRepository(db)
	pesananRepo := repository.NewPesananPGRepository(db)
	detailRepo := repository.NewDetailPesananPGRepository(db)
	pembayaranRepo := repository.NewPembayaranPGRepository(db)

	cartSvc := service.NewCartService(cartRepo)
	pesananSvc := service.NewPesananService(pesananRepo)

	pembayaranSvc := &service.PembayaranService{
		PesananRepo:    pesananRepo,
		PembayaranRepo: pembayaranRepo,
		DetailPesanan:  detailRepo,
	}

	cartH := handler.NewCartHandler(cartSvc)
	pesananH := handler.NewPesananHandler(pesananSvc)
	checkoutH := handler.NewCheckoutHandler(pembayaranSvc)
	callbackH := handler.NewMidtransCallbackHandler(pesananRepo, pembayaranRepo)

	return &Module{
		CartHandler: cartH, PesananHandler: pesananH,
		CheckoutHandler: checkoutH, MidtransCallbackHandler: callbackH,
		PesananSvc: pesananSvc, CartSvc: cartSvc, PembayaranSvc: pembayaranSvc,
		PesananRepo: pesananRepo, PembayaranRepo: pembayaranRepo,
	}
}

// WireCrossModuleDeps injects cross-module dependencies into PembayaranService.
func (m *Module) WireCrossModuleDeps(produk service.ProdukFinder, user service.UserFinder, tarif service.TarifFinder, varian service.VarianFinderUpdater) {
	m.PembayaranSvc.ProdukFinder = produk
	m.PembayaranSvc.UserFinder = user
	m.PembayaranSvc.TarifFinder = tarif
	m.PembayaranSvc.VarianFinderUpdater = varian
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.CartHandler, m.PesananHandler, m.CheckoutHandler, m.MidtransCallbackHandler)
}
