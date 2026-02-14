package repository

import "aplikasi-distro-zone-lsp-website/internal/shared/entity"

// --- User Repository ---

type UserRepository interface {
	FindAll() ([]entity.User, error)
	FindByID(idUser int) (*entity.User, error)
	FindByRole(roleID int) ([]entity.User, error)
	Create(u *entity.User) error
	Update(u *entity.User) error
	Delete(idUser int) error

	FindByUsername(username string) (*entity.User, error)
	Register(u *entity.User) error
	UpdateAddress(idUser int, alamat string, kota string) (*entity.User, error)
	GetTransaksiByUser(idUser int) ([]entity.Transaksi, error)
	GetPesananByUser(idUser int) ([]entity.Pesanan, error)
	Search(keyword string) ([]entity.User, error)
}

// --- Role Repository ---

type RoleRepository interface {
	FindAll() ([]entity.Role, error)
	FindByID(idRole int) (*entity.Role, error)
	Create(r *entity.Role) error
	Update(r *entity.Role) error
	Delete(idRole int) error
}

// --- Admin Repository ---

type AdminRepository interface {
	FindPesananDiproses() ([]entity.Pesanan, error)
	FindPesananDikemas() ([]entity.Pesanan, error)
	FindPesananDikirim() ([]entity.Pesanan, error)
	UpdateStatusPesananAdmin(kodePesanan string, fromStatus string, toStatus string, adminID int) error
	InsertTransaksiFromPesanan(kodePesanan string) error
}

// --- Kasir Repository ---

type KasirRepository interface {
	FindMenungguVerifikasi() ([]entity.Pesanan, error)
	UpdateVerifikasiKasir(kodePesanan string, statusPesanan string, kasirID int) error
	UpdatePesananCustomer(kodePesanan string, statusPesanan string) error
}
