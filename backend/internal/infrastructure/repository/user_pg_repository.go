package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	repo "aplikasi-distro-zone-lsp-website/internal/domain/repository"
	"errors"

	"gorm.io/gorm"
)

type userPGRepository struct {
	db *gorm.DB
}

func NewUserPGRepository(db *gorm.DB) repo.UserRepository {
	return &userPGRepository{db: db}
}

func (r *userPGRepository) FindAll() ([]entities.User, error) {
	var list []entities.User
	if err := r.db.Preload("Role").Order("id_user").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *userPGRepository) FindByID(idUser int) (*entities.User, error) {
	var user entities.User
	err := r.db.
		Preload("Role").
		First(&user, "id_user = ?", idUser).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userPGRepository) FindByRole(roleID int) ([]entities.User, error) {
	var users []entities.User
	err := r.db.
		Preload("Role").
		Where("id_role = ?", roleID).
		Order("id_user").
		Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *userPGRepository) Create(c *entities.User) error {
	return r.db.Create(c).Error
}

func (r *userPGRepository) Update(c *entities.User) error {
	result := r.db.Model(&entities.User{}).
		Where("id_user = ?", c.IDUser).
		Updates(c)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *userPGRepository) Delete(idUser int) error {
	result := r.db.Delete(&entities.User{}, idUser)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *userPGRepository) FindByUsername(username string) (*entities.User, error) {
	var user entities.User
	err := r.db.
		Preload("Role").
		First(&user, "username = ?", username).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &user, nil
}

func (r *userPGRepository) Register(u *entities.User) error {
	return r.db.Create(u).Error
}

func (r *userPGRepository) UpdateAddress(
	idUser int,
	alamat string,
	kota string,
) (*entities.User, error) {

	result := r.db.Model(&entities.User{}).
		Where("id_user = ?", idUser).
		Updates(map[string]interface{}{
			"alamat": alamat,
			"kota":   kota,
		})

	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, errors.New("user tidak ditemukan")
	}

	var user entities.User
	if err := r.db.Preload("Role").
		First(&user, "id_user = ?", idUser).Error; err != nil {
		return nil, err
	}

	// jangan kirim password
	user.Password = ""

	return &user, nil
}

func (r *userPGRepository) GetTransaksiByUser(idUser int) ([]entities.Transaksi, error) {
	var transaksi []entities.Transaksi

	err := r.db.
		Preload("Customer").Preload("DetailTransaksi").Preload("DetailTransaksi.Produk").
		Where("id_customer = ?", idUser).
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}

func (r *userPGRepository) GetPesananByUser(idUser int) ([]entities.Pesanan, error) {
	var pesanan []entities.Pesanan

	err := r.db.
		Preload("Pemesan").Preload("DetailPesanan").Preload("DetailPesanan.Produk").
		Where("id_pemesan = ?", idUser).
		Order("created_at DESC").
		Find(&pesanan).Error

	return pesanan, err
}
