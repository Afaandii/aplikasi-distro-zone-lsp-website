package controller

import (
	"aplikasi-distro-zone-lsp-website/internal/domain/entities"
	"aplikasi-distro-zone-lsp-website/internal/domain/usecase"
	helper "aplikasi-distro-zone-lsp-website/internal/interface/helper"
	"net/http"
)

type MasterDataController struct {
	MerkUsecase   usecase.MerkUsecase
	TipeUsecase   usecase.TipeUsecase
	UkuranUsecase usecase.UkuranUsecase
	WarnaUsecase  usecase.WarnaUsecase
}

func NewMasterDataController(
	merkUc usecase.MerkUsecase,
	tipeUc usecase.TipeUsecase,
	ukuranUc usecase.UkuranUsecase,
	warnaUc usecase.WarnaUsecase,
) *MasterDataController {
	return &MasterDataController{
		MerkUsecase:   merkUc,
		TipeUsecase:   tipeUc,
		UkuranUsecase: ukuranUc,
		WarnaUsecase:  warnaUc,
	}
}

// GetProdukMasterData mengembalikan semua data master yang dibutuhkan untuk form produk
func (c *MasterDataController) GetProdukMasterData(w http.ResponseWriter, r *http.Request) {
	// Ambil semua data master secara paralel di backend
	merkChan := make(chan []entities.Merk, 1)
	tipeChan := make(chan []entities.Tipe, 1)
	ukuranChan := make(chan []entities.Ukuran, 1)
	warnaChan := make(chan []entities.Warna, 1)

	errChan := make(chan error, 4)

	go func() {
		data, err := c.MerkUsecase.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		merkChan <- data
	}()

	go func() {
		data, err := c.TipeUsecase.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		tipeChan <- data
	}()

	go func() {
		data, err := c.UkuranUsecase.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		ukuranChan <- data
	}()

	go func() {
		data, err := c.WarnaUsecase.GetAll()
		if err != nil {
			errChan <- err
			return
		}
		warnaChan <- data
	}()

	// Tunggu semua proses selesai
	masterData := make(map[string]interface{})
	for i := 0; i < 4; i++ {
		select {
		case err := <-errChan:
			helper.WriteJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
			return
		case merk := <-merkChan:
			masterData["merk"] = merk
		case tipe := <-tipeChan:
			masterData["tipe"] = tipe
		case ukuran := <-ukuranChan:
			masterData["ukuran"] = ukuran
		case warna := <-warnaChan:
			masterData["warna"] = warna
		}
	}

	helper.WriteJSON(w, http.StatusOK, masterData)
}
