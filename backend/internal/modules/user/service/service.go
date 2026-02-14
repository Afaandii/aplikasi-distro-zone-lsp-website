package service

import (
	"aplikasi-distro-zone-lsp-website/internal/modules/user/repository"
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"aplikasi-distro-zone-lsp-website/pkg/helper"
	"aplikasi-distro-zone-lsp-website/pkg/jwt"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

// ==================== User Service ====================

type UserService interface {
	GetAll() ([]entity.User, error)
	GetCashiers() ([]entity.User, error)
	GetByID(idUser int) (*entity.User, error)
	Create(id_role int, nama string, username string, password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entity.User, error)
	Update(idUser int, id_role int, nama string, username string, password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entity.User, error)
	Delete(idUser int) error

	Login(username, password string, rememberMe bool) (*entity.User, string, error)
	Register(nama string, username string, password string, no_telp string) (*entity.User, error)
	UpdateAddress(idUser int, alamat string, kota string) (*entity.User, error)
	GetTransaksiByUser(idUser int) ([]entity.Transaksi, error)
	GetPesananByUser(idUser int) ([]entity.Pesanan, error)
	Search(keyword string) ([]entity.User, error)
}

type userService struct {
	repo repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{repo: r}
}

func (u *userService) GetAll() ([]entity.User, error) {
	return u.repo.FindAll()
}

func (u *userService) GetByID(idUser int) (*entity.User, error) {
	usr, err := u.repo.FindByID(idUser)
	if err != nil {
		return nil, err
	}
	if usr == nil {
		return nil, helper.UserNotFoundError(idUser)
	}
	return usr, nil
}

func (u *userService) GetCashiers() ([]entity.User, error) {
	return u.repo.FindByRole(2)
}

func (u *userService) Create(id_role int, nama string, username string, password string,
	nik string, alamat string, kota string, no_telp string, foto_profile string) (*entity.User, error) {

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	usr := &entity.User{
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

	usr.Password = ""

	return usr, nil
}

func (u *userService) Update(idUser int, id_role int, nama string, username string,
	password string, nik string, alamat string, kota string, no_telp string, foto_profile string) (*entity.User, error) {

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

func (u *userService) Delete(idUser int) error {
	existing, err := u.repo.FindByID(idUser)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.UserNotFoundError(idUser)
	}
	return u.repo.Delete(idUser)
}

func (u *userService) Login(username, password string, rememberMe bool) (*entity.User, string, error) {
	user, err := u.repo.FindByUsername(username)
	if err != nil {
		return nil, "", err
	}
	if user == nil {
		return nil, "", helper.UserNotFoundError(username)
	}

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

	tokenString, err := jwt.GenerateToken(user.IDUser, user.Username, roleName, rememberMe)
	if err != nil {
		return nil, "", err
	}

	user.Password = ""

	return user, tokenString, nil
}

func (u *userService) Register(nama string, username string, password string, no_telp string) (*entity.User, error) {
	existingUser, err := u.repo.FindByUsername(username)
	if err != nil {
		return nil, err
	}
	if existingUser != nil {
		return nil, helper.UsernameAlreadyExistsError(username)
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &entity.User{
		RoleRef:  3,
		Nama:     nama,
		Username: username,
		Password: string(hashedPassword),
		NoTelp:   no_telp,
	}

	if err := u.repo.Register(user); err != nil {
		return nil, err
	}

	user.Password = ""
	return user, nil
}

func (u *userService) UpdateAddress(
	idUser int,
	alamat string,
	kota string,
) (*entity.User, error) {

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

func (u *userService) GetTransaksiByUser(idUser int) ([]entity.Transaksi, error) {
	return u.repo.GetTransaksiByUser(idUser)
}

func (u *userService) GetPesananByUser(idUser int) ([]entity.Pesanan, error) {
	return u.repo.GetPesananByUser(idUser)
}

func (u *userService) Search(keyword string) ([]entity.User, error) {
	if keyword == "" {
		return []entity.User{}, nil
	}
	return u.repo.Search(keyword)
}

// ==================== Role Service ====================

type RoleService interface {
	GetAll() ([]entity.Role, error)
	GetByID(idRole int) (*entity.Role, error)
	Create(nama_role string, keterangan string) (*entity.Role, error)
	Update(idRole int, nama_role string, keterangan string) (*entity.Role, error)
	Delete(idRole int) error
}

type roleService struct {
	repo repository.RoleRepository
}

func NewRoleService(r repository.RoleRepository) RoleService {
	return &roleService{repo: r}
}

func (u *roleService) GetAll() ([]entity.Role, error) {
	return u.repo.FindAll()
}

func (u *roleService) GetByID(idRole int) (*entity.Role, error) {
	r, err := u.repo.FindByID(idRole)
	if err != nil {
		return nil, err
	}
	if r == nil {
		return nil, helper.RoleNotFoundError(idRole)
	}
	return r, nil
}

func (u *roleService) Create(nama_role string, keterangan string) (*entity.Role, error) {
	r := &entity.Role{NamaRole: nama_role, Keterangan: keterangan}
	err := u.repo.Create(r)
	if err != nil {
		return nil, err
	}
	return r, nil
}

func (u *roleService) Update(idRole int, nama_role string, keterangan string) (*entity.Role, error) {
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

func (u *roleService) Delete(idRole int) error {
	existing, err := u.repo.FindByID(idRole)
	if err != nil {
		return err
	}
	if existing == nil {
		return helper.RoleNotFoundError(idRole)
	}
	return u.repo.Delete(idRole)
}

// ==================== Admin Service ====================

type AdminService struct {
	AdminRepo repository.AdminRepository
}

func NewAdminService(r repository.AdminRepository) *AdminService {
	return &AdminService{AdminRepo: r}
}

func (uc *AdminService) GetPesananDiproses() ([]entity.Pesanan, error) {
	return uc.AdminRepo.FindPesananDiproses()
}

func (uc *AdminService) GetPesananDikemas() ([]entity.Pesanan, error) {
	return uc.AdminRepo.FindPesananDikemas()
}

func (uc *AdminService) GetPesananDikirim() ([]entity.Pesanan, error) {
	return uc.AdminRepo.FindPesananDikirim()
}

func (uc *AdminService) SetPesananDikemas(kode string, adminID int) error {
	return uc.AdminRepo.UpdateStatusPesananAdmin(
		kode,
		"diproses",
		"dikemas",
		adminID,
	)
}

func (uc *AdminService) SetPesananDikirim(kode string, adminID int) error {
	return uc.AdminRepo.UpdateStatusPesananAdmin(
		kode,
		"dikemas",
		"dikirim",
		adminID,
	)
}

func (uc *AdminService) SetPesananSelesai(kode string, adminID int) error {
	if err := uc.AdminRepo.UpdateStatusPesananAdmin(
		kode,
		"dikirim",
		"selesai",
		adminID,
	); err != nil {
		return err
	}

	if err := uc.AdminRepo.InsertTransaksiFromPesanan(
		kode,
	); err != nil {
		return err
	}

	return nil
}

// ==================== Kasir Service ====================

type KasirService struct {
	KasirRepo repository.KasirRepository
}

func NewKasirService(r repository.KasirRepository) *KasirService {
	return &KasirService{KasirRepo: r}
}

func (u *KasirService) GetPesananMenungguVerifikasi() ([]entity.Pesanan, error) {
	return u.KasirRepo.FindMenungguVerifikasi()
}

func (u *KasirService) SetujuiPesanan(kodePesanan string, kasirID int) error {
	if kodePesanan == "" {
		return errors.New("kode pesanan tidak boleh kosong")
	}

	return u.KasirRepo.UpdateVerifikasiKasir(
		kodePesanan,
		"diproses",
		kasirID,
	)
}

func (u *KasirService) TolakPesanan(kodePesanan string, kasirID int) error {
	if kodePesanan == "" {
		return errors.New("kode pesanan tidak boleh kosong")
	}

	return u.KasirRepo.UpdateVerifikasiKasir(
		kodePesanan,
		"dibatalkan",
		kasirID,
	)
}

func (u *KasirService) TolakPesananCustomer(kodePesanan string, kasirID int) error {
	if kodePesanan == "" {
		return errors.New("kode pesanan tidak boleh kosong")
	}

	return u.KasirRepo.UpdatePesananCustomer(
		kodePesanan,
		"dibatalkan",
	)
}
