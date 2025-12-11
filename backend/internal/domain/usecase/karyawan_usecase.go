package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"

	"golang.org/x/crypto/bcrypt"
)

type KaryawanUsecase interface {
	GetAll() ([]entities.Karyawan, error)
	GetByID(idKaryawan int) (*entities.Karyawan, error)
	Create(id_role int, nama string, username string, password string, alamat string, no_telp string, nik string, foto_karyawan string) (*entities.Karyawan, error)
	Update(idKaryawan int, id_role int, nama string, username string, password string, alamat string, no_telp string, nik string, foto_karyawan string) (*entities.Karyawan, error)
	Delete(idKaryawan int) error
}

type karyawanUsecase struct {
	repo repository.KaryawanRepository
}

func NewkaryawanUsecase(r repository.KaryawanRepository) KaryawanUsecase {
	return &karyawanUsecase{repo: r}
}

func (u *karyawanUsecase) GetAll() ([]entities.Karyawan, error) {
	return u.repo.FindAll()
}

func (u *karyawanUsecase) GetByID(idKaryawan int) (*entities.Karyawan, error) {
	c, err := u.repo.FindByID(idKaryawan)
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, helper.KaryawanNotFoundError(idKaryawan)
	}
	return c, nil
}

func (u *karyawanUsecase) Create(id_role int, nama string, username string, password string,
	alamat string, no_telp string, nik string, foto_karyawan string) (*entities.Karyawan, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	k := &entities.Karyawan{
		IdRole:       id_role,
		Nama:         nama,
		Username:     username,
		Password:     string(hashedPassword),
		Alamat:       alamat,
		NoTelp:       no_telp,
		Nik:          nik,
		FotoKaryawan: foto_karyawan,
	}

	if err := u.repo.Create(k); err != nil {
		return nil, err
	}

	// Jangan kirim password ke response
	k.Password = ""

	return k, nil
}

func (u *karyawanUsecase) Update(id int, id_role int, nama string, username string,
	password string, alamat string, no_telp string, nik string, foto_karyawan string) (*entities.Karyawan, error) {

	k, err := u.repo.FindByID(id)
	if err != nil {
		return nil, err
	}
	if k == nil {
		return nil, helper.KaryawanNotFoundError(id)
	}

	k.IdRole = id_role
	k.Nama = nama
	k.Username = username
	k.Alamat = alamat
	k.NoTelp = no_telp
	k.Nik = nik

	if foto_karyawan != "" {
		k.FotoKaryawan = foto_karyawan
	}

	if password != "" {
		hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		k.Password = string(hashed)
	}

	err = u.repo.Update(k)
	if err != nil {
		return nil, err
	}

	k.Password = ""
	return k, nil
}

func (u *karyawanUsecase) Delete(idKaryawan int) error {
	existing, err := u.repo.FindByID(idKaryawan)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.KaryawanNotFoundError(idKaryawan)
	}
	return u.repo.Delete(idKaryawan)
}
