package helper

import (
	"fmt"
)

// NotFoundError adalah error yang digunakan ketika entitas tidak ditemukan
type NotFoundError struct {
	Entity string
	ID     interface{}
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
	RoleNotFoundError     = func(id interface{}) error { return NewNotFoundError("Role", id) }
	CustomerNotFoundError = func(id interface{}) error { return NewNotFoundError("Customer", id) }
	KaryawanNotFoundError = func(id interface{}) error { return NewNotFoundError("Karyawan", id) }
	MerkNotFoundError     = func(id interface{}) error { return NewNotFoundError("merk", id) }
	TipeNotFoundError     = func(id interface{}) error { return NewNotFoundError("tipe", id) }
	UkuranNotFoundError   = func(id interface{}) error { return NewNotFoundError("ukuran", id) }
	WarnaNotFoundError    = func(id interface{}) error { return NewNotFoundError("warna", id) }
)
