package repository

import "aplikasi-distro-zone-lsp-website/internal/domain/entities"

type KaryawanRepository interface {
	FindAll() ([]entities.Karyawan, error)
	FindByID(idKaryawan int) (*entities.Karyawan, error)
	Create(m *entities.Karyawan) error
	Update(m *entities.Karyawan) error
	Delete(idKaryawan int) error
}
