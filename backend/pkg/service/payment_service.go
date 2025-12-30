package service

type PaymentGateway interface {
	Refund(orderID string, amount int64, refundKey string) error
}
