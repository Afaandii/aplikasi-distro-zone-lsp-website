package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

type ProdukUsecase interface {
	GetAll() ([]entities.Produk, error)
	GetByID(idProduk int) (*entities.Produk, error)
	Create(id_merk int, id_tipe int, id_ukuran int, id_warna int, nama_kaos string, harga_jual int, harga_pokok int, stok_kaos int) (*entities.Produk, error)
	Update(idProduk int, id_merk int, id_tipe int, id_ukuran int, id_warna int, nama_kaos string, harga_jual int, harga_pokok int, stok_kaos int) (*entities.Produk, error)
	Delete(idProduk int) error
}

type produkUsecase struct {
	repo repository.ProdukRepository
}

func NewProdukUsecase(r repository.ProdukRepository) ProdukUsecase {
	return &produkUsecase{repo: r}
}

func (u *produkUsecase) GetAll() ([]entities.Produk, error) {
	return u.repo.FindAll()
}

func (u *produkUsecase) GetByID(idProduk int) (*entities.Produk, error) {
	p, err := u.repo.FindByID(idProduk)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, helper.ProdukNotFoundError(idProduk)
	}
	return p, nil
}

func (u *produkUsecase) Create(id_merk int, id_tipe int, id_ukuran int, id_warna int, nama_kaos string, harga_jual int, harga_pokok int, stok_kaos int) (*entities.Produk, error) {
	p := &entities.Produk{
		IdMerk:     id_merk,
		IdTipe:     id_tipe,
		IdUkuran:   id_ukuran,
		IdWarna:    id_warna,
		NamaKaos:   nama_kaos,
		HargaJual:  harga_jual,
		HargaPokok: harga_pokok,
		StokKaos:   stok_kaos,
	}
	err := u.repo.Create(p)
	if err != nil {
		return nil, err
	}
	return p, nil
}

func (u *produkUsecase) Update(idProduk int, id_merk int, id_tipe int, id_ukuran int, id_warna int, nama_kaos string, harga_jual int, harga_pokok int, stok_kaos int) (*entities.Produk, error) {
	existing, err := u.repo.FindByID(idProduk)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.ProdukNotFoundError(idProduk)
	}
	existing.IdMerk = id_merk
	existing.IdTipe = id_tipe
	existing.IdUkuran = id_ukuran
	existing.IdWarna = id_warna
	existing.NamaKaos = nama_kaos
	existing.HargaJual = harga_jual
	existing.HargaPokok = harga_pokok
	existing.StokKaos = stok_kaos
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}
	return existing, nil
}

func (u *produkUsecase) Delete(idProduk int) error {
	existing, err := u.repo.FindByID(idProduk)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.ProdukNotFoundError(idProduk)
	}
	return u.repo.Delete(idProduk)
}
