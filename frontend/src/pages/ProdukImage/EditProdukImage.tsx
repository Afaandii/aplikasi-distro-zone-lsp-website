import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import axios from "axios";

type Product = {
  id: number;
  product_name: string;
};

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string | null;
  product: {
    id: number;
    product_name: string;
  };
};

export default function EditProdukImage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [productImage, setProductImage] = useState<ProductImage | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const token = getToken();
        const res = await axios.get(
          `http://localhost:8000/api/v1/edit-product-image/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === "success") {
          const { product_image, products } = res.data.data;

          setProductImage(product_image);
          setProducts(products);
          setSelectedProductId(product_image.product_id);
        }
      } catch (err) {
        console.error("Gagal memuat data:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const productOptions = products.map((product) => ({
    value: product.id.toString(),
    label: product.product_name,
  }));

  const handleSelectChangeProductImage = (value: string | number) => {
    setSelectedProductId(Number(value));
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) {
      setError("ID tidak ditemukan.");
      return;
    }

    if (!selectedProductId) {
      setError("Silakan pilih produk.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("product_id", selectedProductId.toString());

    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    try {
      const token = getToken();
      await axios.post(
        `http://localhost:8000/api/v1/update-product-image/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/image-product");
    } catch (err: any) {
      console.error("Error saat menyimpan:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan saat menyimpan data. Silakan coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Form Edit Product Image
          </h1>
        </div>
      </section>

      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Product */}
            <div className="mb-4">
              <label
                htmlFor="product_id"
                className="block text-sm font-medium text-white mb-1"
              >
                Product
              </label>
              <Select
                options={productOptions}
                placeholder="Pilih Product"
                onChange={handleSelectChangeProductImage}
                id="product_id"
                name="product_id"
                defaultValue={selectedProductId?.toString()}
              />
            </div>

            {/* Image Field */}
            <div className="mb-6">
              <label
                htmlFor="image"
                className="block text-sm font-medium text-white mb-1"
              >
                Image Product
              </label>
              <FileInput onChange={handleFileChange} className="custom-class" />

              {loading ? (
                <div className="mt-2">
                  <div className="w-32 h-28 bg-gray-700 animate-pulse rounded border border-gray-600" />
                  <span className="block mt-2 text-sm text-gray-400">
                    Loading data...
                  </span>
                </div>
              ) : productImage?.image_url ? (
                <div className="mt-2">
                  <img
                    src={productImage.image_url}
                    alt="Current"
                    className="w-32 h-28 object-cover rounded border border-gray-600"
                  />
                  <span className="block mt-2 text-sm text-gray-400">
                    Gambar saat ini
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-sm text-gray-500 italic">
                    Belum ada gambar.
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-2 bg-red-600 text-white text-sm rounded">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                type="submit"
                disabled={submitting || loading}
                className={`inline-flex items-center px-4 py-2 font-medium rounded-md transition-colors duration-200 ${
                  submitting || loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </button>
              <Link
                to="/image-product"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                Kembali
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
