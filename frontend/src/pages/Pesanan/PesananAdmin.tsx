import { useState, useEffect } from "react";
import axios from "axios";
import { FaBox, FaTruck, FaCheckCircle } from "react-icons/fa";

type Pesanan = {
  id_pesanan: number;
  kode_pesanan: string;
  subtotal: number;
  biaya_ongkir: number;
  total_bayar: number;
  alamat_pengiriman: string;
  status_pembayaran: string;
  status_pesanan: string;
  metode_pembayaran: string;
  created_at: string;

  Pemesan?: {
    nama: string;
    username: string;
  };
};

export default function PesananAdmin() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "diproses" | "dikemas" | "dikirim"
  >("diproses");

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchPesanan = async () => {
    try {
      const token = getToken();
      let endpoint = "";

      switch (activeTab) {
        case "diproses":
          endpoint = "http://localhost:8080/api/v1/admin/pesanan/diproses";
          break;
        case "dikemas":
          endpoint = "http://localhost:8080/api/v1/admin/pesanan/dikemas";
          break;
        case "dikirim":
          endpoint = "http://localhost:8080/api/v1/admin/pesanan/dikirim";
          break;
      }

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPesanan(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, [activeTab]);

  // Fungsi untuk menangani update status
  const handleUpdateStatus = async (kode: string, newStatus: string) => {
    const endpointMap: Record<string, string> = {
      dikemas: `http://localhost:8080/api/v1/admin/pesanan/dikemas/${kode}`,
      dikirim: `http://localhost:8080/api/v1/admin/pesanan/dikirim/${kode}`,
      selesai: `http://localhost:8080/api/v1/admin/pesanan/selesai/${kode}`,
    };

    if (!window.confirm(`Ubah status pesanan ini menjadi ${newStatus}?`))
      return;

    try {
      const token = getToken();
      await axios.put(
        endpointMap[newStatus],
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPesanan((prev) => {
        if (
          (activeTab === "diproses" && newStatus === "diproses") ||
          (activeTab === "dikemas" && newStatus === "dikemas") ||
          (activeTab === "dikirim" && newStatus === "dikirim")
        ) {
          return prev.map((p) =>
            p.kode_pesanan === kode ? { ...p, status_pesanan: newStatus } : p
          );
        } else {
          return prev.filter((p) => p.kode_pesanan !== kode);
        }
      });
      setSuccessMessage(`Status pesanan berhasil diubah menjadi ${newStatus}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(err);
      alert(`Gagal mengubah status menjadi ${newStatus}`);
    }
  };

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

  return (
    <>
      {/* Header */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Manage Proses Pesanan
          </h1>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            DataTable Verifikasi Pesanan
          </h3>
          <div className="flex items-center gap-3">
            <label className="text-gray-100 font-bold">
              Filter Status Pesanan:
            </label>

            <select
              value={activeTab}
              onChange={(e) =>
                setActiveTab(
                  e.target.value as "diproses" | "dikemas" | "dikirim"
                )
              }
              className="bg-gray-700 text-white px-4 py-2 rounded
               border border-gray-600 focus:outline-none
               focus:ring-2 focus:ring-blue-500"
            >
              <option value="diproses">Diproses</option>
              <option value="dikemas">Dikemas</option>
              <option value="dikirim">Dikirim</option>
            </select>
          </div>
        </div>

        <div className="p-4">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-md">
              {successMessage}
            </div>
          )}

          {loading ? (
            <p className="text-gray-300 text-center">Loading...</p>
          ) : pesanan.length === 0 ? (
            <p className="text-gray-400 text-center">
              Tidak ada pesanan yang perlu diproses
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-xs text-gray-300">No</th>
                    <th className="px-24 py-3 text-xs text-gray-300">
                      Kode Pesanan
                    </th>
                    <th className="px-4 py-3 text-xs text-gray-300">Pemesan</th>
                    <th className="px-4 py-3 text-xs text-gray-300">
                      Total Bayar
                    </th>
                    <th className="px-4 py-3 text-xs text-gray-300">
                      Biaya Ongkir
                    </th>
                    <th className="px-4 py-3 text-xs text-gray-300">
                      Status Pembayaran
                    </th>
                    <th className="px-4 py-3 text-xs text-gray-300">
                      Status Pesanan
                    </th>
                    <th className="px-4 py-3 text-xs text-gray-300">
                      Metode Pembayaran
                    </th>
                    <th className="px-16 py-3 text-xs text-gray-300">
                      Tanggal Pesanan
                    </th>
                    <th className="px-4 py-3 text-xs text-gray-300">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-600">
                  {pesanan.map((p, i) => (
                    <tr key={p.id_pesanan} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{i + 1}</td>
                      <td className="px-4 py-3 text-white">{p.kode_pesanan}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {p.Pemesan?.nama || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        Rp {p.total_bayar.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        Rp {p.biaya_ongkir.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {p.status_pembayaran}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {p.status_pesanan}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {p.metode_pembayaran}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {formatDate(p.created_at)}
                      </td>
                      <td className="px-4 py-3 flex gap-2">
                        {activeTab === "diproses" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(p.kode_pesanan, "dikemas")
                            }
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1"
                          >
                            <FaBox /> Dikemas
                          </button>
                        )}

                        {activeTab === "dikemas" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(p.kode_pesanan, "dikirim")
                            }
                            className="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded flex items-center gap-1"
                          >
                            <FaTruck /> Dikirim
                          </button>
                        )}

                        {activeTab === "dikirim" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(p.kode_pesanan, "selesai")
                            }
                            className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1"
                          >
                            <FaCheckCircle /> Selesai
                          </button>
                        )}
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
