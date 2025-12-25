package server

import (
	"net/http"

	"aplikasi-distro-zone-lsp-website/internal/interface/controller"
	"aplikasi-distro-zone-lsp-website/pkg/middleware"
)

func RegisterPembayaranRoutes(
	checkoutCtrl *controller.CheckoutController,
	callbackCtrl *controller.MidtransCallbackController,
) {
	http.HandleFunc("/api/checkout", middleware.AuthMiddleware(checkoutCtrl.Checkout))
	http.HandleFunc("/api/midtrans/callback", callbackCtrl.Handle)
}
