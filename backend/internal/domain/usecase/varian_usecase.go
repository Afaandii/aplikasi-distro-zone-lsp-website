package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type VarianUsecase interface {
	GetAll() ([]entities.Varian, error)
	GetByID(idVarian int) (*entities.Varian, error)
	Create(id_produk int, id_ukuran int, id_warna int, stok_kaos int) (*entities.Varian, error)
	Update(idVarian int, id_produk int, id_ukuran int, id_warna int, stok_kaos int) (*entities.Varian, error)
	Delete(idVarian int) error
}

type varianUsecase struct {
	repo repository.VarianRepository
}

func NewVarianUsecase(r repository.VarianRepository) VarianUsecase {
	return &varianUsecase{repo: r}
}

func (u *varianUsecase) GetAll() ([]entities.Varian, error) {
	return u.repo.FindAll()
}

func (u *varianUsecase) GetByID(idVarian int) (*entities.Varian, error) {
	p, err := u.repo.FindByID(idVarian)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, helper.VarianNotFoundError(idVarian)
	}
	return p, nil
}

func (u *varianUsecase) Create(id_produk int, id_ukuran int, id_warna int, stok_kaos int) (*entities.Varian, error) {
	v := &entities.Varian{
		ProdukRef: id_produk,
		UkuranRef: id_ukuran,
		WarnaRef:  id_warna,
		StokKaos:  stok_kaos,
	}
	err := u.repo.Create(v)
	if err != nil {
		return nil, err
	}
	return v, nil
}

func (u *varianUsecase) Update(idVarian int, id_produk int, id_ukuran int, id_warna int, stok_kaos int) (*entities.Varian, error) {
	existing, err := u.repo.FindByID(idVarian)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.VarianNotFoundError(idVarian)
	}
	existing.ProdukRef = id_produk
	existing.UkuranRef = id_ukuran
	existing.WarnaRef = id_warna
	existing.StokKaos = stok_kaos
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *varianUsecase) Delete(idVarian int) error {
	existing, err := u.repo.FindByID(idVarian)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.VarianNotFoundError(idVarian)
	}
	return u.repo.Delete(idVarian)
}
