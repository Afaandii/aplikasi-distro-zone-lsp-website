package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type FotoProdukUsecase interface {
	GetAll() ([]entities.FotoProduk, error)
	GetByID(idFotoProduk int) (*entities.FotoProduk, error)
	Create(id_produk int, url_foto string) (*entities.FotoProduk, error)
	Update(idFotoProduk int, id_produk int, url_foto string) (*entities.FotoProduk, error)
	Delete(idFotoProduk int) error
}

type fotoProdukUsecase struct {
	repo repository.FotoProdukRepository
}

func NewFotoProdukUsecase(r repository.FotoProdukRepository) FotoProdukUsecase {
	return &fotoProdukUsecase{repo: r}
}

func (u *fotoProdukUsecase) GetAll() ([]entities.FotoProduk, error) {
	return u.repo.FindAll()
}

func (u *fotoProdukUsecase) GetByID(idFotoProduk int) (*entities.FotoProduk, error) {
	fp, err := u.repo.FindByID(idFotoProduk)
	if err != nil {
		return nil, err
	}
	if fp == nil {
		return nil, helper.ProdukImageNotFoundError(idFotoProduk)
	}
	return fp, nil
}

func (u *fotoProdukUsecase) Create(id_produk int, url_foto string) (*entities.FotoProduk, error) {
	fp := &entities.FotoProduk{IDProduk: id_produk, UrlFoto: url_foto}
	err := u.repo.Create(fp)
	if err != nil {
		return nil, err
	}
	return fp, nil
}

func (u *fotoProdukUsecase) Update(idFotoProduk int, id_produk int, url_foto string) (*entities.FotoProduk, error) {
	existing, err := u.repo.FindByID(idFotoProduk)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.ProdukImageNotFoundError(idFotoProduk)
	}
	existing.IDProduk = id_produk
	existing.UrlFoto = url_foto
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *fotoProdukUsecase) Delete(idFotoProduk int) error {
	existing, err := u.repo.FindByID(idFotoProduk)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.ProdukImageNotFoundError(idFotoProduk)
	}
	return u.repo.Delete(idFotoProduk)
}
