import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

type FotoProduk = {
  id_foto_produk: number;
  id_produk: number;
  url_foto: string | null;
  Produk: {
    id_produk: number;
    nama_kaos: string;
  };
};

export default function GambarProduk() {
  const [fotoProduk, setFotoProduk] = useState<FotoProduk[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchFotoProduk = async () => {
    try {
      const token = getToken();
      const res = await axios.get("http://localhost:8080/api/v1/foto-produk", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setFotoProduk(res.data);
      }
    } catch (error) {
      console.error("Error fetching product images:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchFotoProduk();
  }, []);

  const handleDelete = async (id_foto_produk: number) => {
    if (!window.confirm("Anda yakin ingin menghapus foto produk ini?")) return;

    const token = getToken();
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/foto-produk/${id_foto_produk}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFotoProduk((prev) =>
        prev.filter((brand) => brand.id_foto_produk !== id_foto_produk)
      );
      setSuccessMessage("Foto produk berhasil dihapus.");

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
            Manage Tabel Gambar Produk
          </h1>
          <Link
            to="/create-foto-produk"
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
            DataTable Gambar Produk
          </h3>
        </div>

        {/* Card Body */}
        <div className="p-4">
          {/* Pesan Sukses */}
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

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Nama Produk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Gambar Produk
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="bg-gray-800 divide-y divide-gray-600">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-white">
                      Loading data...
                    </td>
                  </tr>
                ) : fotoProduk.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-red-500">
                      Tidak ada data gambar produk
                    </td>
                  </tr>
                ) : (
                  fotoProduk.map((fp, index) => (
                    <tr key={fp.id_foto_produk} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {fp.Produk?.nama_kaos}
                      </td>

                      {/* Gambar */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {fp.url_foto ? (
                          <img
                            src={fp.url_foto}
                            alt="Product"
                            className="w-20 h-20 object-cover rounded"
                          />
                        ) : (
                          "Tidak ada gambar"
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Edit */}
                        <Link
                          to={`/edit-foto-produk/${fp.id_foto_produk}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>

                        {/* Delete */}
                        <button
                          className="inline-flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors duration-200"
                          onClick={() => handleDelete(fp.id_foto_produk)}
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
