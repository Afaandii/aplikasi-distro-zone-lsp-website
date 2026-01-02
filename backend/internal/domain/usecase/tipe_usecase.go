package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type TipeUsecase interface {
	GetAll() ([]entities.Tipe, error)
	GetByID(idTipe int) (*entities.Tipe, error)
	Create(nama_tipe string, keterangan string) (*entities.Tipe, error)
	Update(idTipe int, nama_tipe string, keterangan string) (*entities.Tipe, error)
	Delete(idTipe int) error
	Search(keyword string) ([]entities.Tipe, error)
}

type tipeUsecase struct {
	repo repository.TipeRepository
}

func NewTipeUsecase(r repository.TipeRepository) TipeUsecase {
	return &tipeUsecase{repo: r}
}

func (u *tipeUsecase) GetAll() ([]entities.Tipe, error) {
	return u.repo.FindAll()
}

func (u *tipeUsecase) GetByID(idTipe int) (*entities.Tipe, error) {
	t, err := u.repo.FindByID(idTipe)
	if err != nil {
		return nil, err
	}
	if t == nil {
		return nil, helper.TipeNotFoundError(idTipe)
	}
	return t, nil
}

func (u *tipeUsecase) Create(nama_tipe string, keterangan string) (*entities.Tipe, error) {
	t := &entities.Tipe{NamaTipe: nama_tipe, Keterangan: keterangan}
	err := u.repo.Create(t)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (u *tipeUsecase) Update(idTipe int, nama_tipe string, keterangan string) (*entities.Tipe, error) {
	existing, err := u.repo.FindByID(idTipe)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.TipeNotFoundError(idTipe)
	}
	existing.NamaTipe = nama_tipe
	existing.Keterangan = keterangan
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *tipeUsecase) Delete(idTipe int) error {
	existing, err := u.repo.FindByID(idTipe)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.TipeNotFoundError(idTipe)
	}
	return u.repo.Delete(idTipe)
}

func (u *tipeUsecase) Search(keyword string) ([]entities.Tipe, error) {
	return u.repo.Search(keyword)
}
