import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";

type JamOperasional = {
  id_jam_operasional: number;
  tipe_layanan: string;
  hari: string;
  jam_buka: string;
  jam_tutup: string;
  status: string;
};

export default function JamOperasional() {
  const [jamOperasional, setJamOperasional] = useState<JamOperasional[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchJamOperasional = async (query: string = "") => {
    try {
      const token = getToken();

      const url = query
        ? `http://localhost:8080/api/v1/jam-operasional/live/search?q=${query}`
        : `http://localhost:8080/api/v1/jam-operasional`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setJamOperasional(res.data);
      }
    } catch (error) {
      console.error("Error fetching jam operasional:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJamOperasional(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleDelete = async (id_jam_operasional: number) => {
    if (!window.confirm("Anda yakin ingin menghapus jam operasional ini?"))
      return;
    const token = getToken();
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/jam-operasional/${id_jam_operasional}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setJamOperasional((prev) =>
        prev.filter(
          (jamOperasional) =>
            jamOperasional.id_jam_operasional !== id_jam_operasional
        )
      );
      setSuccessMessage("Jam operasional berhasil dihapus.");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Deleted failed:", err);
    }
  };

  const formatJam = (jam: string) => {
    return jam.slice(0, 5); // Mengambil substring dari indeks 0 hingga 5 (HH:MM)
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Manage Tabel Jam Operasional
          </h1>
          <Link
            to="/create-jam-operasional"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link>
        </div>
      </section>

      {/* Card Container */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600 flex justify-between">
          <h3 className="text-lg font-semibold text-white">
            DataTable Jam Operasional
          </h3>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              placeholder="Cari Tipe Layanan / Hari..."
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
          ) : jamOperasional.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">
                Tidak ada data jam operasional
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah jam operasional baru menggunakan tombol + di atas
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
                      Tipe Layanan
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Hari
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Jam Buka
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Jam Tutup
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Status
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
                  {jamOperasional.map((jo, index) => (
                    <tr
                      key={jo.id_jam_operasional}
                      className="hover:bg-gray-700"
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {jo.tipe_layanan}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {jo.hari}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {formatJam(jo.jam_buka)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {formatJam(jo.jam_tutup)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {jo.status}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Tombol Edit */}
                        <Link
                          to={`/edit-jam-operasional/${jo.id_jam_operasional}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(jo.id_jam_operasional)}
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
