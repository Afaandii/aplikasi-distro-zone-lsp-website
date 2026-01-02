package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type TarifPengirimanUsecase interface {
	GetAll() ([]entities.TarifPengiriman, error)
	GetByID(idTarifPengiriman int) (*entities.TarifPengiriman, error)
	Create(wilayah string, harga_per_kg int) (*entities.TarifPengiriman, error)
	Update(idTarifPengiriman int, wilayah string, harga_per_kg int) (*entities.TarifPengiriman, error)
	Delete(idTarifPengiriman int) error
	Search(keyword string) ([]entities.TarifPengiriman, error)
}

type tarifPengirimanUsecase struct {
	repo repository.TarifPengirimanRepository
}

func NewTarifPengirimanUsecase(r repository.TarifPengirimanRepository) TarifPengirimanUsecase {
	return &tarifPengirimanUsecase{repo: r}
}

func (u *tarifPengirimanUsecase) GetAll() ([]entities.TarifPengiriman, error) {
	return u.repo.FindAll()
}

func (u *tarifPengirimanUsecase) GetByID(idTarifPengiriman int) (*entities.TarifPengiriman, error) {
	tp, err := u.repo.FindByID(idTarifPengiriman)
	if err != nil {
		return nil, err
	}
	if tp == nil {
		return nil, helper.TarifPengirimanNotFoundError(idTarifPengiriman)
	}
	return tp, nil
}

func (u *tarifPengirimanUsecase) Create(wilayah string, harga_per_kg int) (*entities.TarifPengiriman, error) {
	tp := &entities.TarifPengiriman{Wilayah: wilayah, HargaPerKg: harga_per_kg}
	err := u.repo.Create(tp)
	if err != nil {
		return nil, err
	}
	return tp, nil
}

func (u *tarifPengirimanUsecase) Update(idTarifPengiriman int, wilayah string, harga_per_kg int) (*entities.TarifPengiriman, error) {
	existing, err := u.repo.FindByID(idTarifPengiriman)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.TarifPengirimanNotFoundError(idTarifPengiriman)
	}
	existing.Wilayah = wilayah
	existing.HargaPerKg = harga_per_kg
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *tarifPengirimanUsecase) Delete(idTarifPengiriman int) error {
	existing, err := u.repo.FindByID(idTarifPengiriman)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.TarifPengirimanNotFoundError(idTarifPengiriman)
	}
	return u.repo.Delete(idTarifPengiriman)
}

func (u *tarifPengirimanUsecase) Search(keyword string) ([]entities.TarifPengiriman, error) {
	return u.repo.Search(keyword)
}
