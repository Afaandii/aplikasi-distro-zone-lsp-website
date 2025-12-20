import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

type Varian = {
  id_varian: number;
  id_produk: number;
  id_ukuran: number;
  id_warna: number;
  stok_kaos: number;

  // ambil data relasi
  Produk?: { id_produk: number; nama_kaos: string };
  Ukuran?: { id_ukuran: number; nama_ukuran: string };
  Warna?: { id_warna: number; nama_warna: string };
};

export default function Varian() {
  const [varian, setVarian] = useState<Varian[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchVarian = async () => {
    try {
      const token = getToken();

      const res = await axios.get("http://localhost:8080/api/v1/varian", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setVarian(res.data);
      }
    } catch (error) {
      console.error("Error fetching varian:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVarian();
  }, []);

  const handleDelete = async (id_varian: number) => {
    if (!window.confirm("Anda yakin ingin menghapus varian ini?")) return;

    const token = getToken();
    try {
      await axios.delete(`http://localhost:8080/api/v1/varian/${id_varian}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setVarian((prev) =>
        prev.filter((varian) => varian.id_varian !== id_varian)
      );
      setSuccessMessage("Varian berhasil dihapus.");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Deleted failed Varian:", err);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Manage Tabel Varian</h1>
          {/* Tombol Tambah */}
          <Link
            to="/create-varian"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link>
        </div>
      </section>

      {/* Card Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">DataTable Varian</h3>
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
          ) : varian.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Tidak ada data varian</p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah varian baru menggunakan tombol + di atas
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
                      Id Produk
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Id Ukuran
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Id Warna
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Stok Produk
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
                  {varian.map((varianItem, index) => (
                    <tr
                      key={varianItem.id_varian}
                      className="hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {varianItem.Produk?.nama_kaos}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {varianItem.Ukuran?.nama_ukuran}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {varianItem.Warna?.nama_warna}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {varianItem.stok_kaos}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Tombol Edit */}
                        <Link
                          to={`/edit-varian/${varianItem.id_varian}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(varianItem.id_varian)}
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
