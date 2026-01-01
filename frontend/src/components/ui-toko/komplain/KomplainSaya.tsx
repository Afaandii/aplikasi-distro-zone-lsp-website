import { useEffect, useState } from "react";
import axios from "axios";

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
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusBadge = (status: Komplain["status_komplain"]) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-700";
      case "diproses":
        return "bg-blue-100 text-blue-700";
      case "selesai":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">Komplain Saya</h1>

        {komplainList.length === 0 ? (
          <p>Belum ada komplain.</p>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">No</th>
                <th className="p-2 border">Jenis</th>
                <th className="p-2 border">Tanggal</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {komplainList.map((k, index) => (
                <tr key={k.id_komplain} className="text-center">
                  <td className="p-2 border capitalize">{index + 1}</td>
                  <td className="p-2 border capitalize">{k.jenis_komplain}</td>
                  <td className="p-2 border">{formatDate(k.created_at)}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-sm ${getStatusBadge(
                        k.status_komplain
                      )}`}
                    >
                      {k.status_komplain.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => setSelectedKomplain(k)}
                      className="text-blue-600 hover:underline"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* MODAL DETAIL */}
        {selectedKomplain && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-3">Detail Komplain</h2>

              <div className="space-y-3 text-gray-700">
                {/* Customer Name dari response */}
                <p>
                  <strong>Customer:</strong>{" "}
                  {selectedKomplain.User?.nama || "Tidak diketahui"}
                </p>

                {/* Kode Pesanan */}
                <p>
                  <strong>Kode Pesanan:</strong>{" "}
                  {selectedKomplain.Pesanan?.kode_pesanan || "-"}
                </p>

                {/* Jenis Komplain */}
                <p>
                  <strong>Jenis Komplain:</strong>{" "}
                  {selectedKomplain.jenis_komplain}
                </p>

                {/* Deskripsi */}
                <p>
                  <strong>Deskripsi:</strong> {selectedKomplain.deskripsi}
                </p>

                {/* Status */}
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      selectedKomplain.status_komplain === "menunggu"
                        ? "bg-yellow-100 text-yellow-700"
                        : selectedKomplain.status_komplain === "diproses"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {selectedKomplain.status_komplain.toUpperCase()}
                  </span>
                </p>

                {/* Tanggal Diajukan */}
                <p>
                  <strong>Tanggal Diajukan:</strong>{" "}
                  {formatDate(selectedKomplain.created_at)}
                </p>

                {/* Terakhir Diperbarui */}
                {selectedKomplain.updated_at !==
                  selectedKomplain.created_at && (
                  <p>
                    <strong>Terakhir Diperbarui:</strong>{" "}
                    {formatDate(selectedKomplain.updated_at)}
                  </p>
                )}
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => setSelectedKomplain(null)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
