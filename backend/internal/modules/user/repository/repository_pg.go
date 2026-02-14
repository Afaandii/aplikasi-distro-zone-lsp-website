package repository

import (
	"aplikasi-distro-zone-lsp-website/internal/shared/entity"
	"errors"

	"gorm.io/gorm"
)

// ==================== User PG Repository ====================

type userPGRepository struct {
	db *gorm.DB
}

func NewUserPGRepository(db *gorm.DB) UserRepository {
	return &userPGRepository{db: db}
}

func (r *userPGRepository) FindAll() ([]entity.User, error) {
	var list []entity.User
	if err := r.db.Preload("Role").Order("id_user").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *userPGRepository) FindByID(idUser int) (*entity.User, error) {
	var user entity.User
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

func (r *userPGRepository) FindByRole(roleID int) ([]entity.User, error) {
	var users []entity.User
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

func (r *userPGRepository) Create(c *entity.User) error {
	return r.db.Create(c).Error
}

func (r *userPGRepository) Update(c *entity.User) error {
	result := r.db.Model(&entity.User{}).
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
	result := r.db.Delete(&entity.User{}, idUser)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

func (r *userPGRepository) FindByUsername(username string) (*entity.User, error) {
	var user entity.User
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

func (r *userPGRepository) Register(u *entity.User) error {
	return r.db.Create(u).Error
}

func (r *userPGRepository) UpdateAddress(
	idUser int,
	alamat string,
	kota string,
) (*entity.User, error) {

	result := r.db.Model(&entity.User{}).
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

	var user entity.User
	if err := r.db.Preload("Role").
		First(&user, "id_user = ?", idUser).Error; err != nil {
		return nil, err
	}

	// jangan kirim password
	user.Password = ""

	return &user, nil
}

func (r *userPGRepository) GetTransaksiByUser(idUser int) ([]entity.Transaksi, error) {
	var transaksi []entity.Transaksi

	err := r.db.
		Preload("Customer").Preload("DetailTransaksi").Preload("DetailTransaksi.Produk").
		Where("id_customer = ?", idUser).
		Order("created_at DESC").
		Find(&transaksi).Error

	return transaksi, err
}

func (r *userPGRepository) GetPesananByUser(idUser int) ([]entity.Pesanan, error) {
	var pesanan []entity.Pesanan

	err := r.db.
		Preload("Pemesan").Preload("DetailPesanan").Preload("DetailPesanan.Produk").
		Where("id_pemesan = ?", idUser).
		Order("created_at DESC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *userPGRepository) Search(keyword string) ([]entity.User, error) {
	var users []entity.User
	searchQuery := "%" + keyword + "%"

	err := r.db.
		Preload("Role").
		Where("nama ILIKE ? OR username ILIKE ? OR nik ILIKE ?", searchQuery, searchQuery, searchQuery).
		Order("id_user ASC").
		Find(&users).Error

	if err != nil {
		return nil, err
	}
	return users, nil
}

// ==================== Role PG Repository ====================

type rolePGRepository struct {
	db *gorm.DB
}

func NewRolePGRepository(db *gorm.DB) RoleRepository {
	return &rolePGRepository{db: db}
}

func (r *rolePGRepository) FindAll() ([]entity.Role, error) {
	var list []entity.Role
	if err := r.db.Preload("Users").Order("id_role").Find(&list).Error; err != nil {
		return nil, err
	}
	return list, nil
}

func (r *rolePGRepository) FindByID(idRole int) (*entity.Role, error) {
	var rol entity.Role
	if err := r.db.First(&rol, idRole).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &rol, nil
}

func (r *rolePGRepository) Create(c *entity.Role) error {
	return r.db.Create(c).Error
}

func (r *rolePGRepository) Update(c *entity.Role) error {
	result := r.db.Model(&entity.Role{}).
		Where("id_role = ?", c.IDRole).
		Updates(map[string]interface{}{
			"nama_role":  c.NamaRole,
			"keterangan": c.Keterangan,
		})
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return errors.New("no rows updated")
	}

	return nil
}

func (r *rolePGRepository) Delete(idRole int) error {
	result := r.db.Delete(&entity.Role{}, idRole)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("no rows deleted")
	}
	return nil
}

// ==================== Admin PG Repository ====================

type adminPgRepository struct {
	db *gorm.DB
}

func NewAdminPgRepository(db *gorm.DB) AdminRepository {
	return &adminPgRepository{db: db}
}

func (r *adminPgRepository) FindPesananDiproses() ([]entity.Pesanan, error) {
	var pesanan []entity.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?",
			"diproses").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) FindPesananDikemas() ([]entity.Pesanan, error) {
	var pesanan []entity.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?", "dikemas").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) FindPesananDikirim() ([]entity.Pesanan, error) {
	var pesanan []entity.Pesanan

	err := r.db.
		Preload("Pemesan").
		Where("status_pesanan = ?", "dikirim").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *adminPgRepository) UpdateStatusPesananAdmin(
	kodePesanan string,
	fromStatus string,
	toStatus string,
	adminID int,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
		    updated_at = NOW()
		WHERE kode_pesanan = $2
		  AND status_pesanan = $3
	`, toStatus, kodePesanan, fromStatus)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}

func (r *adminPgRepository) InsertTransaksiFromPesanan(
	kodePesanan string,
) error {

	tx := r.db.Begin()
	if tx.Error != nil {
		return tx.Error
	}

	var transaksiID int

	// Insert transaksi
	err := tx.Raw(`
		INSERT INTO transaksi (
			id_customer,
			id_kasir,
			kode_transaksi,
			total,
			metode_pembayaran,
			status_transaksi,
			created_at
		)
		SELECT
			p.id_pemesan,
			p.diverifikasi_oleh,
			'TRX-' || p.kode_pesanan,
			p.total_bayar,
			p.metode_pembayaran,
			'selesai',
			NOW()
		FROM pesanan p
		WHERE p.kode_pesanan = $1
		  AND p.diverifikasi_oleh IS NOT NULL
		RETURNING id_transaksi
	`, kodePesanan).Scan(&transaksiID).Error

	if err != nil {
		tx.Rollback()
		return err
	}

	// Insert detail_transaksi
	err = tx.Exec(`
		INSERT INTO detail_transaksi (
			id_transaksi,
			id_produk,
			jumlah,
			harga_satuan,
			subtotal,
			created_at
		)
		SELECT
			$1,
			dp.id_produk,
			dp.jumlah,
			dp.harga_satuan,
			dp.total,
			NOW()
		FROM detail_pesanan dp
		JOIN pesanan p ON p.id_pesanan = dp.id_pesanan
		WHERE p.kode_pesanan = $2
	`, transaksiID, kodePesanan).Error

	if err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// ==================== Kasir PG Repository ====================

type kasirPgRepository struct {
	db *gorm.DB
}

func NewKasirPgRepository(db *gorm.DB) KasirRepository {
	return &kasirPgRepository{db: db}
}

func (r *kasirPgRepository) FindMenungguVerifikasi() ([]entity.Pesanan, error) {
	var pesanan []entity.Pesanan

	err := r.db.Preload("Pemesan").
		Where("status_pembayaran = ? AND status_pesanan = ?", "paid", "menunggu_verifikasi_kasir").
		Order("created_at ASC").
		Find(&pesanan).Error

	return pesanan, err
}

func (r *kasirPgRepository) UpdateVerifikasiKasir(
	kodePesanan string,
	statusPesanan string,
	kasirID int,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
		    diverifikasi_oleh = $2,
				verifikasi_pada = NOW(),
		    updated_at = NOW()
		WHERE kode_pesanan = $3
		  AND status_pembayaran = 'paid'
		  AND status_pesanan = 'menunggu_verifikasi_kasir'
	`, statusPesanan, kasirID, kodePesanan)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}

func (r *kasirPgRepository) UpdatePesananCustomer(
	kodePesanan string,
	statusPesanan string,
) error {

	result := r.db.Exec(`
		UPDATE pesanan
		SET status_pesanan = $1,
				verifikasi_pada = NOW(),
		    updated_at = NOW()
		WHERE kode_pesanan = $2
		  AND status_pembayaran = 'paid'
		  AND status_pesanan IN ('diproses', 'menunggu_verifikasi_kasir')
	`, statusPesanan, kodePesanan)

	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}

	return result.Error
}
