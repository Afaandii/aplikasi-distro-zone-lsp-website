import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import axios from "axios";
import TextArea from "../../components/form/input/TextArea";

export default function CreateProduk() {
  const [merk, setMerk] = useState<{ value: string; label: string }[]>([]);
  const [tipe, setTipe] = useState<{ value: string; label: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_merk: "",
    id_tipe: "",
    nama_kaos: "",
    harga_jual: "",
    harga_pokok: "",
    deskripsi: "",
    spesifikasi: "",
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

          // Format Merk
          const formattedMerk = data.merk.map((mrk: any) => ({
            value: mrk.id_merk.toString(),
            label: mrk.nama_merk || "N/A",
          }));

          // Format Tipe
          const formattedTipe = data.tipe.map((tp: any) => ({
            value: tp.id_tipe.toString(),
            label: tp.nama_tipe || "N/A",
          }));

          setMerk(formattedMerk);
          setTipe(formattedTipe);
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
      !formData.id_merk ||
      !formData.id_tipe ||
      !formData.nama_kaos ||
      !formData.harga_jual ||
      !formData.harga_pokok ||
      !formData.deskripsi ||
      !formData.spesifikasi
    ) {
      alert("Harap lengkapi semua field wajib.");
      return;
    }

    const token = getToken();
    try {
      const payload = {
        id_merk: parseInt(formData.id_merk),
        id_tipe: parseInt(formData.id_tipe),
        nama_kaos: formData.nama_kaos,
        harga_jual: parseInt(formData.harga_jual),
        harga_pokok: parseInt(formData.harga_pokok),
        deskripsi: formData.deskripsi,
        spesifikasi: formData.spesifikasi,
      };

      const response = await axios.post(
        "http://localhost:8080/api/v1/produk",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setFormData({
          id_merk: "",
          id_tipe: "",
          nama_kaos: "",
          harga_jual: "",
          harga_pokok: "",
          deskripsi: "",
          spesifikasi: "",
        });

        setTimeout(() => navigate("/produk"), 1000);
        setMessage("Produk berhasil ditambahkan.");
      } else {
        setMessage("Gagal menambahkan produk.");
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
          <h1 className="text-2xl font-bold text-white">Form Tambah Produk</h1>
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
            {/* Merk */}
            <div className="mb-4">
              <label
                htmlFor="id_merk"
                className="block text-sm font-medium text-white mb-1"
              >
                Merk
              </label>
              <Select
                options={merk}
                defaultValue={formData.id_merk}
                placeholder="Pilih Merk"
                onChange={handleSelectChange("id_merk")}
                id="id_merk"
                name="id_merk"
              />
            </div>

            {/* Tipe */}
            <div className="mb-4">
              <label
                htmlFor="id_tipe"
                className="block text-sm font-medium text-white mb-1"
              >
                Tipe
              </label>
              <Select
                options={tipe}
                defaultValue={formData.id_tipe}
                placeholder="Pilih Tipe"
                onChange={handleSelectChange("id_tipe")}
                id="id_tipe"
                name="id_tipe"
              />
            </div>

            {/* Ukuran
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
                placeholder="Pilih Ukuran"
                onChange={handleSelectChange("id_ukuran")}
                id="id_ukuran"
                name="id_ukuran"
              />
            </div>

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
                placeholder="Pilih Warna"
                onChange={handleSelectChange("id_warna")}
                id="id_warna"
                name="id_warna"
              />
            </div> 
            {/* Ukuran */}

            {/* Nama Produk */}
            <div className="mb-4">
              <label
                htmlFor="nama_kaos"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama Produk
              </label>
              <input
                type="text"
                id="nama_kaos"
                name="nama_kaos"
                value={formData.nama_kaos}
                onChange={handleChange}
                placeholder="Masukan nama produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Harga Jual */}
            <div className="mb-4">
              <label
                htmlFor="harga_jual"
                className="block text-sm font-medium text-white mb-1"
              >
                Harga Jual
              </label>
              <input
                type="number"
                id="harga_jual"
                name="harga_jual"
                value={formData.harga_jual}
                onChange={handleChange}
                placeholder="Masukan harga produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Harga Pokok */}
            <div className="mb-4">
              <label
                htmlFor="harga_pokok"
                className="block text-sm font-medium text-white mb-1"
              >
                Harga Pokok
              </label>
              <input
                type="number"
                id="harga_pokok"
                name="harga_pokok"
                value={formData.harga_pokok}
                onChange={handleChange}
                placeholder="Masukan harga produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stok Kaos */}
            {/* <div className="mb-4">
              <label
                htmlFor="stok_kaos"
                className="block text-sm font-medium text-white mb-1"
              >
                Stok Produk
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
            </div> */}

            {/* Deskripsi Produk */}
            <div className="mb-4">
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium text-white mb-1"
              >
                Deskripsi Produk
              </label>
              <TextArea
                rows={6}
                value={formData.deskripsi}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    deskripsi: value,
                  }))
                }
                placeholder="Masukan Deskripsi Produk"
              />
            </div>

            {/* Spesifikasi produk */}
            <div className="mb-6">
              <label
                htmlFor="spesifikasi"
                className="block text-sm font-medium text-white mb-1"
              >
                Spesifikasi Produk
              </label>
              <TextArea
                rows={6}
                value={formData.spesifikasi}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    spesifikasi: value,
                  }))
                }
                placeholder="Masukan Spesifikasi Produk"
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
                to="/produk"
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
