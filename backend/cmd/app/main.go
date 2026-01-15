package main

import (
	"log"
	"net/http"
	"os"

	"aplikasi-distro-zone-lsp-website/internal/bootstrap"
	"aplikasi-distro-zone-lsp-website/internal/infrastructure/database"
	config "aplikasi-distro-zone-lsp-website/pkg/config"
	"aplikasi-distro-zone-lsp-website/pkg/midtrans"
)

func main() {
	db, err := database.ConnPostgre()
	if err != nil {
		log.Fatal("db connect:", err)
	}

	bootstrap.AutoMigrate(db)
	controllers := bootstrap.InitControllers(db)
	bootstrap.RegisterRoutes(controllers)
	bootstrap.StartAutoCancelWorker(controllers.PesananUC)
	midtrans.Init()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	handler := config.CorsMiddleware(http.DefaultServeMux)

	log.Println("🚀 Server running on port", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
