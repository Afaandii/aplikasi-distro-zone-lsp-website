import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import axios from "axios";

type Produk = {
  id_produk: number;
  nama_kaos: string;
};

export default function CreateGambarProduk() {
  const [produk, setProduk] = useState<Produk[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:8080/api/v1/produk", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setProduk(res.data);
        }
      } catch (err) {
        console.error("Gagal memuat data gambar produk:", err);
        setError("Gagal memuat daftar produk. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduk();
  }, []);

  const productOptions = produk.map((product) => ({
    value: product.id_produk.toString(),
    label: product.nama_kaos,
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

    if (!selectedProductId) {
      setError("Silakan pilih produk.");
      return;
    }
    if (!selectedFile) {
      setError("Silakan pilih gambar.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("id_produk", selectedProductId.toString());
    formData.append("url_foto", selectedFile);

    try {
      const token = getToken();
      await axios.post("http://localhost:8080/api/v1/foto-produk", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTimeout(() => navigate("/foto-produk"), 1000);
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
            Form Tambah Gambar Produk
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
                htmlFor="id_produk"
                className="block text-sm font-medium text-white mb-1"
              >
                Produk
              </label>
              <Select
                options={productOptions}
                defaultValue={
                  selectedProductId ? selectedProductId.toString() : ""
                }
                placeholder="Pilih Produk"
                onChange={handleSelectChangeProductImage}
                id="id_produk"
                name="id_produk"
              />
            </div>

            {/* Gambar Field */}
            <div className="mb-6">
              <label
                htmlFor="url_foto"
                className="block text-sm font-medium text-white mb-1"
              >
                Gambar Product
              </label>
              <FileInput onChange={handleFileChange} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-2 bg-red-600 text-white text-sm rounded">
                {error}
              </div>
            )}

            {/* Tombol Simpan dan Kembali */}
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
                to="/foto-produk"
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
