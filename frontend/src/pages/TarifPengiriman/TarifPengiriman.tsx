import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

type TarifPengiriman = {
  id_tarif_pengiriman: number;
  wilayah: string;
  harga_per_kg: string | null;
};

export default function TarifPengiriman() {
  const [tarifPengiriman, setTarifPengiriman] = useState<TarifPengiriman[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchTarifPengiriman = async () => {
    try {
      const token = getToken();

      const res = await axios.get(
        "http://localhost:8080/api/v1/tarif-pengiriman",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        setTarifPengiriman(res.data);
      }
    } catch (error) {
      console.error("Error fetching tarif pengiriman:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTarifPengiriman();
  }, []);

  const handleDelete = async (id_tarif_pengiriman: number) => {
    if (!window.confirm("Anda yakin ingin menghapus tarif pengiriman ini?"))
      return;

    const token = getToken();
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/tarif-pengiriman/${id_tarif_pengiriman}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTarifPengiriman((prev) =>
        prev.filter(
          (tarif) => tarif.id_tarif_pengiriman !== id_tarif_pengiriman
        )
      );
      setSuccessMessage("Tarif pengiriman berhasil dihapus.");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Deleted failed:", err);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Manage Tabel Tarif Pengiriman
          </h1>
          <Link
            to="/create-tarif-pengiriman"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link>
        </div>
      </section>

      {/* Card Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            DataTable Tarif Pengiriman
          </h3>
        </div>

        <div className="p-4">
          {/* Pesan Sukses (Alert) */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-md flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
              >
                &times;
              </button>
            </div>
          )}

          {/* Tabel */}
          {loading ? (
            <p className="text-gray-300 text-center">Loading Data...</p>
          ) : tarifPengiriman.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">
                Tidak ada data tarif pengiriman
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah tarif pengiriman baru menggunakan tombol + di
                atas
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      No
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Wilayah
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Harga PerKg
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {tarifPengiriman.map((tarif, index) => (
                    <tr
                      key={tarif.id_tarif_pengiriman}
                      className="hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {tarif.wilayah}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {tarif.harga_per_kg}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Tombol Edit */}
                        <Link
                          to={`/edit-tarif-pengiriman/${tarif.id_tarif_pengiriman}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() =>
                            handleDelete(tarif.id_tarif_pengiriman)
                          }
                          className="inline-flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors duration-200"
                        >
                          <FaTrash className="text-lg" />
                        </button>
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
