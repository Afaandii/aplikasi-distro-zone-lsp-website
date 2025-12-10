package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type RoleUsecase interface {
	GetAll() ([]entities.Role, error)
	GetByID(idRole int) (*entities.Role, error)
	Create(nama_role string, keterangan string) (*entities.Role, error)
	Update(idRole int, nama_role string, keterangan string) (*entities.Role, error)
	Delete(idRole int) error
}

type roleUsecase struct {
	repo repository.RoleRepository
}

func NewRoleUsecase(r repository.RoleRepository) RoleUsecase {
	return &roleUsecase{repo: r}
}

func (u *roleUsecase) GetAll() ([]entities.Role, error) {
	return u.repo.FindAll()
}

func (u *roleUsecase) GetByID(idRole int) (*entities.Role, error) {
	r, err := u.repo.FindByID(idRole)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, helper.RoleNotFoundError(idRole)
	}
	return r, nil
}

func (u *roleUsecase) Create(nama_role string, keterangan string) (*entities.Role, error) {
	r := &entities.Role{NamaRole: nama_role, Keterangan: keterangan}
	err := u.repo.Create(r)
	if err != nil {
		return nil, err
	}
	return r, nil
}

func (u *roleUsecase) Update(idRole int, nama_role string, keterangan string) (*entities.Role, error) {
	existing, err := u.repo.FindByID(idRole)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.RoleNotFoundError(idRole)
	}
	existing.NamaRole = nama_role
	existing.Keterangan = keterangan
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *roleUsecase) Delete(idRole int) error {
	existing, err := u.repo.FindByID(idRole)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.RoleNotFoundError(idRole)
	}
	return u.repo.Delete(idRole)
}
