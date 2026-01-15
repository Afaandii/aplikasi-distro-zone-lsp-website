package bootstrap

import (
	"log"
	"time"
)

type AutoCancelHandler interface {
	AutoCancelExpiredOrders() (int64, error)
}

func StartAutoCancelWorker(pesananUc interface {
	AutoCancelExpiredOrders() (int64, error)
}) {
	go func() {
		log.Println("Starting Auto-Cancel Orders Worker...")
		ticker := time.NewTicker(5 * time.Second)

		for range ticker.C {
			count, err := pesananUc.AutoCancelExpiredOrders()
			if err != nil {
				log.Println("Auto cancel error:", err)
			} else if count > 0 {
				log.Printf("Canceled %d expired orders", count)
			}
		}
	}()
}
