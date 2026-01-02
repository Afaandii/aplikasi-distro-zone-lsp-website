package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type UkuranUsecase interface {
	GetAll() ([]entities.Ukuran, error)
	GetByID(idUkuran int) (*entities.Ukuran, error)
	Create(nama_ukuran string, keterangan string) (*entities.Ukuran, error)
	Update(idUkuran int, nama_ukuran string, keterangan string) (*entities.Ukuran, error)
	Delete(idUkuran int) error
	Search(keyword string) ([]entities.Ukuran, error)
}

type ukuranUsecase struct {
	repo repository.UkuranRepository
}

func NewUkuranUsecase(r repository.UkuranRepository) UkuranUsecase {
	return &ukuranUsecase{repo: r}
}

func (u *ukuranUsecase) GetAll() ([]entities.Ukuran, error) {
	return u.repo.FindAll()
}

func (u *ukuranUsecase) GetByID(idUkuran int) (*entities.Ukuran, error) {
	uk, err := u.repo.FindByID(idUkuran)
	if err != nil {
		return nil, err
	}
	if uk == nil {
		return nil, helper.UkuranNotFoundError(idUkuran)
	}
	return uk, nil
}

func (u *ukuranUsecase) Create(nama_ukuran string, keterangan string) (*entities.Ukuran, error) {
	uk := &entities.Ukuran{NamaUkuran: nama_ukuran, Keterangan: keterangan}
	err := u.repo.Create(uk)
	if err != nil {
		return nil, err
	}
	return uk, nil
}

func (u *ukuranUsecase) Update(idUkuran int, nama_ukuran string, keterangan string) (*entities.Ukuran, error) {
	existing, err := u.repo.FindByID(idUkuran)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.UkuranNotFoundError(idUkuran)
	}
	existing.NamaUkuran = nama_ukuran
	existing.Keterangan = keterangan
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *ukuranUsecase) Delete(idUkuran int) error {
	existing, err := u.repo.FindByID(idUkuran)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.UkuranNotFoundError(idUkuran)
	}
	return u.repo.Delete(idUkuran)
}

func (u *ukuranUsecase) Search(keyword string) ([]entities.Ukuran, error) {
	return u.repo.Search(keyword)
}
