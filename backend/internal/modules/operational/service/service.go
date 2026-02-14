package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/operational/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

// ==================== JamOperasional Service ====================

type JamOperasionalService interface {
	GetAll() ([]entity.JamOperasional, error)
	GetByID(id int) (*entity.JamOperasional, error)
	Create(tipeLayanan, hari, jamBuka, jamTutup, status string) (*entity.JamOperasional, error)
	Update(id int, tipeLayanan, hari, jamBuka, jamTutup, status string) (*entity.JamOperasional, error)
	Delete(id int) error
	Search(keyword string) ([]entity.JamOperasional, error)
}

type jamOperasionalService struct {
	repo repository.JamOperasionalRepository
}

func NewJamOperasionalService(r repository.JamOperasionalRepository) JamOperasionalService {
	return &jamOperasionalService{repo: r}
}

func (s *jamOperasionalService) GetAll() ([]entity.JamOperasional, error) { return s.repo.FindAll() }
func (s *jamOperasionalService) Search(k string) ([]entity.JamOperasional, error) {
	return s.repo.Search(k)
}

func (s *jamOperasionalService) GetByID(id int) (*entity.JamOperasional, error) {
	jo, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if jo == nil {
		return nil, helper.JamOperasionalNotFoundError(id)
	}
	return jo, nil
}

func (s *jamOperasionalService) Create(tipeLayanan, hari, jamBuka, jamTutup, status string) (*entity.JamOperasional, error) {
	jo := &entity.JamOperasional{TipeLayanan: tipeLayanan, Hari: hari, JamBuka: jamBuka, JamTutup: jamTutup, Status: status}
	if err := s.repo.Create(jo); err != nil {
		return nil, err
	}
	return jo, nil
}

func (s *jamOperasionalService) Update(id int, tipeLayanan, hari, jamBuka, jamTutup, status string) (*entity.JamOperasional, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.JamOperasionalNotFoundError(id)
	}
	existing.TipeLayanan = tipeLayanan
	existing.Hari = hari
	existing.JamBuka = jamBuka
	existing.JamTutup = jamTutup
	existing.Status = status
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *jamOperasionalService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.JamOperasionalNotFoundError(id)
	}
	return s.repo.Delete(id)
}

// ==================== TarifPengiriman Service ====================

type TarifPengirimanService interface {
	GetAll() ([]entity.TarifPengiriman, error)
	GetByID(id int) (*entity.TarifPengiriman, error)
	Create(wilayah string, hargaPerKg int) (*entity.TarifPengiriman, error)
	Update(id int, wilayah string, hargaPerKg int) (*entity.TarifPengiriman, error)
	Delete(id int) error
	Search(keyword string) ([]entity.TarifPengiriman, error)
}

type tarifPengirimanService struct {
	repo repository.TarifPengirimanRepository
}

func NewTarifPengirimanService(r repository.TarifPengirimanRepository) TarifPengirimanService {
	return &tarifPengirimanService{repo: r}
}

func (s *tarifPengirimanService) GetAll() ([]entity.TarifPengiriman, error) { return s.repo.FindAll() }
func (s *tarifPengirimanService) Search(k string) ([]entity.TarifPengiriman, error) {
	return s.repo.Search(k)
}

func (s *tarifPengirimanService) GetByID(id int) (*entity.TarifPengiriman, error) {
	tp, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if tp == nil {
		return nil, helper.TarifPengirimanNotFoundError(id)
	}
	return tp, nil
}

func (s *tarifPengirimanService) Create(wilayah string, hargaPerKg int) (*entity.TarifPengiriman, error) {
	tp := &entity.TarifPengiriman{Wilayah: wilayah, HargaPerKg: hargaPerKg}
	if err := s.repo.Create(tp); err != nil {
		return nil, err
	}
	return tp, nil
}

func (s *tarifPengirimanService) Update(id int, wilayah string, hargaPerKg int) (*entity.TarifPengiriman, error) {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.TarifPengirimanNotFoundError(id)
	}
	existing.Wilayah = wilayah
	existing.HargaPerKg = hargaPerKg
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *tarifPengirimanService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.TarifPengirimanNotFoundError(id)
	}
	return s.repo.Delete(id)
}
