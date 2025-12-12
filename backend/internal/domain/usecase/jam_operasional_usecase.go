package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
	"time"
)

type JamOperasionalUsecase interface {
	GetAll() ([]entities.JamOperasional, error)
	GetByID(idJamOperasional int) (*entities.JamOperasional, error)
	Create(tipe_layanan string, hari string, jam_buka time.Time, jam_tutup time.Time, status string) (*entities.JamOperasional, error)
	Update(idJamOperasional int, tipe_layanan string, hari string, jam_buka time.Time, jam_tutup time.Time, status string) (*entities.JamOperasional, error)
	Delete(idJamOperasional int) error
}

type jamOperasionalUsecase struct {
	repo repository.JamOperasionalRepository
}

func NewJamOperasionalUsecase(r repository.JamOperasionalRepository) JamOperasionalUsecase {
	return &jamOperasionalUsecase{repo: r}
}

func (u *jamOperasionalUsecase) GetAll() ([]entities.JamOperasional, error) {
	return u.repo.FindAll()
}

func (u *jamOperasionalUsecase) GetByID(idJamOperasional int) (*entities.JamOperasional, error) {
	jo, err := u.repo.FindByID(idJamOperasional)
	if err != nil {
		return nil, err
	}
	if jo == nil {
		return nil, helper.JamOperasionalNotFoundError(idJamOperasional)
	}
	return jo, nil
}

func (u *jamOperasionalUsecase) Create(tipe_layanan string, hari string, jam_buka time.Time, jam_tutup time.Time, status string) (*entities.JamOperasional, error) {
	jo := &entities.JamOperasional{
		TipeLayanan: tipe_layanan,
		Hari:        hari,
		JamBuka:     jam_buka,
		JamTutup:    jam_tutup,
		Status:      status,
	}
	err := u.repo.Create(jo)
	if err != nil {
		return nil, err
	}
	return jo, nil
}

func (u *jamOperasionalUsecase) Update(idJamOperasional int, tipe_layanan string, hari string, jam_buka time.Time, jam_tutup time.Time, status string) (*entities.JamOperasional, error) {
	existing, err := u.repo.FindByID(idJamOperasional)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.JamOperasionalNotFoundError(idJamOperasional)
	}
	existing.TipeLayanan = tipe_layanan
	existing.Hari = hari
	existing.JamBuka = jam_buka
	existing.JamTutup = jam_tutup
	existing.Status = status
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *jamOperasionalUsecase) Delete(idJamOperasional int) error {
	existing, err := u.repo.FindByID(idJamOperasional)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.JamOperasionalNotFoundError(idJamOperasional)
	}
	return u.repo.Delete(idJamOperasional)
}
