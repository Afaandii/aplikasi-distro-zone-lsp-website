import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

type Tipe = {
  id_tipe: number;
  nama_tipe: string;
  keterangan: string | null;
};

export default function Tipe() {
  const [tipe, setTipe] = useState<Tipe[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchTipe = async (query: string = "") => {
    try {
      const token = getToken();

      const url = query
        ? `http://localhost:8080/api/v1/tipe/live/search?q=${query}`
        : `http://localhost:8080/api/v1/tipe`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setTipe(res.data);
      }
    } catch (error) {
      console.error("Error fetching tipe:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTipe(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Anda yakin ingin menghapus tipe produk ini?")) return;

    const token = getToken();
    try {
      await axios.delete(`http://localhost:8080/api/v1/tipe/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTipe((prev) => prev.filter((tp) => tp.id_tipe !== id));
      setSuccessMessage("Tipe berhasil dihapus.");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Manage Tabel Tipe</h1>

          <Link
            to="/create-tipe"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600 flex justify-between">
          <h3 className="text-lg font-semibold text-white">DataTable Tipe</h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Cari Nama / Keterangan..."
              className="pl-10 pr-4 py-1.5 text-sm text-gray-200 bg-gray-600 border border-gray-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4">
          {/* pesan sukses */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-md flex items-center justify-between">
              <span>{successMessage}</span>
              <button
                onClick={() => setSuccessMessage(null)}
                className="ml-2 text-white hover:text-gray-200"
              >
                &times;
              </button>
            </div>
          )}

          {loading ? (
            <p className="text-gray-300 text-center">Loading Data...</p>
          ) : tipe.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Tidak ada data tipe</p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah tipe baru menggunakan tombol + di atas
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name Tipe
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {tipe.map((tp, index) => (
                    <tr key={tp.id_tipe} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{index + 1}</td>
                      <td className="px-4 py-3 text-white">{tp.nama_tipe}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {tp.keterangan}
                      </td>

                      <td className="px-4 py-3">
                        <Link
                          to={`/edit-tipe/${tp.id_tipe}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded mr-2"
                        >
                          <FaEdit className="text-lg" />
                        </Link>

                        <button
                          onClick={() => handleDelete(tp.id_tipe)}
                          className="inline-flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded"
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
