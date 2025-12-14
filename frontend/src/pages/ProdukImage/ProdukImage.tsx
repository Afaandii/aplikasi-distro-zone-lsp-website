import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string | null;
  product: {
    id: number;
    product_name: string;
  };
};

export default function ProdukImage() {
  const [productImage, setProductImage] = useState<ProductImage[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchProductImage = async () => {
    try {
      const token = getToken();
      const res = await axios.get(
        "http://localhost:8000/api/v1/product-image",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data);
      if (res.data.success) {
        setProductImage(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching product images:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProductImage();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Anda yakin ingin menghapus produk image ini?")) return;

    const token = getToken();
    try {
      await axios.delete(
        `http://localhost:8000/api/v1/delete-product-image/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProductImage((prev) => prev.filter((brand) => brand.id !== id));
      setSuccessMessage("Product Image berhasil dihapus.");

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
            Manage Tabel Product Image
          </h1>
          <Link
            to="/create-image-product"
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
            DataTable Product Image
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
                    Product Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Image
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
                ) : productImage.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-red-500">
                      Tidak ada data product image
                    </td>
                  </tr>
                ) : (
                  productImage.map((img, index) => (
                    <tr key={img.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {index + 1}
                      </td>

                      {/* Product Name */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-white">
                        {img.product?.product_name || "Tidak ada nama"}
                      </td>

                      {/* Image */}
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                        {img.image_url ? (
                          <img
                            src={img.image_url}
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
                          to={`/edit-image-product/${img.id}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-medium rounded mr-2 transition-colors duration-200"
                        >
                          <FaEdit className="text-lg" />
                        </Link>

                        {/* Delete */}
                        <button
                          className="inline-flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors duration-200"
                          onClick={() => handleDelete(img.id)}
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
