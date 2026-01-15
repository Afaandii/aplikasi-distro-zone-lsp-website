package bootstrap

import "aplikasi-distro-zone-lsp-website/internal/server"

func RegisterRoutes(c Controllers) {

	// ===== AUTH / MASTER =====
	server.RegisterRoleRoutes(c.Role)
	server.RegisterUserRoutes(c.User)

	// ===== MASTER PRODUK =====
	server.RegisterMerkRoutes(c.Merk)
	server.RegisterTipeRoutes(c.Tipe)
	server.RegisterUkuranRoutes(c.Ukuran)
	server.RegisterWarnaRoutes(c.Warna)

	// ===== PRODUK =====
	server.RegisterProdukRoutes(c.Produk, c.Master)
	server.RegisterFotoProdukRoutes(c.FotoProduk)
	server.RegisterVarianRoutes(c.Varian)

	// ===== OPERASIONAL =====
	server.RegisterTarifPengirimanRoutes(c.Tarif)
	server.RegisterJamOperasionalRoutes(c.Jam)

	// ===== TRANSAKSI =====
	server.RegisterPesananRoutes(c.Pesanan)
	server.RegisterPembayaranRoutes(c.Checkout, c.Callback)

	// ===== KASIR & ADMIN =====
	server.RegisterKasirRoutes(c.Kasir)
	server.RegisterAdminRoutes(c.Admin)
	server.RegisterKasirReportRoutes(c.KasirRpt)
	server.RegisterAdminReportRoutes(c.AdminRpt)

	// ===== CUSTOMER SERVICE =====
	server.RegisterKomplainRoutes(c.Komplain)
	server.RegisterRefundRoutes(c.Refund)

	// ===== CART =====
	server.RegisterCartRoutes(c.Cart)
}
