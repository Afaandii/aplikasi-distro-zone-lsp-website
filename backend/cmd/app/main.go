package main

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/internal/infrastructure/database"
	repo "aplikasi-distro-zone-lsp-website/internal/infrastructure/repository"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/internal/server"
	config "aplikasi-distro-zone-lsp-website/pkg/config"
	"aplikasi-distro-zone-lsp-website/pkg/midtrans"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"
)

func main() {
	db, err := database.ConnPostgre()
	if err != nil {
		log.Fatal("db connect:", err)
	}

	// auto generate model entities jika belum ada table didatabase
	db.AutoMigrate(&entities.Role{})
	db.AutoMigrate(&entities.User{})
	db.AutoMigrate(&entities.Merk{})
	db.AutoMigrate(&entities.Tipe{})
	db.AutoMigrate(&entities.Ukuran{})
	db.AutoMigrate(&entities.Warna{})
	db.AutoMigrate(&entities.Produk{})
	db.AutoMigrate(&entities.FotoProduk{})
	db.AutoMigrate(&entities.Varian{})
	db.AutoMigrate(&entities.JamOperasional{})
	db.AutoMigrate(&entities.TarifPengiriman{})
	db.AutoMigrate(&entities.ChatCS{})
	db.AutoMigrate(&entities.Pesanan{})
	db.AutoMigrate(&entities.DetailPesanan{})
	db.AutoMigrate(&entities.Transaksi{})
	db.AutoMigrate(&entities.DetailTransaksi{})
	db.AutoMigrate(&entities.Pembayaran{})
	db.AutoMigrate(&entities.Komplain{})
	db.AutoMigrate(&entities.Refund{})
	db.AutoMigrate(&entities.Cart{})
	db.AutoMigrate(&entities.CartItem{})
	supabase.InitStorage()

	roleRepo := repo.NewRolePGRepository(db)
	roleUc := usecase.NewRoleUsecase(roleRepo)
	roleCtrl := controller.NewRoleController(roleUc)
	userRepo := repo.NewUserPGRepository(db)
	userUc := usecase.NewUserUsecase(userRepo)
	userCtrl := controller.NewUserController(userUc)
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
	produkrepo := repo.NewProdukPGRepository(db)
	produkUc := usecase.NewProdukUsecase(produkrepo)
	produkCtrl := controller.NewProdukController(produkUc)
	fotoProdukRepo := repo.NewFotoProdukPGRepository(db)
	fotoProdukUc := usecase.NewFotoProdukUsecase(fotoProdukRepo)
	fotoProdukCtrl := controller.NewFotoProdukController(fotoProdukUc)
	tarifPengirimanRepo := repo.NewTarifPengirimanPGRepository(db)
	tarifPengirimanUc := usecase.NewTarifPengirimanUsecase(tarifPengirimanRepo)
	tarifPengirimanCtrl := controller.NewTarifPengirimanController(tarifPengirimanUc)
	jamOperasionalRepo := repo.NewJamOperasionalPGRepository(db)
	jamOperasionalUc := usecase.NewJamOperasionalUsecase(jamOperasionalRepo)
	jamOperasionalCtrl := controller.NewJamOperasionalController(jamOperasionalUc)
	masterDataCtrl := controller.NewMasterDataController(produkUc, merkUc, tipeUc, ukuranUc, warnaUc)
	varianRepo := repo.NewVarianPGRepository(db)
	varianUc := usecase.NewVarianUsecase(varianRepo)
	varianCtrl := controller.NewVarianController(varianUc)
	pesananRepo := repo.NewPesananPGRepository(db)
	pesananUc := usecase.NewPesananUsecase(pesananRepo)
	pesananCtrl := controller.NewPesananController(pesananUc)
	detailPesananRepo := repo.NewDetailPesananPGRepository(db)
	kasirRepo := repo.NewKasirPgRepository(db)
	kasirUc := usecase.NewKasirUsecase(kasirRepo)
	kasirCtrl := controller.NewKasirController(kasirUc)
	adminRepo := repo.NewAdminPgRepository(db)
	adminUc := usecase.NewAdminUsecase(adminRepo)
	adminCtrl := controller.NewAdminController(adminUc)
	reportKasirRepo := repo.NewReportKasirPgRepository(db)
	reportKasirUc := usecase.NewReportKasirUsecase(reportKasirRepo)
	reportKasirCtrl := controller.NewReportKasirController(reportKasirUc)
	reportAdminRepo := repo.NewReportAdminPgRepository(db)
	reportAdminUc := usecase.NewReportAdminUsecase(reportAdminRepo)
	reportAdminCtrl := controller.NewReportAdminController(reportAdminUc)
	komplainRepo := repo.NewKomplainPgRepository(db)
	komplainUc := usecase.NewKomplainUsecase(komplainRepo)
	komplainCtrl := controller.NewKomplainController(komplainUc)
	refundRepo := repo.NewRefundPgRepository(db)
	paymentGateway := midtrans.NewPaymentGateway()
	refundUc := usecase.NewRefundUsecase(refundRepo, paymentGateway)
	refundCtrl := controller.NewRefundController(refundUc)
	pembayaranRepo := repo.NewPembayaranPgRepository(db)
	cartRepo := repo.NewCartRepository(db)
	cartUc := usecase.NewCartUsecase(cartRepo)
	cartCtrl := controller.NewCartController(cartUc)
	pembayaranUc := &usecase.PembayaranUsecase{PesananRepo: pesananRepo, ProdukRepo: produkrepo, UserRepo: userRepo, TarifRepo: tarifPengirimanRepo, DetailPesanan: detailPesananRepo, VarianRepo: varianRepo}
	checkoutCtrl := &controller.CheckoutController{PembayaranUC: pembayaranUc}
	callbackCtrl := &controller.MidtransCallbackController{PesananRepo: pesananRepo, PembayaranRepo: pembayaranRepo}

	server.RegisterRoleRoutes(roleCtrl)
	server.RegisterUserRoutes(userCtrl)
	server.RegisterMerkRoutes(merkCtrl)
	server.RegisterTipeRoutes(tipeCtrl)
	server.RegisterUkuranRoutes(ukuranCtrl)
	server.RegisterWarnaRoutes(warnaCtrl)
	server.RegisterProdukRoutes(produkCtrl, masterDataCtrl)
	server.RegisterFotoProdukRoutes(fotoProdukCtrl)
	server.RegisterTarifPengirimanRoutes(tarifPengirimanCtrl)
	server.RegisterJamOperasionalRoutes(jamOperasionalCtrl)
	server.RegisterVarianRoutes(varianCtrl)
	server.RegisterPesananRoutes(pesananCtrl)
	server.RegisterPembayaranRoutes(checkoutCtrl, callbackCtrl)
	server.RegisterKasirRoutes(kasirCtrl)
	server.RegisterAdminRoutes(adminCtrl)
	server.RegisterKasirReportRoutes(reportKasirCtrl)
	server.RegisterAdminReportRoutes(reportAdminCtrl)
	server.RegisterKomplainRoutes(komplainCtrl)
	server.RegisterRefundRoutes(refundCtrl)
	server.RegisterCartRoutes(cartCtrl)

	go func() {
		log.Println("Starting Auto-Cancel Orders Worker...")
		ticker := time.NewTicker(5 * time.Second)

		for range ticker.C {
			count, err := pesananUc.AutoCancelExpiredOrders()
			if err != nil {
				log.Printf("Error auto-canceling orders: %v", err)
			} else if count > 0 {
				// Log hanya jika ada pesanan yang dibatalkan
				log.Printf("Auto-Cancel: Successfully canceled %d expired orders.", count)
			}
		}
	}()

	port := os.Getenv("PORT")
	handleCors := config.CorsMiddleware(http.DefaultServeMux)
	midtrans.Init()
	if port == "" {
		port = "8080"
	}
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, handleCors))
}
