import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import axios from "axios";

export default function CreateVarian() {
  const [produk, setProduk] = useState<{ value: string; label: string }[]>([]);
  const [ukuran, setUkuran] = useState<{ value: string; label: string }[]>([]);
  const [warna, setWarna] = useState<{ value: string; label: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_produk: "",
    id_ukuran: "",
    id_warna: "",
    stok_kaos: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken();
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/master-data/produk",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;

          const formattedProduk = data.produk.map((p: any) => ({
            value: p.id_produk.toString(),
            label: p.nama_kaos || "N/A",
          }));
          const formattedUkuran = data.ukuran.map((uk: any) => ({
            value: uk.id_ukuran.toString(),
            label: uk.nama_ukuran || "N/A",
          }));
          const formattedWarna = data.warna.map((wrn: any) => ({
            value: wrn.id_warna.toString(),
            label: wrn.nama_warna || "N/A",
          }));

          setProduk(formattedProduk);
          setUkuran(formattedUkuran);
          setWarna(formattedWarna);
        } else {
          console.error("Gagal memuat data. Silakan coba lagi.");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    };

    fetchData();
  }, []);

  // Handler untuk perubahan input biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler untuk perubahan select
  const handleSelectChange = (name: string) => (value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value.toString() }));
  };

  // Handler untuk submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.id_produk ||
      !formData.id_ukuran ||
      !formData.id_warna ||
      !formData.stok_kaos
    ) {
      alert("Harap lengkapi semua field wajib.");
      return;
    }

    const token = getToken();
    try {
      const payload = {
        id_produk: parseInt(formData.id_produk),
        id_ukuran: parseInt(formData.id_ukuran),
        id_warna: parseInt(formData.id_warna),
        stok_kaos: parseInt(formData.stok_kaos),
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/varian",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setFormData({
          id_produk: "",
          id_ukuran: "",
          id_warna: "",
          stok_kaos: "",
        });

        setTimeout(() => navigate("/varian"), 1000);
        setMessage("Varian berhasil ditambahkan.");
      } else {
        setMessage("Gagal menambahkan varian.");
      }
    } catch (err: any) {
      console.error("Error submitting data:", err);
      let errorMessage = "Terjadi kesalahan saat menyimpan data.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Tambah Varian</h1>
        </div>
      </section>

      {message && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-md flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Produk */}
            <div className="mb-4">
              <label
                htmlFor="id_produk"
                className="block text-sm font-medium text-white mb-1"
              >
                Produk
              </label>
              <Select
                options={produk}
                defaultValue={formData.id_produk}
                placeholder="Pilih produk"
                onChange={handleSelectChange("id_produk")}
                id="id_produk"
                name="id_produk"
              />
            </div>

            {/* Ukuran */}
            <div className="mb-4">
              <label
                htmlFor="id_ukuran"
                className="block text-sm font-medium text-white mb-1"
              >
                Ukuran
              </label>
              <Select
                options={ukuran}
                defaultValue={formData.id_ukuran}
                placeholder="Pilih Tipe"
                onChange={handleSelectChange("id_ukuran")}
                id="id_ukuran"
                name="id_ukuran"
              />
            </div>

            {/* Warna */}
            <div className="mb-4">
              <label
                htmlFor="id_warna"
                className="block text-sm font-medium text-white mb-1"
              >
                Warna
              </label>
              <Select
                options={warna}
                defaultValue={formData.id_warna}
                placeholder="Pilih Ukuran"
                onChange={handleSelectChange("id_warna")}
                id="id_warna"
                name="id_warna"
              />
            </div>

            {/* Stok Kaos */}
            <div className="mb-6">
              <label
                htmlFor="stok_kaos"
                className="block text-sm font-medium text-white mb-1"
              >
                Stok Kaos
              </label>
              <input
                type="number"
                step={0.1}
                inputMode="decimal"
                id="stok_kaos"
                name="stok_kaos"
                value={formData.stok_kaos}
                onChange={handleChange}
                placeholder="Masukan stok produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Tombol Simpan dan Kembali */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                Simpan
              </button>
              <Link
                to="/varian"
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
