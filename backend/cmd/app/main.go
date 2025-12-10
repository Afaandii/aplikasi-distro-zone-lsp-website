package main

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	"aplikasi-distro-zone-lsp-website/internal/infrastructure/database"
	repo "aplikasi-distro-zone-lsp-website/internal/infrastructure/repository"
	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/internal/server"
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
	db.AutoMigrate(&entities.Role{})

	roleRepo := repo.NewRolePGRepository(db)
	roleUc := usecase.NewRoleUsecase(roleRepo)
	roleCtrl := controller.NewRoleController(roleUc)

	server.RegisterRoleRoutes(roleCtrl)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("Server is running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
