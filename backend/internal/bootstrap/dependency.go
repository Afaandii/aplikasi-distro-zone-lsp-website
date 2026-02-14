package bootstrap

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/catalog"
	"aplikasi-distro-zone-lsp-website/internal/modules/complaint"
	"aplikasi-distro-zone-lsp-website/internal/modules/operational"
	"aplikasi-distro-zone-lsp-website/internal/modules/order"
	"aplikasi-distro-zone-lsp-website/internal/modules/product"
	"aplikasi-distro-zone-lsp-website/internal/modules/report"
	"aplikasi-distro-zone-lsp-website/internal/modules/user"
	"aplikasi-distro-zone-lsp-website/pkg/midtrans"

	"gorm.io/gorm"
)

type App struct {
	UserMod        *user.Module
	CatalogMod     *catalog.Module
	ProductMod     *product.Module
	OperationalMod *operational.Module
	OrderMod       *order.Module
	ComplaintMod   *complaint.Module
	ReportMod      *report.Module
}

func InitApp(db *gorm.DB) *App {
	// 1. Init independent modules
	userMod := user.NewModule(db)
	productMod := product.NewModule(db)
	operationalMod := operational.NewModule(db)
	reportMod := report.NewModule(db)

	// 2. Init catalog module (needs produk service for MasterData)
	catalogMod := catalog.NewModule(db, productMod.ProdukSvc)

	// 3. Init modules with external deps
	paymentGateway := midtrans.NewPaymentGateway()
	complaintMod := complaint.NewModule(db, paymentGateway)

	// 4. Init order module (needs cross-module wiring)
	orderMod := order.NewModule(db)

	// 5. Wire cross-module dependencies for order's PembayaranService
	orderMod.WireCrossModuleDeps(
		productMod.ProdukRepo,              // ProdukFinder
		userMod.UserRepo,                   // UserFinder
		operationalMod.TarifPengirimanRepo, // TarifFinder
		productMod.VarianRepo,              // VarianFinderUpdater
	)

	return &App{
		UserMod:        userMod,
		CatalogMod:     catalogMod,
		ProductMod:     productMod,
		OperationalMod: operationalMod,
		OrderMod:       orderMod,
		ComplaintMod:   complaintMod,
		ReportMod:      reportMod,
	}
}

func (a *App) RegisterAllRoutes() {
	a.UserMod.RegisterRoutes()
	a.CatalogMod.RegisterRoutes()
	a.ProductMod.RegisterRoutes()
	a.OperationalMod.RegisterRoutes()
	a.OrderMod.RegisterRoutes()
	a.ComplaintMod.RegisterRoutes()
	a.ReportMod.RegisterRoutes()
}
