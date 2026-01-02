import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../Navigation";
import Footer from "../Footer";

interface User {
  nama: string;
  username: string;
}

interface Pesanan {
  kode_pesanan: string;
  total_bayar: number;
}

interface Komplain {
  id_komplain: number;
  id_pesanan: number;
  id_user: number;
  jenis_komplain: string;
  deskripsi: string;
  status_komplain: "menunggu" | "diproses" | "selesai";
  created_at: string;
  updated_at: string;
  User?: User;
  Pesanan?: Pesanan;
}

export default function KomplainSaya() {
  const [komplainList, setKomplainList] = useState<Komplain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedKomplain, setSelectedKomplain] = useState<Komplain | null>(
    null
  );

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    fetchKomplain();
  }, []);

  const fetchKomplain = async () => {
    try {
      const token = getToken();
      if (!token) {
        setError("Token tidak ditemukan");
        return;
      }

      const res = await axios.get(
        "http://localhost:8080/api/v1/customer/komplain",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Data komplain:", res.data);
      setKomplainList(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data komplain");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: Komplain["status_komplain"]) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Komplain["status_komplain"]) => {
    switch (status) {
      case "menunggu":
        return "⏳";
      case "diproses":
        return "🔄";
      case "selesai":
        return "✓";
      default:
        return "";
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <>
      <Navigation />
      <div className="p-6 mt-36 mb-12 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Komplain Saya</h1>

        {komplainList.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Belum ada komplain.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-purple-600 to-purple-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Jenis Komplain
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Kode Pesanan
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {komplainList.map((k, index) => (
                    <tr
                      key={k.id_komplain}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize font-medium">
                        {k.jenis_komplain}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {k.Pesanan?.kode_pesanan || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {formatDate(k.created_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                            k.status_komplain
                          )}`}
                        >
                          {getStatusIcon(k.status_komplain)}{" "}
                          {k.status_komplain.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedKomplain(k)}
                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL DETAIL */}
        {selectedKomplain && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold">Detail Komplain</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Nama Customer</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedKomplain.User?.nama || "Tidak diketahui"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Kode Pesanan</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {selectedKomplain.Pesanan?.kode_pesanan || "-"}
                  </p>
                </div>

                {selectedKomplain.Pesanan?.total_bayar && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">
                      Total Pembayaran
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      Rp{" "}
                      {selectedKomplain.Pesanan.total_bayar.toLocaleString(
                        "id-ID"
                      )}
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Jenis Komplain</p>
                  <p className="text-base font-medium text-gray-900 capitalize">
                    {selectedKomplain.jenis_komplain}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Deskripsi Komplain
                  </p>
                  <p className="text-base text-gray-900 leading-relaxed">
                    {selectedKomplain.deskripsi}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Status Komplain</p>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(
                      selectedKomplain.status_komplain
                    )}`}
                  >
                    {getStatusIcon(selectedKomplain.status_komplain)}{" "}
                    {selectedKomplain.status_komplain.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-800 font-semibold mb-1">
                      Tanggal Diajukan
                    </p>
                    <p className="text-sm text-gray-900">
                      {formatDate(selectedKomplain.created_at)}
                    </p>
                  </div>

                  {selectedKomplain.updated_at !==
                    selectedKomplain.created_at && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-blue-800 font-semibold mb-1">
                        Terakhir Diperbarui
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatDate(selectedKomplain.updated_at)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
                <button
                  onClick={() => setSelectedKomplain(null)}
                  className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
