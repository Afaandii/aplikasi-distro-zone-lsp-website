package user

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/user/handler"
	"aplikasi-distro-zone-lsp-website/internal/modules/user/repository"
	"aplikasi-distro-zone-lsp-website/internal/modules/user/service"

	"gorm.io/gorm"
)

type Module struct {
	UserHandler  *handler.UserHandler
	RoleHandler  *handler.RoleHandler
	AdminHandler *handler.AdminHandler
	KasirHandler *handler.KasirHandler

	// Exported repos for cross-module wiring
	UserRepo repository.UserRepository
}

func NewModule(db *gorm.DB) *Module {
	// Repositories
	userRepo := repository.NewUserPGRepository(db)
	roleRepo := repository.NewRolePGRepository(db)
	adminRepo := repository.NewAdminPgRepository(db)
	kasirRepo := repository.NewKasirPgRepository(db)

	// Services
	userSvc := service.NewUserService(userRepo)
	roleSvc := service.NewRoleService(roleRepo)
	adminSvc := service.NewAdminService(adminRepo)
	kasirSvc := service.NewKasirService(kasirRepo)

	// Handlers
	userHandler := handler.NewUserHandler(userSvc)
	roleHandler := handler.NewRoleHandler(roleSvc)
	adminHandler := handler.NewAdminHandler(adminSvc)
	kasirHandler := handler.NewKasirHandler(kasirSvc)

	return &Module{
		UserHandler:  userHandler,
		RoleHandler:  roleHandler,
		AdminHandler: adminHandler,
		KasirHandler: kasirHandler,
		UserRepo:     userRepo,
	}
}

func (m *Module) RegisterRoutes() {
	handler.RegisterRoutes(m.UserHandler, m.RoleHandler, m.AdminHandler, m.KasirHandler)
}
