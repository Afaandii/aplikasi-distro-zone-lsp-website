package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"

	"golang.org/x/crypto/bcrypt"
)

type UserUsecase interface {
	GetAll() ([]entities.User, error)
	GetByID(idUser int) (*entities.User, error)
	Create(id_role int, nama string, username string, password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error)
	Update(idUser int, id_role int, nama string, username string, password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error)
	Delete(idUser int) error
}

type userUsecase struct {
	repo repository.UserRepository
}

func NewUserUsecase(r repository.UserRepository) UserUsecase {
	return &userUsecase{repo: r}
}

func (u *userUsecase) GetAll() ([]entities.User, error) {
	return u.repo.FindAll()
}

func (u *userUsecase) GetByID(idUser int) (*entities.User, error) {
	usr, err := u.repo.FindByID(idUser)
	if err != nil {
		return nil, err
	}
	if usr == nil {
		return nil, helper.UserNotFoundError(idUser)
	}
	return usr, nil
}

func (u *userUsecase) Create(id_role int, nama string, username string, password string,
	nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	usr := &entities.User{
		IdRole:      id_role,
		Nama:        nama,
		Username:    username,
		Password:    string(hashedPassword),
		Nik:         nik,
		Alamat:      alamat,
		Kota:        kota,
		NoTelp:      no_telp,
		FotoProfile: foto_profile,
	}

	if err := u.repo.Create(usr); err != nil {
		return nil, err
	}

	// Jangan kirim password ke response
	usr.Password = ""

	return usr, nil
}

func (u *userUsecase) Update(idUser int, id_role int, nama string, username string,
	password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error) {

	usr, err := u.repo.FindByID(idUser)
	if err != nil {
		return nil, err
	}
	if usr == nil {
		return nil, helper.UserNotFoundError(idUser)
	}

	usr.IdRole = id_role
	usr.Nama = nama
	usr.Username = username
	usr.Alamat = alamat
	usr.NoTelp = no_telp
	usr.Nik = nik

	if foto_profile != "" {
		usr.FotoProfile = foto_profile
	}

	if password != "" {
		hashed, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		usr.Password = string(hashed)
	}

	err = u.repo.Update(usr)
	if err != nil {
		return nil, err
	}

	usr.Password = ""
	return usr, nil
}

func (u *userUsecase) Delete(idUser int) error {
	existing, err := u.repo.FindByID(idUser)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.UserNotFoundError(idUser)
	}
	return u.repo.Delete(idUser)
}
