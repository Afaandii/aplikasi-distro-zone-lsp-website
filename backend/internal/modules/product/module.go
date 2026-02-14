package product

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/product/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/product/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/product/service"

	"gorm.io/gorm"
)

type Module struct {
	ProdukHandler     *handler.ProdukHandler
	VarianHandler     *handler.VarianHandler
	FotoProdukHandler *handler.FotoProdukHandler

	// Exported services for cross-module usage
	ProdukSvc     service.ProdukService
	VarianSvc     service.VarianService
	FotoProdukSvc service.FotoProdukService

	// Exported repos for cross-module wiring
	ProdukRepo repository.ProdukRepository
	VarianRepo repository.VarianRepository
}

func NewModule(db *gorm.DB) *Module {
	produkRepo := repository.NewProdukPGRepository(db)
	varianRepo := repository.NewVarianPGRepository(db)
	fotoProdukRepo := repository.NewFotoProdukPGRepository(db)

	produkSvc := service.NewProdukService(produkRepo)
	varianSvc := service.NewVarianService(varianRepo)
	fotoProdukSvc := service.NewFotoProdukService(fotoProdukRepo)

	produkH := handler.NewProdukHandler(produkSvc)
	varianH := handler.NewVarianHandler(varianSvc)
	fotoProdukH := handler.NewFotoProdukHandler(fotoProdukSvc)

	return &Module{
		ProdukHandler:     produkH,
		VarianHandler:     varianH,
		FotoProdukHandler: fotoProdukH,
		ProdukSvc:         produkSvc,
		VarianSvc:         varianSvc,
		FotoProdukSvc:     fotoProdukSvc,
		ProdukRepo:        produkRepo,
		VarianRepo:        varianRepo,
	}
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.ProdukHandler, m.VarianHandler, m.FotoProdukHandler)
}
