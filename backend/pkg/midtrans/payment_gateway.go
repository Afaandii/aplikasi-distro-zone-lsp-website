package midtrans

import (
	midtransgo "github.com/midtrans/midtrans-go"

	"github.com/midtrans/midtrans-go/coreapi"
)

type PaymentGateway struct{}

func NewPaymentGateway() *PaymentGateway {
	return &PaymentGateway{}
}

func (p *PaymentGateway) Refund(
	orderID string,
	amount int64,
	refundKey string,
) error {

	client := coreapi.Client{}
	client.New(midtransgo.ServerKey, midtransgo.Environment)

	_, err := client.RefundTransaction(orderID, &coreapi.RefundReq{
		Amount:    amount,
		RefundKey: refundKey,
	})

	return err
}
