package usecase

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"aplikasi-distro-zone-lsp-website/pkg/helper"

	"golang.org/x/crypto/bcrypt"
)

type CustomerUsecase interface {
	GetAll() ([]entities.Customer, error)
	GetByID(idCustomer int) (*entities.Customer, error)
	Create(username string, email string, password string, alamat string, kota string, noTelp string) (*entities.Customer, error)
	Update(idCustomer int, username string, email string, password string, alamat string, kota string, noTelp string) (*entities.Customer, error)
	Delete(idCustomer int) error
}

type customerUsecase struct {
	repo repository.CustomerRepository
}

func NewCustomerUsecase(r repository.CustomerRepository) CustomerUsecase {
	return &customerUsecase{repo: r}
}

func (u *customerUsecase) GetAll() ([]entities.Customer, error) {
	return u.repo.FindAll()
}

func (u *customerUsecase) GetByID(idCustomer int) (*entities.Customer, error) {
	c, err := u.repo.FindByID(idCustomer)
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, helper.CustomerNotFoundError(idCustomer)
	}
	return c, nil
}

func (u *customerUsecase) Create(username string, email string, password string, alamat string, kota string, noTelp string) (*entities.Customer, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Buat entity customer baru dengan password yang sudah di-hash
	customer := &entities.Customer{
		Username: username,
		Email:    email,
		Password: string(hashedPassword),
		Alamat:   alamat,
		Kota:     kota,
		NoTelp:   noTelp,
	}

	err = u.repo.Create(customer)
	if err != nil {
		return nil, err
	}

	// Hapus password dari response untuk keamanan
	customer.Password = ""
	return customer, nil
}

func (u *customerUsecase) Update(idCustomer int, username string, email string, password string, alamat string, kota string, noTelp string) (*entities.Customer, error) {
	existing, err := u.repo.FindByID(idCustomer)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, helper.CustomerNotFoundError(idCustomer)
	}

	// Update field-field yang ada
	existing.Username = username
	existing.Email = email
	existing.Alamat = alamat
	existing.Kota = kota
	existing.NoTelp = noTelp

	// Jika password baru diberikan (tidak kosong), hash dan update
	if password != "" {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		existing.Password = string(hashedPassword)
	}

	// Simpan perubahan ke repository
	err = u.repo.Update(existing)
	if err != nil {
		return nil, err
	}

	// Hapus password dari response untuk keamanan
	existing.Password = ""
	return existing, nil
}

func (u *customerUsecase) Delete(idCustomer int) error {
	existing, err := u.repo.FindByID(idCustomer)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.CustomerNotFoundError(idCustomer)
	}
	return u.repo.Delete(idCustomer)
}
