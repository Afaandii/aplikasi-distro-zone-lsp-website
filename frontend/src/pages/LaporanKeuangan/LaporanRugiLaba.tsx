import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "../../components/form/date-picker";
import LineChartOne from "../../components/Charts/line/LineChartOne";

type LaporanRugiLaba = {
  total_penjualan: number;
  total_hpp: number;
  laba_bersih: number;
  dates: string[];
  penjualan: number[];
  laba: number[];
};

export default function LaporanRugiLaba() {
  const [laporan, setLaporan] = useState<LaporanRugiLaba | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchLaporanRugiLaba = async () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih tanggal mulai dan akhir");
      return;
    }

    try {
      const token = getToken();
      const res = await axios.get<LaporanRugiLaba>(
        `http://localhost:8080/api/v1/admin/laporan-rugi-laba/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLaporan(res.data);
    } catch (error) {
      console.error("Error fetching laporan rugi laba:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Handler untuk validasi tanggal
  const handleStartDateChange = (_: Date[], dateStr: string, instance: any) => {
    if (endDate && new Date(dateStr) > new Date(endDate)) {
      alert("Tanggal mulai tidak boleh lebih dari tanggal akhir!");
      instance.setDate(startDate, false);
      return;
    }
    setStartDate(dateStr);
  };

  const handleEndDateChange = (_: Date[], dateStr: string, instance: any) => {
    if (startDate && new Date(dateStr) < new Date(startDate)) {
      alert("Tanggal akhir tidak boleh kurang dari tanggal mulai!");
      instance.setDate(endDate, false);
      return;
    }
    setEndDate(dateStr);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchLaporanRugiLaba();
    }
  }, []);

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Laporan Rugi Laba</h1>
        </div>
      </section>

      {/* Filter Periode */}
      <div className="bg-gray-700 p-4 rounded-lg mb-4 flex flex-wrap gap-4 items-end">
        <div className="w-full md:w-auto">
          <label className="block text-gray-300 text-sm mb-1">
            Tanggal Mulai
          </label>
          <DatePicker
            id="start-date"
            mode="single"
            onChange={handleStartDateChange}
            placeholder="dd/mm/yyyy"
          />
        </div>

        <div className="w-full md:w-auto">
          <label className="block text-gray-300 text-sm mb-1">
            Tanggal Akhir
          </label>
          <DatePicker
            id="end-date"
            mode="single"
            onChange={handleEndDateChange}
            placeholder="dd/mm/yyyy"
          />
        </div>

        <button
          onClick={fetchLaporanRugiLaba}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          Filter
        </button>
      </div>

      {/* Statistik Utama */}
      {loading ? (
        <p className="text-gray-300 text-center">
          Pilih Periode Untuk Melihat Laporan Rugi Laba
        </p>
      ) : laporan ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">Total Penjualan</p>
            <p className="text-2xl font-bold text-green-400">
              {formatRupiah(laporan.total_penjualan)}
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">Total Modal (HPP)</p>
            <p className="text-2xl font-bold text-yellow-400">
              {formatRupiah(laporan.total_hpp)}
            </p>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">Laba Bersih</p>
            <p className="text-2xl font-bold text-blue-400">
              {formatRupiah(laporan.laba_bersih)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-red-500 text-lg">Data tidak ditemukan</p>
          <p className="text-gray-400 text-sm mt-2">
            Silakan pilih periode dan klik Filter.
          </p>
        </div>
      )}

      {/* Grafik Laba */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Grafik Laba</h3>
        </div>

        <div className="p-4">
          {loading ? (
            <p className="text-gray-300 text-center">
              Piih Periode Untuk Melihat Grafik Laba
            </p>
          ) : laporan && laporan.dates.length ? (
            <LineChartOne data={laporan} />
          ) : (
            <p className="text-gray-300 text-center">
              Pilih periode untuk melihat grafik.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
