package bootstrap

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	repo "aplikasi-distro-zone-lsp-website/internal/infrastructure/repository"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/midtrans"

	"gorm.io/gorm"
)

type Controllers struct {
	Role       *controller.RoleController
	User       *controller.UserController
	Merk       *controller.MerkController
	Tipe       *controller.TipeController
	Ukuran     *controller.UkuranController
	Warna      *controller.WarnaController
	Produk     *controller.ProdukController
	FotoProduk *controller.FotoProdukController
	Tarif      *controller.TarifPengirimanController
	Jam        *controller.JamOperasionalController
	Varian     *controller.VarianController
	Pesanan    *controller.PesananController
	PesananUC  usecase.PesananUsecase
	Kasir      *controller.KasirController
	Admin      *controller.AdminController
	KasirRpt   *controller.ReportKasirController
	AdminRpt   *controller.ReportAdminController
	Komplain   *controller.KomplainController
	Refund     *controller.RefundController
	Cart       *controller.CartController
	Checkout   *controller.CheckoutController
	Callback   *controller.MidtransCallbackController
	Master     *controller.MasterDataController
}

func InitControllers(db *gorm.DB) Controllers {

	// ===== MASTER DATA =====
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

	// ===== PRODUK =====
	produkRepo := repo.NewProdukPGRepository(db)
	produkUc := usecase.NewProdukUsecase(produkRepo)
	produkCtrl := controller.NewProdukController(produkUc)

	fotoProdukRepo := repo.NewFotoProdukPGRepository(db)
	fotoProdukUc := usecase.NewFotoProdukUsecase(fotoProdukRepo)
	fotoProdukCtrl := controller.NewFotoProdukController(fotoProdukUc)

	varianRepo := repo.NewVarianPGRepository(db)
	varianUc := usecase.NewVarianUsecase(varianRepo)
	varianCtrl := controller.NewVarianController(varianUc)

	masterDataCtrl := controller.NewMasterDataController(
		produkUc, merkUc, tipeUc, ukuranUc, warnaUc,
	)

	// ===== OPERASIONAL =====
	tarifRepo := repo.NewTarifPengirimanPGRepository(db)
	tarifUc := usecase.NewTarifPengirimanUsecase(tarifRepo)
	tarifCtrl := controller.NewTarifPengirimanController(tarifUc)

	jamRepo := repo.NewJamOperasionalPGRepository(db)
	jamUc := usecase.NewJamOperasionalUsecase(jamRepo)
	jamCtrl := controller.NewJamOperasionalController(jamUc)

	// ===== TRANSAKSI =====
	pesananRepo := repo.NewPesananPGRepository(db)
	pesananUc := usecase.NewPesananUsecase(pesananRepo)
	pesananCtrl := controller.NewPesananController(pesananUc)

	detailPesananRepo := repo.NewDetailPesananPGRepository(db)
	pembayaranRepo := repo.NewPembayaranPgRepository(db)

	pembayaranUc := &usecase.PembayaranUsecase{
		PesananRepo:   pesananRepo,
		ProdukRepo:    produkRepo,
		UserRepo:      userRepo,
		TarifRepo:     tarifRepo,
		DetailPesanan: detailPesananRepo,
		VarianRepo:    varianRepo,
	}

	checkoutCtrl := &controller.CheckoutController{
		PembayaranUC: pembayaranUc,
	}

	callbackCtrl := &controller.MidtransCallbackController{
		PesananRepo:    pesananRepo,
		PembayaranRepo: pembayaranRepo,
	}

	// ===== KASIR & ADMIN =====
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

	// ===== KOMPLAIN / REFUND =====
	komplainRepo := repo.NewKomplainPgRepository(db)
	komplainUc := usecase.NewKomplainUsecase(komplainRepo)
	komplainCtrl := controller.NewKomplainController(komplainUc)

	refundRepo := repo.NewRefundPgRepository(db)
	paymentGateway := midtrans.NewPaymentGateway()
	refundUc := usecase.NewRefundUsecase(refundRepo, paymentGateway)
	refundCtrl := controller.NewRefundController(refundUc)

	// ===== CART =====
	cartRepo := repo.NewCartRepository(db)
	cartUc := usecase.NewCartUsecase(cartRepo)
	cartCtrl := controller.NewCartController(cartUc)

	return Controllers{
		Role:       roleCtrl,
		User:       userCtrl,
		Merk:       merkCtrl,
		Tipe:       tipeCtrl,
		Ukuran:     ukuranCtrl,
		Warna:      warnaCtrl,
		Produk:     produkCtrl,
		FotoProduk: fotoProdukCtrl,
		Varian:     varianCtrl,
		Master:     masterDataCtrl,
		Tarif:      tarifCtrl,
		Jam:        jamCtrl,
		Pesanan:    pesananCtrl,
		PesananUC:  pesananUc,
		Checkout:   checkoutCtrl,
		Callback:   callbackCtrl,
		Kasir:      kasirCtrl,
		Admin:      adminCtrl,
		KasirRpt:   reportKasirCtrl,
		AdminRpt:   reportAdminCtrl,
		Komplain:   komplainCtrl,
		Refund:     refundCtrl,
		Cart:       cartCtrl,
	}
}
