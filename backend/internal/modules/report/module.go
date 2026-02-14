package report

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/report/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/report/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/report/service"

	"gorm.io/gorm"
)

type Module struct {
	ReportAdminHandler *handler.ReportAdminHandler
	ReportKasirHandler *handler.ReportKasirHandler

	ReportAdminSvc *service.ReportAdminService
	ReportKasirSvc *service.ReportKasirService
}

func NewModule(db *gorm.DB) *Module {
	adminRepo := repository.NewReportAdminPGRepository(db)
	kasirRepo := repository.NewReportKasirPGRepository(db)

	adminSvc := service.NewReportAdminService(adminRepo)
	kasirSvc := service.NewReportKasirService(kasirRepo)

	adminH := handler.NewReportAdminHandler(adminSvc)
	kasirH := handler.NewReportKasirHandler(kasirSvc)

	return &Module{
		ReportAdminHandler: adminH, ReportKasirHandler: kasirH,
		ReportAdminSvc: adminSvc, ReportKasirSvc: kasirSvc,
	}
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.ReportAdminHandler, m.ReportKasirHandler)
}
