import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type Produk = {
  id_produk: number;
  nama_kaos: string;
  berat: number;
};

type User = {
  id_user: number;
  nama: string;
  username: string;
};

type Transaksi = {
  id_transaksi: number;
  id_user: number;
  kode_transaksi: string;
  total: number;
  metode_pembayaran: string;
  status_transaksi: string;
  created_at: string;
  updated_at: string;
  User: User;
};

type DetailTransaksi = {
  id_detail_transaksi: number;
  id_transaksi: number;
  id_produk: number;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  Produk: Produk;
  Transaksi: Transaksi;
};

type ResponseData = {
  transaksi: Transaksi;
  items: DetailTransaksi[];
};

export default function DetailLaporanKeuanganKasir() {
  const [detailTransaction, setDetailTransaction] = useState<DetailTransaksi[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { id_transaksi } = useParams();

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchDetailTransaction = async () => {
    if (!id_transaksi) {
      setErrorMessage("ID transaksi tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        setErrorMessage("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      const res = await axios.get<ResponseData>(
        `http://localhost:8080/api/v1/kasir/laporan/detail/${id_transaksi}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Simpan data
      setDetailTransaction(res.data.items);
    } catch (error: any) {
      console.error("Error fetching detail transaction:", error);
      setErrorMessage(error.response?.data?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailTransaction();
  }, [id_transaksi]);

  // Format Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  // Format tanggal
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

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Detail Laporan Keuangan Transaksi
          </h1>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            DataTable Detail Laporan Keuangan Transaksi
          </h3>
        </div>

        <div className="p-4">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-md flex items-center justify-between">
              <span>{errorMessage}</span>
              <button
                onClick={() => setErrorMessage(null)}
                className="ml-2 text-white hover:text-gray-200"
              >
                &times;
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-gray-300 text-center">Loading Data...</p>
          ) : detailTransaction.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Tidak ada detail transaksi</p>
              <p className="text-gray-400 text-sm mt-2">
                Transaksi ini mungkin tidak memiliki item atau tidak ditemukan.
              </p>
            </div>
          ) : (
            <>
              {/* Tabel Detail */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-600">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-28 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Kode Transaksi
                      </th>
                      <th className="px-28 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Nama Produk
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Berat
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Harga Satuan
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Subtotal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Metode Pembayaran
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Status Pembayaran
                      </th>
                      <th className="px-14 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Tanggal Transaksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-gray-800 divide-y divide-gray-600">
                    {detailTransaction.map((detTrans, index) => (
                      <tr
                        key={detTrans.id_detail_transaksi}
                        className="hover:bg-gray-700"
                      >
                        <td className="px-4 py-3 text-white">{index + 1}</td>
                        <td className="px-4 py-3 text-gray-300">
                          {detTrans.Transaksi.kode_transaksi}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {detTrans.Produk.nama_kaos}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {detTrans.jumlah}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {detTrans.Produk.berat}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatRupiah(detTrans.harga_satuan)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatRupiah(detTrans.subtotal)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatRupiah(detTrans.Transaksi.total)}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {detTrans.Transaksi.metode_pembayaran}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {detTrans.Transaksi.status_transaksi}
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          {formatDate(detTrans.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
