import { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "../../components/form/date-picker";
import { Link } from "react-router";

type Kasir = {
  id_kasir: number;
  nama: string;
  username: string;
};

type Transaksi = {
  id_transaksi: number;
  id_user: number;
  kode_transaksi: string | null;
  total: number;
  metode_pembayaran: string;
  status_transaksi: string;
  created_at: string;
  Kasir?: Kasir;
};

export default function LaporanKeuanganAdmin() {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // State untuk Filter
  const [selectedMethod, setSelectedMethod] = useState<string>("all");
  const [selectedKasir, setSelectedKasir] = useState<string>("all");

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchTransaksi = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        console.error("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/laporan-transaksi",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      setTransaksi(data);
    } catch (error) {
      console.error("Error fetching transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransaksiByPeriode = async () => {
    if (!startDate || !endDate) {
      alert("Silakan pilih tanggal mulai dan akhir");
      return;
    }

    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/laporan-transaksi/${startDate}/${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransaksi(res.data);
    } catch (error) {
      console.error("Error filter transaksi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaksi();
  }, []);

  // Format tanggal ke "DD MMM YYYY HH:mm"
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    let formatted = date.toLocaleString("id-ID", options);
    formatted = formatted.replace(/(\d{2})\.(\d{2})$/, "$1:$2");

    return formatted;
  };

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // --- LOGIKA FILTER DINAMIS ---

  // 1. Ambil Metode Pembayaran Unik
  const uniqueMethods = Array.from(
    new Set(transaksi.map((item) => item.metode_pembayaran))
  );

  // 2. Ambil Nama Kasir Unik (Handle null safety)
  const uniqueKasirs = Array.from(
    new Set(
      transaksi
        .filter((item) => item.Kasir) // Pastikan ada data kasir
        .map((item) => item.Kasir!.nama)
    )
  );

  // 3. Filter Data
  const filteredTransaksi = transaksi.filter((item) => {
    // Filter Metode Pembayaran
    const matchMethod =
      selectedMethod === "all" || item.metode_pembayaran === selectedMethod;

    // Filter Kasir (Mengecek nama kasir)
    const matchKasir =
      selectedKasir === "all" || item.Kasir?.nama === selectedKasir;

    return matchMethod && matchKasir;
  });

  // 4. Hitung Total Berdasarkan Data yang Sudah Difilter
  // Ini membuat summary (Total Omzet) berubah sesuai filter
  const totalTransaksi = filteredTransaksi.reduce((sum, t) => sum + t.total, 0);
  const jumlahTransaksi = filteredTransaksi.length;

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

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 ">
          <h1 className="text-2xl font-bold text-white">Laporan Keuangan</h1>
        </div>
      </section>

      {/* Filter Periode & Dropdowns */}
      <div className="bg-gray-700 p-4 rounded-lg mb-4 flex flex-wrap gap-4 items-end">
        {/* Tanggal Mulai */}
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

        {/* Tanggal Akhir */}
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

        {/* Tombol Filter Tanggal */}
        <button
          onClick={fetchTransaksiByPeriode}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold h-10.5 whitespace-nowrap"
        >
          Filter Tanggal
        </button>

        {/* Dropdown Metode Pembayaran Dinamis */}
        <div className="w-full md:w-auto">
          <label className="block text-gray-300 text-sm mb-1">
            Metode Pembayaran
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-10.5 w-full md:w-45"
          >
            <option value="all">Semua Metode</option>
            {uniqueMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Nama Kasir Dinamis */}
        <div className="w-full md:w-auto">
          <label className="block text-gray-300 text-sm mb-1">Nama Kasir</label>
          <select
            value={selectedKasir}
            onChange={(e) => setSelectedKasir(e.target.value)}
            className="bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500 h-10.5 w-full md:w-45"
          >
            <option value="all">Semua Kasir</option>
            {uniqueKasirs.map((namaKasir) => (
              <option key={namaKasir} value={namaKasir}>
                {namaKasir}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards (Menggunakan filteredTransaksi agar angka ikut berubah) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-300 text-sm">Jumlah Transaksi</p>
          <p className="text-2xl font-bold text-white">{jumlahTransaksi}</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <p className="text-gray-300 text-sm">Total Omzet</p>
          <p className="text-2xl font-bold text-green-400">
            {formatRupiah(totalTransaksi)}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            DataTable Laporan Keuangan
          </h3>
        </div>

        <div className="p-4">
          {loading ? (
            <p className="text-gray-300 text-center">
              Loading data transaksi...
            </p>
          ) : filteredTransaksi.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">
                Tidak ada transaksi ditemukan
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {transaksi.length > 0
                  ? "Coba ubah filter metode pembayaran atau nama kasir."
                  : "Belum ada transaksi dengan status selesai."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-14 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Nama Kasir
                    </th>
                    <th className="px-28 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kode Transaksi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Metode Pembayaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status Transaksi
                    </th>
                    <th className="px-14 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {filteredTransaksi.map((trans, index) => (
                    <tr key={trans.id_transaksi} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{index + 1}</td>
                      <td className="px-4 py-3 text-white">
                        {trans.Kasir?.nama || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.kode_transaksi || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {formatRupiah(trans.total)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.metode_pembayaran}
                      </td>
                      <td className="px-4 py-3 text-gray-300 font-medium">
                        {trans.status_transaksi}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {formatDate(trans.created_at)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        <Link
                          to={`/laporan-transaksi-keuangan-detail/${trans.id_transaksi}`}
                          className="inline-flex items-center px-4 py-3 bg-blue-500 hover:bg-yellow-600 text-white rounded mr-2"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
