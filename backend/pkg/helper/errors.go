package helper

import (
	"fmt"
)

// NotFoundError adalah error yang digunakan ketika entitas tidak ditemukan
type NotFoundError struct {
	Entity string
	ID     interface{}
}

type ConflictError struct {
	Message string
}

func (e *ConflictError) Error() string {
	return e.Message
}

type AuthenticationError struct {
	Message string
}

func (e *AuthenticationError) Error() string {
	return e.Message
}

// Error mengimplementasikan interface error
func (e *NotFoundError) Error() string {
	if e.ID != nil {
		return fmt.Sprintf("%s with id %v not found", e.Entity, e.ID)
	}
	return fmt.Sprintf("%s not found", e.Entity)
}

// NewNotFoundError membuat instance baru dari NotFoundError
func NewNotFoundError(entity string, id interface{}) error {
	return &NotFoundError{
		Entity: entity,
		ID:     id,
	}
}

// Predefined errors for common entities
var (
	RoleNotFoundError            = func(id interface{}) error { return NewNotFoundError("Role", id) }
	UserNotFoundError            = func(id interface{}) error { return NewNotFoundError("user", id) }
	CustomerNotFoundError        = func(id interface{}) error { return NewNotFoundError("Customer", id) }
	KaryawanNotFoundError        = func(id interface{}) error { return NewNotFoundError("Karyawan", id) }
	MerkNotFoundError            = func(id interface{}) error { return NewNotFoundError("merk", id) }
	TipeNotFoundError            = func(id interface{}) error { return NewNotFoundError("tipe", id) }
	UkuranNotFoundError          = func(id interface{}) error { return NewNotFoundError("ukuran", id) }
	WarnaNotFoundError           = func(id interface{}) error { return NewNotFoundError("warna", id) }
	ProdukNotFoundError          = func(id interface{}) error { return NewNotFoundError("produk", id) }
	ProdukImageNotFoundError     = func(id interface{}) error { return NewNotFoundError("produk image", id) }
	JamOperasionalNotFoundError  = func(id interface{}) error { return NewNotFoundError("jam operasional image", id) }
	TarifPengirimanNotFoundError = func(id interface{}) error { return NewNotFoundError("tarif pengiriman image", id) }
	UsernameAlreadyExistsError   = func(username string) error { return NewNotFoundError("username already exists", username) }
	InvalidCredentialsError      = func() error { return fmt.Errorf("invalid username or password") }
)
