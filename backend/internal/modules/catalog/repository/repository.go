package repository

import "aplikasi-distro-zone-lsp-website/internal/shared/entity"

type MerkRepository interface {
	FindAll() ([]entity.Merk, error)
	FindByID(idMerk int) (*entity.Merk, error)
	Create(m *entity.Merk) error
	Update(m *entity.Merk) error
	Delete(idMerk int) error
	Search(keyword string) ([]entity.Merk, error)
}

type TipeRepository interface {
	FindAll() ([]entity.Tipe, error)
	FindByID(idTipe int) (*entity.Tipe, error)
	Create(t *entity.Tipe) error
	Update(t *entity.Tipe) error
	Delete(idTipe int) error
	Search(keyword string) ([]entity.Tipe, error)
}

type UkuranRepository interface {
	FindAll() ([]entity.Ukuran, error)
	FindByID(idUkuran int) (*entity.Ukuran, error)
	Create(u *entity.Ukuran) error
	Update(u *entity.Ukuran) error
	Delete(idUkuran int) error
	Search(keyword string) ([]entity.Ukuran, error)
}

type WarnaRepository interface {
	FindAll() ([]entity.Warna, error)
	FindByID(idWarna int) (*entity.Warna, error)
	Create(w *entity.Warna) error
	Update(w *entity.Warna) error
	Delete(idWarna int) error
	Search(keyword string) ([]entity.Warna, error)
}
