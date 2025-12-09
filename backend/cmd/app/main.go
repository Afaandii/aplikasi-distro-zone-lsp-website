package main

import (
	"aplikasi-distro-zone-lsp-website/backend/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/backend/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/backend/internal/infrastructure/database"
	repo "aplikasi-distro-zone-lsp-website/backend/internal/infrastructure/repository"
	"aplikasi-distro-zone-lsp-website/backend/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/backend/internal/server"
	"fmt"
	"log"
	"net/http"
	"os"
)

func main() {
	db, err := database.ConnPostgre()
	if err != nil {
		log.Fatal("db connect:", err)
	}

	// auto generate jika belum ada table didatabase
	db.AutoMigrate(&entities.Category{}, &entities.Merk{})

	categoryRepo := repo.NewCategoryPGRepository(db)
	categoryUc := usecase.NewCategoryUsecase(categoryRepo)
	categoryCtrl := controller.NewCategoryController(categoryUc)
	merkRepo := repo.NewMerkPGRepository(db)
	merkUc := usecase.NewMerkUsecase(merkRepo)
	merkCtrl := controller.NewMerkController(merkUc)

	server.RegisterCategoryRoutes(categoryCtrl)
	server.RegisterMerkRoutes(merkCtrl)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
