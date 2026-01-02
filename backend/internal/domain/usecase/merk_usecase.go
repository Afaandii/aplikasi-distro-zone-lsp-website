package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type MerkUsecase interface {
	GetAll() ([]entities.Merk, error)
	GetByID(idMerk int) (*entities.Merk, error)
	Create(nama_merk string, keterangan string) (*entities.Merk, error)
	Update(idMerk int, nama_merk string, keterangan string) (*entities.Merk, error)
	Delete(idMerk int) error
	Search(keyword string) ([]entities.Merk, error)
}

type merkUsecase struct {
	repo repository.MerkRepository
}

func NewMerkUsecase(r repository.MerkRepository) MerkUsecase {
	return &merkUsecase{repo: r}
}

func (u *merkUsecase) GetAll() ([]entities.Merk, error) {
	return u.repo.FindAll()
}

func (u *merkUsecase) GetByID(idMerk int) (*entities.Merk, error) {
	m, err := u.repo.FindByID(idMerk)
	if err != nil {
		return nil, err
	}
	if m == nil {
		return nil, helper.MerkNotFoundError(idMerk)
	}
	return m, nil
}

func (u *merkUsecase) Create(nama_merk string, keterangan string) (*entities.Merk, error) {
	m := &entities.Merk{NamaMerk: nama_merk, Keterangan: keterangan}
	err := u.repo.Create(m)
	if err != nil {
		return nil, err
	}
	return m, nil
}

func (u *merkUsecase) Update(idMerk int, nama_merk string, keterangan string) (*entities.Merk, error) {
	existing, err := u.repo.FindByID(idMerk)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.MerkNotFoundError(idMerk)
	}
	existing.NamaMerk = nama_merk
	existing.Keterangan = keterangan
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *merkUsecase) Delete(idMerk int) error {
	existing, err := u.repo.FindByID(idMerk)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.MerkNotFoundError(idMerk)
	}
	return u.repo.Delete(idMerk)
}
func (u *merkUsecase) Search(keyword string) ([]entities.Merk, error) {
	return u.repo.Search(keyword)
}
