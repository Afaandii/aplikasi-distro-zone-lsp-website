import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface Komplain {
  id_komplain: number;
  id_pesanan: number;
  id_user: number;
  jenis_komplain: string;
  deskripsi: string;
  status_komplain: "menunggu" | "diproses" | "selesai";
  created_at: string;
  User?: {
    nama: string;
  };
}

export default function KomplainAdmin() {
  const [komplains, setKomplains] = useState<Komplain[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchKomplains = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/komplain",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setKomplains(res.data);
    } catch (error) {
      console.error("Error fetch komplain:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKomplains();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusLabel = (
    status: "menunggu" | "diproses" | "selesai"
  ): string => {
    switch (status) {
      case "menunggu":
        return "MENUNGGU";
      case "diproses":
        return "DIPROSES";
      case "selesai":
        return "SELESAI";
      default:
        return "MENUNGGU";
    }
  };

  const getStatusClass = (
    status: "menunggu" | "diproses" | "selesai"
  ): string => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-600 text-white";
      case "diproses":
        return "bg-blue-600 text-white";
      case "selesai":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white">Komplain Customer</h1>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Daftar Komplain</h3>
        </div>

        <div className="p-4">
          {loading ? (
            <p className="text-gray-300 text-center">Loading komplain...</p>
          ) : komplains.length === 0 ? (
            <p className="text-red-400 text-center">
              Belum ada komplain dari customer
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-gray-300">No</th>
                    <th className="px-4 py-3 text-gray-300">Customer</th>
                    <th className="px-4 py-3 text-gray-300">Jenis Komplain</th>
                    <th className="px-4 py-3 text-gray-300">Status</th>
                    <th className="px-4 py-3 text-gray-300">Tanggal</th>
                    <th className="px-4 py-3 text-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {komplains.map((k, i) => (
                    <tr key={k.id_komplain} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{i + 1}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {k.User?.nama ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {k.jenis_komplain}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(
                            k.status_komplain
                          )}`}
                        >
                          {getStatusLabel(k.status_komplain)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {formatDate(k.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/detail-komplain/${k.id_komplain}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
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
