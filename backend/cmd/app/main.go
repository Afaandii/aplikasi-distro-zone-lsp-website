package main

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/internal/infrastructure/database"
	repo "aplikasi-distro-zone-lsp-website/internal/infrastructure/repository"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/internal/server"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	db, err := database.ConnPostgre()
	if err != nil {
		log.Fatal("db connect:", err)
	}

	// auto generate jika belum ada table didatabase
	db.AutoMigrate(&entities.Role{})
	db.AutoMigrate(&entities.Customer{})
	db.AutoMigrate(&entities.Karyawan{})
	db.AutoMigrate(&entities.Merk{})
	db.AutoMigrate(&entities.Tipe{})
	db.AutoMigrate(&entities.Ukuran{})
	db.AutoMigrate(&entities.Warna{})
	supabase.InitStorage()

	roleRepo := repo.NewRolePGRepository(db)
	roleUc := usecase.NewRoleUsecase(roleRepo)
	roleCtrl := controller.NewRoleController(roleUc)
	customerRepo := repo.NewCustomerPGRepository(db)
	customerUc := usecase.NewCustomerUsecase(customerRepo)
	customerCtrl := controller.NewCustomerController(customerUc)
	karyawanRepo := repo.NewKaryawanPGRepository(db)
	karyawanUc := usecase.NewkaryawanUsecase(karyawanRepo)
	karyawanCtrl := controller.NewKaryawanController(karyawanUc)
	merkRepo := repo.NewMerkPGRepository(db)
	merkUc := usecase.NewMerkUsecase(merkRepo)
	merkCtrl := controller.NewMerkController(merkUc)
	tipeRepo := repo.NewTipePGRepository(db)
	tipeUc := usecase.NewTipeUsecase(tipeRepo)
	tipeCtrl := controller.NewTipeController(tipeUc)
	ukuranRepo := repo.NewUkuranPGRepository(db)
	ukuranUc := usecase.NewUkuranUsecase(ukuranRepo)
	ukuranCtrl := controller.NewUkuranController(ukuranUc)
	warnaRepo := repo.NewWarnaPGRepository(db)
	warnaUc := usecase.NewWarnaUsecase(warnaRepo)
	warnaCtrl := controller.NewWarnaController(warnaUc)

	server.RegisterRoleRoutes(roleCtrl)
	server.RegisterCutomerRoutes(customerCtrl)
	server.RegisterKaryawanRoutes(karyawanCtrl)
	server.RegisterMerkRoutes(merkCtrl)
	server.RegisterTipeRoutes(tipeCtrl)
	server.RegisterUkuranRoutes(ukuranCtrl)
	server.RegisterWarnaRoutes(warnaCtrl)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
