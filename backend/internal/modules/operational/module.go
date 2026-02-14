package operational

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/operational/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/operational/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/operational/service"

	"gorm.io/gorm"
)

type Module struct {
	JamOperasionalHandler  *handler.JamOperasionalHandler
	TarifPengirimanHandler *handler.TarifPengirimanHandler

	// Exported services for cross-module usage
	TarifPengirimanSvc service.TarifPengirimanService

	// Exported repos for cross-module wiring
	TarifPengirimanRepo repository.TarifPengirimanRepository
}

func NewModule(db *gorm.DB) *Module {
	jamRepo := repository.NewJamOperasionalPGRepository(db)
	tarifRepo := repository.NewTarifPengirimanPGRepository(db)

	jamSvc := service.NewJamOperasionalService(jamRepo)
	tarifSvc := service.NewTarifPengirimanService(tarifRepo)

	jamH := handler.NewJamOperasionalHandler(jamSvc)
	tarifH := handler.NewTarifPengirimanHandler(tarifSvc)

	return &Module{
		JamOperasionalHandler:  jamH,
		TarifPengirimanHandler: tarifH,
		TarifPengirimanSvc:     tarifSvc,
		TarifPengirimanRepo:    tarifRepo,
	}
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.JamOperasionalHandler, m.TarifPengirimanHandler)
}
