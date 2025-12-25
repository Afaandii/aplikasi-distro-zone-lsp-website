package midtrans

import (
	"os"

	"github.com/midtrans/midtrans-go"
)

func Init() {
	midtrans.ClientKey = os.Getenv("MIDTRANS_CLIENT_KEY")
	midtrans.ServerKey = os.Getenv("MIDTRANS_SERVER_KEY")
	midtrans.Environment = midtrans.Sandbox
}
