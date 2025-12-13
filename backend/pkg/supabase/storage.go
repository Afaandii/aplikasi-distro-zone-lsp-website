package supabase

import (
	"bytes"
	"fmt"
	"net/url"
	"os"
	"strings"

	storage_go "github.com/supabase-community/storage-go"
)

var StorageClient *storage_go.Client

func InitStorage() {
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_KEY")

	if url == "" || key == "" {
		panic("SUPABASE_URL atau SUPABASE_KEY tidak ditemukan")
	}

	StorageClient = storage_go.NewClient(url+"/storage/v1", key, nil)
}

func ptr[T any](v T) *T {
	return &v
}

func UploadUserPhoto(filename string, fileBytes []byte) (string, error) {
	bucket := os.Getenv("SUPABASE_BUCKET_USER")
	if bucket == "" {
		return "", fmt.Errorf("SUPABASE_BUCKET_USER tidak ditemukan")
	}

	// Content-Type
	contentType := "application/octet-stream"
	if strings.HasSuffix(filename, ".jpg") || strings.HasSuffix(filename, ".jpeg") {
		contentType = "image/jpeg"
	}
	if strings.HasSuffix(filename, ".png") {
		contentType = "image/png"
	}

	options := storage_go.FileOptions{
		ContentType: ptr(contentType),
		Upsert:      ptr(true),
	}

	_, err := StorageClient.UploadFile(
		bucket,
		filename,
		bytes.NewReader(fileBytes),
		options,
	)

	if err != nil {
		return "", fmt.Errorf("upload gagal: %w", err)
	}

	publicURL := fmt.Sprintf(
		"%s/storage/v1/object/public/%s/%s",
		os.Getenv("SUPABASE_URL"),
		bucket,
		filename,
	)

	return publicURL, nil
}

func DeleteUserPhoto(photoURL string) error {
	bucket := os.Getenv("SUPABASE_BUCKET_USER")
	if bucket == "" {
		return fmt.Errorf("SUPABASE_BUCKET_USER tidak ditemukan")
	}

	u, err := url.Parse(photoURL)
	if err != nil {
		return fmt.Errorf("gagal parse URL: %w", err)
	}

	path := u.Path
	prefix := fmt.Sprintf("/storage/v1/object/public/%s/", bucket)
	if !strings.HasPrefix(path, prefix) {
		return fmt.Errorf("URL format tidak valid untuk bucket ini")
	}

	// Dapatkan nama file dengan menghapus prefix
	filename := strings.TrimPrefix(path, prefix)

	// Method ini membutuhkan bucket dan slice of string untuk nama file
	_, err = StorageClient.RemoveFile(bucket, []string{filename})
	if err != nil {
		return fmt.Errorf("gagal menghapus file: %w", err)
	}

	return nil
}

func UploadProductPhoto(filename string, fileBytes []byte) (string, error) {
	bucket := os.Getenv("SUPABASE_BUCKET_PRODUCT")
	if bucket == "" {
		bucket = os.Getenv("SUPABASE_BUCKET_USER")
		if bucket == "" {
			return "", fmt.Errorf("SUPABASE_BUCKET_USER tidak ditemukan")
		}
	}

	// Content-Type
	contentType := "application/octet-stream"
	if strings.HasSuffix(filename, ".jpg") || strings.HasSuffix(filename, ".jpeg") {
		contentType = "image/jpeg"
	}
	if strings.HasSuffix(filename, ".png") {
		contentType = "image/png"
	}

	options := storage_go.FileOptions{
		ContentType: ptr(contentType),
		Upsert:      ptr(true),
	}

	_, err := StorageClient.UploadFile(
		bucket,
		filename,
		bytes.NewReader(fileBytes),
		options,
	)

	if err != nil {
		return "", fmt.Errorf("upload gagal: %w", err)
	}

	publicURL := fmt.Sprintf(
		"%s/storage/v1/object/public/%s/%s",
		os.Getenv("SUPABASE_URL"),
		bucket,
		filename,
	)

	return publicURL, nil
}
