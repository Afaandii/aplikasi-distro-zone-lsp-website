package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/catalog/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

// ==================== Merk Service ====================

type MerkService interface {
	GetAll() ([]entity.Merk, error)
	GetByID(idMerk int) (*entity.Merk, error)
	Create(nama string, keterangan string) (*entity.Merk, error)
	Update(idMerk int, nama string, keterangan string) (*entity.Merk, error)
	Delete(idMerk int) error
	Search(keyword string) ([]entity.Merk, error)
}

type merkService struct{ repo repository.MerkRepository }

func NewMerkService(r repository.MerkRepository) MerkService { return &merkService{repo: r} }

func (s *merkService) GetAll() ([]entity.Merk, error) { return s.repo.FindAll() }

func (s *merkService) GetByID(id int) (*entity.Merk, error) {
	m, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if m == nil {
		return nil, helper.MerkNotFoundError(id)
	}
	return m, nil
}

func (s *merkService) Create(nama, keterangan string) (*entity.Merk, error) {
	m := &entity.Merk{NamaMerk: nama, Keterangan: keterangan}
	if err := s.repo.Create(m); err != nil {
		return nil, err
	}
	return m, nil
}

func (s *merkService) Update(id int, nama, keterangan string) (*entity.Merk, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.MerkNotFoundError(id)
	}
	existing.NamaMerk = nama
	existing.Keterangan = keterangan
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *merkService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.MerkNotFoundError(id)
	}
	return s.repo.Delete(id)
}

func (s *merkService) Search(keyword string) ([]entity.Merk, error) {
	return s.repo.Search(keyword)
}

// ==================== Tipe Service ====================

type TipeService interface {
	GetAll() ([]entity.Tipe, error)
	GetByID(idTipe int) (*entity.Tipe, error)
	Create(nama string, keterangan string) (*entity.Tipe, error)
	Update(idTipe int, nama string, keterangan string) (*entity.Tipe, error)
	Delete(idTipe int) error
	Search(keyword string) ([]entity.Tipe, error)
}

type tipeService struct{ repo repository.TipeRepository }

func NewTipeService(r repository.TipeRepository) TipeService { return &tipeService{repo: r} }

func (s *tipeService) GetAll() ([]entity.Tipe, error) { return s.repo.FindAll() }

func (s *tipeService) GetByID(id int) (*entity.Tipe, error) {
	t, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if t == nil {
		return nil, helper.TipeNotFoundError(id)
	}
	return t, nil
}

func (s *tipeService) Create(nama, keterangan string) (*entity.Tipe, error) {
	t := &entity.Tipe{NamaTipe: nama, Keterangan: keterangan}
	if err := s.repo.Create(t); err != nil {
		return nil, err
	}
	return t, nil
}

func (s *tipeService) Update(id int, nama, keterangan string) (*entity.Tipe, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.TipeNotFoundError(id)
	}
	existing.NamaTipe = nama
	existing.Keterangan = keterangan
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *tipeService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.TipeNotFoundError(id)
	}
	return s.repo.Delete(id)
}

func (s *tipeService) Search(keyword string) ([]entity.Tipe, error) {
	return s.repo.Search(keyword)
}

// ==================== Ukuran Service ====================

type UkuranService interface {
	GetAll() ([]entity.Ukuran, error)
	GetByID(idUkuran int) (*entity.Ukuran, error)
	Create(nama string, keterangan string) (*entity.Ukuran, error)
	Update(idUkuran int, nama string, keterangan string) (*entity.Ukuran, error)
	Delete(idUkuran int) error
	Search(keyword string) ([]entity.Ukuran, error)
}

type ukuranService struct{ repo repository.UkuranRepository }

func NewUkuranService(r repository.UkuranRepository) UkuranService { return &ukuranService{repo: r} }

func (s *ukuranService) GetAll() ([]entity.Ukuran, error) { return s.repo.FindAll() }

func (s *ukuranService) GetByID(id int) (*entity.Ukuran, error) {
	u, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if u == nil {
		return nil, helper.UkuranNotFoundError(id)
	}
	return u, nil
}

func (s *ukuranService) Create(nama, keterangan string) (*entity.Ukuran, error) {
	u := &entity.Ukuran{NamaUkuran: nama, Keterangan: keterangan}
	if err := s.repo.Create(u); err != nil {
		return nil, err
	}
	return u, nil
}

func (s *ukuranService) Update(id int, nama, keterangan string) (*entity.Ukuran, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.UkuranNotFoundError(id)
	}
	existing.NamaUkuran = nama
	existing.Keterangan = keterangan
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *ukuranService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.UkuranNotFoundError(id)
	}
	return s.repo.Delete(id)
}

func (s *ukuranService) Search(keyword string) ([]entity.Ukuran, error) {
	return s.repo.Search(keyword)
}

// ==================== Warna Service ====================

type WarnaService interface {
	GetAll() ([]entity.Warna, error)
	GetByID(idWarna int) (*entity.Warna, error)
	Create(nama string, keterangan string) (*entity.Warna, error)
	Update(idWarna int, nama string, keterangan string) (*entity.Warna, error)
	Delete(idWarna int) error
	Search(keyword string) ([]entity.Warna, error)
}

type warnaService struct{ repo repository.WarnaRepository }

func NewWarnaService(r repository.WarnaRepository) WarnaService { return &warnaService{repo: r} }

func (s *warnaService) GetAll() ([]entity.Warna, error) { return s.repo.FindAll() }

func (s *warnaService) GetByID(id int) (*entity.Warna, error) {
	w, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if w == nil {
		return nil, helper.WarnaNotFoundError(id)
	}
	return w, nil
}

func (s *warnaService) Create(nama, keterangan string) (*entity.Warna, error) {
	w := &entity.Warna{NamaWarna: nama, Keterangan: keterangan}
	if err := s.repo.Create(w); err != nil {
		return nil, err
	}
	return w, nil
}

func (s *warnaService) Update(id int, nama, keterangan string) (*entity.Warna, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.WarnaNotFoundError(id)
	}
	existing.NamaWarna = nama
	existing.Keterangan = keterangan
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *warnaService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.WarnaNotFoundError(id)
	}
	return s.repo.Delete(id)
}

func (s *warnaService) Search(keyword string) ([]entity.Warna, error) {
	return s.repo.Search(keyword)
}
