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
	http.HandleFunc("/api/checkout/preview", middleware.AuthMiddleware(checkoutCtrl.Preview))
	http.HandleFunc("/api/v1/payment-notification", callbackCtrl.Handle)
}
