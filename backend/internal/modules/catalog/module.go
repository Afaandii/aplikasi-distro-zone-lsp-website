package catalog

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/catalog/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/catalog/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/catalog/service"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"

	"gorm.io/gorm"
)

type Module struct {
	MerkHandler   *handler.MerkHandler
	TipeHandler   *handler.TipeHandler
	UkuranHandler *handler.UkuranHandler
	WarnaHandler  *handler.WarnaHandler
	MasterHandler *handler.MasterDataHandler

	// Exported services so product module can use them
	MerkSvc   service.MerkService
	TipeSvc   service.TipeService
	UkuranSvc service.UkuranService
	WarnaSvc  service.WarnaService
}

func NewModule(db *gorm.DB, produkSvc interface {
	GetAll() ([]entity.Produk, error)
}) *Module {
	merkRepo := repository.NewMerkPGRepository(db)
	tipeRepo := repository.NewTipePGRepository(db)
	ukuranRepo := repository.NewUkuranPGRepository(db)
	warnaRepo := repository.NewWarnaPGRepository(db)

	merkSvc := service.NewMerkService(merkRepo)
	tipeSvc := service.NewTipeService(tipeRepo)
	ukuranSvc := service.NewUkuranService(ukuranRepo)
	warnaSvc := service.NewWarnaService(warnaRepo)

	merkH := handler.NewMerkHandler(merkSvc)
	tipeH := handler.NewTipeHandler(tipeSvc)
	ukuranH := handler.NewUkuranHandler(ukuranSvc)
	warnaH := handler.NewWarnaHandler(warnaSvc)

	masterH := &handler.MasterDataHandler{
		ProdukSvc: produkSvc,
		MerkSvc:   merkSvc,
		TipeSvc:   tipeSvc,
		UkuranSvc: ukuranSvc,
		WarnaSvc:  warnaSvc,
	}

	return &Module{
		MerkHandler:   merkH,
		TipeHandler:   tipeH,
		UkuranHandler: ukuranH,
		WarnaHandler:  warnaH,
		MasterHandler: masterH,

		MerkSvc:   merkSvc,
		TipeSvc:   tipeSvc,
		UkuranSvc: ukuranSvc,
		WarnaSvc:  warnaSvc,
	}
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.MerkHandler, m.TipeHandler, m.UkuranHandler, m.WarnaHandler, m.MasterHandler)
}
