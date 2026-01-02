import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";

type Produk = {
  id_produk: number;
  id_merk: number;
  id_tipe: number;
  nama_kaos: string;
  harga_jual: number;
  harga_pokok: number;
  deskripsi: string;
  spesifikasi: string;

  // ambil data relasi
  Merk?: { id_merk: number; nama_merk: string };
  Tipe?: { id_tipe: number; nama_tipe: string };
};

export default function Produk() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchProduk = async (query: string = "") => {
    try {
      setLoading(true);
      const token = getToken();

      const url = query
        ? `http://localhost:8080/api/v1/produk/live/search?q=${query}`
        : `http://localhost:8080/api/v1/produk`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setProduk(res.data);
      }
    } catch (error) {
      console.error("Error fetching produk:", error);
    } finally {
      setLoading(false);
    }
  };

  // TAMBAHAN: Effect untuk menjalankan search otomatis
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProduk(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDelete = async (id_produk: number) => {
    if (!window.confirm("Anda yakin ingin menghapus produk ini?")) return;

    const token = getToken();
    try {
      await axios.delete(`http://localhost:8080/api/v1/produk/${id_produk}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchProduk(searchQuery);
      setSuccessMessage("Produk berhasil dihapus.");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Deleted failed Product:", err);
    }
  };

  // crop teks panjang spesifikasi dan informasi produk
  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Manage Tabel Produk</h1>
          {/* Tombol Tambah */}
          <Link
            to="/create-produk"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link>
        </div>
      </section>

      {/* Card Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">DataTable Produk</h3>

          {/* TAMBAHAN: Input Search di Kanan DataTable */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Cari Nama / Merk..."
              className="pl-10 pr-4 py-1.5 text-sm text-gray-200 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
          ) : produk.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">
                {searchQuery
                  ? "Tidak ada produk yang cocok"
                  : "Tidak ada data produk"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchQuery
                  ? "Coba kata kunci lain"
                  : "Silakan tambah produk baru menggunakan tombol + di atas"}
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
                      Merk
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Tipe
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Nama Produk
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Harga Jual
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Harga Pokok
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Deskripsi
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Spesifikasi
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
                  {produk.map((prod, index) => (
                    <tr key={prod.id_produk} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {prod.Merk?.nama_merk}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {prod.Tipe?.nama_tipe}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {prod.nama_kaos}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {prod.harga_jual}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {prod.harga_pokok}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {truncateText(prod.deskripsi)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {truncateText(prod.spesifikasi)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Tombol Edit */}
                        <Link
                          to={`/edit-produk/${prod.id_produk}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(prod.id_produk)}
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
