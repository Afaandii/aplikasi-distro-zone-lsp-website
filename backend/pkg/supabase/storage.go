package supabase

import (
	"bytes"
	"fmt"
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
