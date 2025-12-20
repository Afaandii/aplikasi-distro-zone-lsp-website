import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";
import axios from "axios";

type Produk = {
  id_produk: number;
  nama_kaos: string;
};

type FotoProduk = {
  id_foto_produk: number;
  id_produk: number;
  url_foto: string | null;
  Produk: Produk;
};

export default function EditGambarProduk() {
  const { id_foto_produk } = useParams<{ id_foto_produk: string }>();
  const navigate = useNavigate();
  const [produk, setProduk] = useState<Produk[]>([]);
  const [fotoProduk, setFotoProduk] = useState<FotoProduk | null>(null);
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
      if (!id_foto_produk) return;

      try {
        const token = getToken();
        const [fotoRes, produkRes] = await Promise.all([
          axios.get(
            `http://localhost:8080/api/v1/foto-produk/${id_foto_produk}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          axios.get(`http://localhost:8080/api/v1/produk`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (fotoRes.status === 200) {
          const fotoData: FotoProduk = fotoRes.data;

          setFotoProduk(fotoData);
          setSelectedProductId(fotoData.id_produk);
          // ini ambil data master produk
          setProduk(produkRes.data);
        }
      } catch (err) {
        console.error("Gagal memuat data foto produk:", err);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_foto_produk]);

  const productOptions = produk.map((prod) => ({
    value: prod.id_produk.toString(),
    label: prod.nama_kaos,
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

    if (!id_foto_produk) {
      setError("ID foto produk tidak ditemukan.");
      return;
    }

    if (!selectedProductId) {
      setError("Silakan pilih produk.");
      return;
    }
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("id_produk", selectedProductId.toString());

    if (selectedFile) {
      formData.append("url_foto", selectedFile);
    }

    try {
      const token = getToken();
      await axios.put(
        `http://localhost:8080/api/v1/foto-produk/${id_foto_produk}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
            Form Edit Gambar Produk
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
                placeholder="Pilih Produk"
                onChange={handleSelectChangeProductImage}
                id="id_produk"
                name="id_produk"
                defaultValue={selectedProductId?.toString()}
              />
            </div>

            {/* Gambar Field */}
            <div className="mb-6">
              <label
                htmlFor="url_foto"
                className="block text-sm font-medium text-white mb-1"
              >
                Gambar Produk
              </label>
              <FileInput onChange={handleFileChange} className="custom-class" />

              {loading ? (
                <div className="mt-2">
                  <div className="w-32 h-28 bg-gray-700 animate-pulse rounded border border-gray-600" />
                  <span className="block mt-2 text-sm text-gray-400">
                    Loading data...
                  </span>
                </div>
              ) : fotoProduk?.url_foto ? (
                <div className="mt-2">
                  <img
                    src={fotoProduk.url_foto}
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
                    Belum ada gambar produk.
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
