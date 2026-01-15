package bootstrap

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"

	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(
		&entities.Role{},
		&entities.User{},
		&entities.Merk{},
		&entities.Tipe{},
		&entities.Ukuran{},
		&entities.Warna{},
		&entities.Produk{},
		&entities.FotoProduk{},
		&entities.Varian{},
		&entities.JamOperasional{},
		&entities.TarifPengiriman{},
		&entities.ChatCS{},
		&entities.Pesanan{},
		&entities.DetailPesanan{},
		&entities.Transaksi{},
		&entities.DetailTransaksi{},
		&entities.Pembayaran{},
		&entities.Komplain{},
		&entities.Refund{},
		&entities.Cart{},
		&entities.CartItem{},
	)

	supabase.InitStorage()
}
