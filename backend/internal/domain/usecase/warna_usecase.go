package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type WarnaUsecase interface {
	GetAll() ([]entities.Warna, error)
	GetByID(idWarna int) (*entities.Warna, error)
	Create(nama_warna string, keterangan string) (*entities.Warna, error)
	Update(idWarna int, nama_warna string, keterangan string) (*entities.Warna, error)
	Delete(idWarna int) error
}

type warnaUsecase struct {
	repo repository.WarnaRepository
}

func NewWarnaUsecase(r repository.WarnaRepository) WarnaUsecase {
	return &warnaUsecase{repo: r}
}

func (u *warnaUsecase) GetAll() ([]entities.Warna, error) {
	return u.repo.FindAll()
}

func (u *warnaUsecase) GetByID(idWarna int) (*entities.Warna, error) {
	w, err := u.repo.FindByID(idWarna)
	if err != nil {
		return nil, err
	}
	if w == nil {
		return nil, helper.WarnaNotFoundError(idWarna)
	}
	return w, nil
}

func (u *warnaUsecase) Create(nama_warna string, keterangan string) (*entities.Warna, error) {
	w := &entities.Warna{NamaWarna: nama_warna, Keterangan: keterangan}
	err := u.repo.Create(w)
	if err != nil {
		return nil, err
	}
	return w, nil
}

func (u *warnaUsecase) Update(idWarna int, nama_warna string, keterangan string) (*entities.Warna, error) {
	existing, err := u.repo.FindByID(idWarna)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.WarnaNotFoundError(idWarna)
	}
	existing.NamaWarna = nama_warna
	existing.Keterangan = keterangan
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *warnaUsecase) Delete(idWarna int) error {
	existing, err := u.repo.FindByID(idWarna)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.WarnaNotFoundError(idWarna)
	}
	return u.repo.Delete(idWarna)
}
