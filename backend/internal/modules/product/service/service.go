package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/product/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
)

// ==================== Produk Service ====================

type ProdukService interface {
	GetAll() ([]entity.Produk, error)
	GetByID(idProduk int) (*entity.Produk, error)
	Create(id_merk, id_tipe int, nama_kaos string, harga_jual, harga_pokok int, deskripsi, spesifikasi string) (*entity.Produk, error)
	Update(idProduk, id_merk, id_tipe int, nama_kaos string, harga_jual, harga_pokok int, deskripsi, spesifikasi string) (*entity.Produk, error)
	Delete(idProduk int) error
	GetProductDetailByID(idProduk int) (*entity.Produk, error)
	SearchByName(name string) ([]entity.Produk, error)
	SearchProdukForAdmin(keyword string) ([]entity.Produk, error)
}

type produkService struct{ repo repository.ProdukRepository }

func NewProdukService(r repository.ProdukRepository) ProdukService { return &produkService{repo: r} }

func (s *produkService) GetAll() ([]entity.Produk, error) { return s.repo.FindAll() }
func (s *produkService) SearchByName(n string) ([]entity.Produk, error) {
	return s.repo.SearchByName(n)
}
func (s *produkService) SearchProdukForAdmin(k string) ([]entity.Produk, error) {
	return s.repo.SearchProdukForAdmin(k)
}

func (s *produkService) GetByID(id int) (*entity.Produk, error) {
	p, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, helper.ProdukNotFoundError(id)
	}
	return p, nil
}

func (s *produkService) GetProductDetailByID(id int) (*entity.Produk, error) {
	p, err := s.repo.FindDetailByID(id)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, helper.ProdukNotFoundError(id)
	}
	return p, nil
}

func (s *produkService) Create(id_merk, id_tipe int, nama_kaos string, harga_jual, harga_pokok int, deskripsi, spesifikasi string) (*entity.Produk, error) {
	p := &entity.Produk{MerkRef: id_merk, TipeRef: id_tipe, NamaKaos: nama_kaos, HargaJual: harga_jual, HargaPokok: harga_pokok, Deskripsi: deskripsi, Spesifikasi: spesifikasi}
	if err := s.repo.Create(p); err != nil {
		return nil, err
	}
	return p, nil
}

func (s *produkService) Update(idProduk, id_merk, id_tipe int, nama_kaos string, harga_jual, harga_pokok int, deskripsi, spesifikasi string) (*entity.Produk, error) {
	existing, err := s.repo.FindByID(idProduk)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.ProdukNotFoundError(idProduk)
	}
	existing.MerkRef = id_merk
	existing.TipeRef = id_tipe
	existing.NamaKaos = nama_kaos
	existing.HargaJual = harga_jual
	existing.HargaPokok = harga_pokok
	existing.Deskripsi = deskripsi
	existing.Spesifikasi = spesifikasi
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *produkService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.ProdukNotFoundError(id)
	}
	return s.repo.Delete(id)
}

// ==================== Varian Service ====================

type VarianService interface {
	GetAll() ([]entity.Varian, error)
	GetByID(idVarian int) (*entity.Varian, error)
	Create(id_produk, id_ukuran, id_warna, stok_kaos int) (*entity.Varian, error)
	Update(idVarian, id_produk, id_ukuran, id_warna, stok_kaos int) (*entity.Varian, error)
	Delete(idVarian int) error
	Search(keyword string) ([]entity.Varian, error)
	GetAllByProduk(idProduk int) ([]entity.Varian, error)
	DeleteByProduk(idProduk int) error
}

type varianService struct{ repo repository.VarianRepository }

func NewVarianService(r repository.VarianRepository) VarianService { return &varianService{repo: r} }

func (s *varianService) GetAll() ([]entity.Varian, error)         { return s.repo.FindAll() }
func (s *varianService) Search(k string) ([]entity.Varian, error) { return s.repo.Search(k) }
func (s *varianService) GetAllByProduk(id int) ([]entity.Varian, error) {
	return s.repo.FindByProduk(id)
}
func (s *varianService) DeleteByProduk(id int) error { return s.repo.DeleteByProduk(id) }

func (s *varianService) GetByID(id int) (*entity.Varian, error) {
	v, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if v == nil {
		return nil, helper.VarianNotFoundError(id)
	}
	return v, nil
}

func (s *varianService) Create(id_produk, id_ukuran, id_warna, stok_kaos int) (*entity.Varian, error) {
	v := &entity.Varian{ProdukRef: id_produk, UkuranRef: id_ukuran, WarnaRef: id_warna, StokKaos: stok_kaos}
	if err := s.repo.Create(v); err != nil {
		return nil, err
	}
	return v, nil
}

func (s *varianService) Update(idVarian, id_produk, id_ukuran, id_warna, stok_kaos int) (*entity.Varian, error) {
	existing, err := s.repo.FindByID(idVarian)
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
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *varianService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.VarianNotFoundError(id)
	}
	return s.repo.Delete(id)
}

// ==================== FotoProduk Service ====================

type FotoProdukService interface {
	GetAll() ([]entity.FotoProduk, error)
	GetByID(idFotoProduk int) (*entity.FotoProduk, error)
	Create(id_produk, id_warna int, url_foto string) (*entity.FotoProduk, error)
	Update(idFotoProduk, id_produk, id_warna int, url_foto string) (*entity.FotoProduk, error)
	Delete(idFotoProduk int) error
	Search(keyword string) ([]entity.FotoProduk, error)
	GetAllByProduk(idProduk int) ([]entity.FotoProduk, error)
	DeleteByProduk(idProduk int) error
}

type fotoProdukService struct {
	repo repository.FotoProdukRepository
}

func NewFotoProdukService(r repository.FotoProdukRepository) FotoProdukService {
	return &fotoProdukService{repo: r}
}

func (s *fotoProdukService) GetAll() ([]entity.FotoProduk, error)         { return s.repo.FindAll() }
func (s *fotoProdukService) Search(k string) ([]entity.FotoProduk, error) { return s.repo.Search(k) }
func (s *fotoProdukService) GetAllByProduk(id int) ([]entity.FotoProduk, error) {
	return s.repo.FindByProduk(id)
}
func (s *fotoProdukService) DeleteByProduk(id int) error { return s.repo.DeleteByProduk(id) }

func (s *fotoProdukService) GetByID(id int) (*entity.FotoProduk, error) {
	fp, err := s.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if fp == nil {
		return nil, helper.ProdukImageNotFoundError(id)
	}
	return fp, nil
}

func (s *fotoProdukService) Create(id_produk, id_warna int, url_foto string) (*entity.FotoProduk, error) {
	fp := &entity.FotoProduk{ProdukRef: id_produk, WarnaRef: id_warna, UrlFoto: url_foto}
	if err := s.repo.Create(fp); err != nil {
		return nil, err
	}
	return fp, nil
}

func (s *fotoProdukService) Update(idFotoProduk, id_produk, id_warna int, url_foto string) (*entity.FotoProduk, error) {
	existing, err := s.repo.FindByID(idFotoProduk)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.ProdukImageNotFoundError(idFotoProduk)
	}
	existing.ProdukRef = id_produk
	existing.WarnaRef = id_warna
	existing.UrlFoto = url_foto
	if err := s.repo.Update(existing); err != nil {
		return nil, err
	}
	return existing, nil
}

func (s *fotoProdukService) Delete(id int) error {
	existing, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.ProdukImageNotFoundError(id)
	}
	return s.repo.Delete(id)
}
