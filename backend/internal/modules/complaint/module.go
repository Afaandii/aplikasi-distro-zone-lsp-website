package complaint

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/complaint/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/complaint/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/complaint/service"
	pkgservice "aplikasi-distro-zone-lsp-website/pkg/service"

	"gorm.io/gorm"
)

type Module struct {
	KomplainHandler *handler.KomplainHandler
	RefundHandler   *handler.RefundHandler

	KomplainSvc *service.KomplainService
	RefundSvc   *service.RefundService
}

func NewModule(db *gorm.DB, payment pkgservice.PaymentGateway) *Module {
	komplainRepo := repository.NewKomplainPGRepository(db)
	refundRepo := repository.NewRefundPGRepository(db)

	komplainSvc := service.NewKomplainService(komplainRepo)
	refundSvc := service.NewRefundService(refundRepo, payment)

	komplainH := handler.NewKomplainHandler(komplainSvc)
	refundH := handler.NewRefundHandler(refundSvc)

	return &Module{
		KomplainHandler: komplainH, RefundHandler: refundH,
		KomplainSvc: komplainSvc, RefundSvc: refundSvc,
	}
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.KomplainHandler, m.RefundHandler)
}
