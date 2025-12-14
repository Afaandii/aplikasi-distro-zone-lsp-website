import { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

type Product = {
  id: number;
  category_id: number;
  type_id: number;
  brand_id: number;
  product_name: string;
  price: number;
  stock: number;
  ratings: number;
  spesification_product: string | null;
  information_product: string | null;

  brand_product?: { id: number; brand_name: string };
  category?: { id: number; category_name: string };
  type_product?: { id: number; type_name: string };
};

export default function Produk() {
  const [product, setProduct] = useState<Product[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchProduct = async () => {
    try {
      const token = getToken();

      const res = await axios.get("http://localhost:8000/api/v1/product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);
      if (res.data.status === "success") {
        setProduct(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching brand product:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Anda yakin ingin menghapus product ini?")) return;

    const token = getToken();
    try {
      await axios.delete(`http://localhost:8000/api/v1/delete-product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProduct((prev) => prev.filter((prod) => prod.id !== id));
      setSuccessMessage("Produk berhasil dihapus.");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Deleted failed Product:", err);
    }
  };

  const truncateText = (text: string | null, maxLength: number = 100) => {
    if (!text) return "-";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Manage Tabel Product
          </h1>
          {/* Tombol Tambah */}
          <Link
            to="/create-product"
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
            DataTable Product
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
          ) : product.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Tidak ada data produk</p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah produk baru menggunakan tombol + di atas
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
                      Category_id
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Jenis_id
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Merk_id
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
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Rating
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Spesifikasi Produk
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      Informasi Produk
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
                  {product.map((product, index) => (
                    <tr key={product.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.category?.category_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.type_product?.type_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.brand_product?.brand_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.product_name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.price}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {product.ratings}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {truncateText(product.spesification_product)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {truncateText(product.information_product)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {/* Tombol Edit */}
                        <Link
                          to={`/edit-product/${product.id}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>
                        {/* Tombol Hapus */}
                        <button
                          onClick={() => handleDelete(product.id)}
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
