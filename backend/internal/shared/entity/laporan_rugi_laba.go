package entity

type LaporanRugiLaba struct {
	TotalPenjualan float64  `json:"total_penjualan"`
	TotalHPP       float64  `json:"total_hpp"`
	LabaBersih     float64  `json:"laba_bersih"`
	Dates          []string `json:"dates"`
	Penjualan      []int64  `json:"penjualan"`
	Laba           []int64  `json:"laba"`
}
