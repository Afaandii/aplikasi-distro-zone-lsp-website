package bootstrap

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/pkg/supabase"

	"gorm.io/gorm"
)

func AutoMigrate(db *gorm.DB) {
	db.AutoMigrate(
		&entity.Role{},
		&entity.User{},
		&entity.Merk{},
		&entity.Tipe{},
		&entity.Ukuran{},
		&entity.Warna{},
		&entity.Produk{},
		&entity.FotoProduk{},
		&entity.Varian{},
		&entity.JamOperasional{},
		&entity.TarifPengiriman{},
		&entity.ChatCS{},
		&entity.Pesanan{},
		&entity.DetailPesanan{},
		&entity.Transaksi{},
		&entity.DetailTransaksi{},
		&entity.Pembayaran{},
		&entity.Komplain{},
		&entity.Refund{},
		&entity.Cart{},
		&entity.CartItem{},
	)

	supabase.InitStorage()
}
