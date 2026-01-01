package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

type UserUsecase interface {
	GetAll() ([]entities.User, error)
	GetCashiers() ([]entities.User, error)
	GetByID(idUser int) (*entities.User, error)
	Create(id_role int, nama string, username string, password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error)
	Update(idUser int, id_role int, nama string, username string, password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error)
	Delete(idUser int) error

	Login(username, password string) (*entities.User, string, error)
	Register(nama string, username string, password string, no_telp string) (*entities.User, error)
	UpdateAddress(idUser int, alamat string, kota string) (*entities.User, error)
	GetTransaksiByUser(idUser int) ([]entities.Transaksi, error)
	GetPesananByUser(idUser int) ([]entities.Pesanan, error)
	Search(keyword string) ([]entities.User, error)
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

func (u *userUsecase) GetCashiers() ([]entities.User, error) {
	// Role ID 2 is for Kasir (as shown in the database image)
	return u.repo.FindByRole(2)
}

func (u *userUsecase) Create(id_role int, nama string, username string, password string,
	nik string, alamat string, kota string, no_telp string, foto_profile string) (*entities.User, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	usr := &entities.User{
		RoleRef:     id_role,
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

	usr.RoleRef = id_role
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

func (u *userUsecase) Login(username, password string) (*entities.User, string, error) {
	user, err := u.repo.FindByUsername(username)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", helper.UserNotFoundError(username)
	}

	// Compare the provided password with the stored hash
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return nil, "", helper.InvalidCredentialsError()
	}

	var roleName string
	if user.Role.IDRole != 0 {
		roleName = user.Role.NamaRole
	} else {
		roleName = "User"
	}

	tokenString, err := jwt.GenerateToken(user.IDUser, user.Username, roleName)
	if err != nil {
		// Jika gagal buat token, return error
		return nil, "", err
	}

	// Jangan kirim password ke response
	user.Password = ""

	// Kembalikan user dan token
	return user, tokenString, nil
}

func (u *userUsecase) Register(nama string, username string, password string, no_telp string) (*entities.User, error) {
	// Check if username already exists
	existingUser, err := u.repo.FindByUsername(username)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, helper.UsernameAlreadyExistsError(username)
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create new user with default role (assuming role 2 is for regular users)
	user := &entities.User{
		RoleRef:  3,
		Nama:     nama,
		Username: username,
		Password: string(hashedPassword),
		NoTelp:   no_telp,
	}

	if err := u.repo.Register(user); err != nil {
		return nil, err
	}

	// Don't send password in response
	user.Password = ""
	return user, nil
}

func (u *userUsecase) UpdateAddress(
	idUser int,
	alamat string,
	kota string,
) (*entities.User, error) {

	user, err := u.repo.FindByID(idUser)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, helper.UserNotFoundError(idUser)
	}

	if alamat == "" || kota == "" {
		return nil, errors.New("alamat dan kota wajib diisi")
	}

	return u.repo.UpdateAddress(idUser, alamat, kota)
}

func (u *userUsecase) GetTransaksiByUser(idUser int) ([]entities.Transaksi, error) {
	return u.repo.GetTransaksiByUser(idUser)
}

func (u *userUsecase) GetPesananByUser(idUser int) ([]entities.Pesanan, error) {
	return u.repo.GetPesananByUser(idUser)
}

func (u *userUsecase) Search(keyword string) ([]entities.User, error) {
	if keyword == "" {
		return []entities.User{}, nil
	}
	return u.repo.Search(keyword)
}
