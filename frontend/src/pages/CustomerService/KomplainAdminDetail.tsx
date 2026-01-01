import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface KomplainDetail {
  id_komplain: number;
  id_pesanan: number;
  id_user: number;
  jenis_komplain: string;
  deskripsi: string;
  status_komplain: "menunggu" | "diproses" | "selesai";
  created_at: string;
  updated_at: string;
  User?: {
    nama: string;
  };
  Pesanan?: {
    kode_pesanan: string;
    total: number;
  };
}

export default function KomplainAdminDetail() {
  const { id_komplain } = useParams<{ id_komplain: string }>();
  const navigate = useNavigate();
  const [komplain, setKomplain] = useState<KomplainDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchDetail = async () => {
    try {
      const token = getToken();
      if (!token || !id_komplain) {
        navigate("/komplain");
        return;
      }

      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/komplain/${id_komplain}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = res.data;
      setKomplain(data);
    } catch (error) {
      console.error("Error fetching komplain detail:", error);
      alert("Gagal memuat data komplain");
      navigate("/komplain");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id_komplain]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (
      !window.confirm(`Yakin ingin mengubah status menjadi "${newStatus}"?`)
    ) {
      return;
    }

    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/v1/admin/komplain/${id_komplain}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchDetail();

      alert(`Status berhasil diubah menjadi ${newStatus}`);
    } catch (error) {
      console.error("Error update status:", error);
      alert("Gagal mengubah status");
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-gray-300">Memuat detail komplain...</p>
        </div>
      </div>
    );
  }

  if (!komplain) {
    return (
      <div className="p-6">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <p className="text-red-400">Data komplain tidak ditemukan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Detail Komplain</h1>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Detail Komplain</h3>
        </div>

        <div className="p-4">
          {/* Informasi Utama */}
          <div className="space-y-3 text-gray-300">
            <p>
              <strong>ID Komplain:</strong> {komplain.id_komplain}
            </p>
            <p>
              <strong>Customer:</strong> {komplain.User?.nama || ""}
            </p>
            <p>
              <strong>Kode Pesanan:</strong>{" "}
              {komplain.Pesanan?.kode_pesanan || ""}
            </p>
            <p>
              <strong>Jenis Komplain:</strong> {komplain.jenis_komplain}
            </p>
            <p>
              <strong>Deskripsi:</strong>
              {komplain.deskripsi || ""}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${getStatusClass(
                  komplain.status_komplain
                )}`}
              >
                {getStatusLabel(komplain.status_komplain)}
              </span>
            </p>
            <p>
              <strong>Tanggal Diajukan:</strong>{" "}
              {formatDate(komplain.created_at)}
            </p>
            {komplain.updated_at !== komplain.created_at && (
              <p>
                <strong>Terakhir Diperbarui:</strong>{" "}
                {formatDate(komplain.updated_at)}
              </p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="mt-6 flex gap-3 justify-end">
            {komplain.status_komplain === "menunggu" && (
              <button
                onClick={() => handleUpdateStatus("diproses")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Proses
              </button>
            )}

            {komplain.status_komplain === "diproses" && (
              <button
                onClick={() => handleUpdateStatus("selesai")}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Selesaikan
              </button>
            )}

            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            >
              ← Kembali
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
