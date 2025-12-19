import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import axios from "axios";

export default function EditProduk() {
  const { id_produk } = useParams<{ id_produk: string }>();
  const navigate = useNavigate();

  const [merk, setMerk] = useState<{ value: string; label: string }[]>([]);
  const [tipe, setTipe] = useState<{ value: string; label: string }[]>([]);
  const [ukuran, setUkuran] = useState<{ value: string; label: string }[]>([]);
  const [warna, setWarna] = useState<{ value: string; label: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id_merk: "",
    id_tipe: "",
    id_ukuran: "",
    id_warna: "",
    nama_kaos: "",
    harga_jual: "",
    harga_pokok: "",
    stok_kaos: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const token = getToken();

    const fetchData = async () => {
      try {
        const [produkRes, masterRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/produk/${id_produk}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/api/v1/master-data/produk`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const produk = produkRes.data;
        const master = masterRes.data;

        //  form dari produk
        setFormData({
          id_merk: String(produk.id_merk ?? ""),
          id_tipe: String(produk.id_tipe ?? ""),
          id_ukuran: String(produk.id_ukuran ?? ""),
          id_warna: String(produk.id_warna ?? ""),
          nama_kaos: String(produk.nama_kaos ?? ""),
          harga_jual: String(produk.harga_jual ?? ""),
          harga_pokok: String(produk.harga_pokok ?? ""),
          stok_kaos: String(produk.stok_kaos ?? ""),
        });

        // options dari MASTER TABLE
        setMerk(
          master.merk.map((m: any) => ({
            value: String(m.id_merk),
            label: m.nama_merk,
          }))
        );

        setTipe(
          master.tipe.map((t: any) => ({
            value: String(t.id_tipe),
            label: t.nama_tipe,
          }))
        );

        setUkuran(
          master.ukuran.map((u: any) => ({
            value: String(u.id_ukuran),
            label: u.nama_ukuran,
          }))
        );

        setWarna(
          master.warna.map((w: any) => ({
            value: String(w.id_warna),
            label: w.nama_warna,
          }))
        );
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchData();
  }, [id_produk]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();

    if (
      !formData.id_merk ||
      !formData.id_tipe ||
      !formData.id_ukuran ||
      !formData.id_warna ||
      !formData.nama_kaos ||
      !formData.harga_jual ||
      !formData.harga_pokok ||
      !formData.stok_kaos
    ) {
      setMessage("Harap lengkapi semua field wajib.");
      return;
    }

    try {
      const payload = {
        id_merk: parseInt(formData.id_merk),
        id_tipe: parseInt(formData.id_tipe),
        id_ukuran: parseInt(formData.id_ukuran),
        id_warna: parseInt(formData.id_warna),
        nama_kaos: formData.nama_kaos,
        harga_jual: parseInt(formData.harga_jual),
        harga_pokok: parseInt(formData.harga_pokok),
        stok_kaos: parseInt(formData.stok_kaos),
      };

      await axios.put(
        `http://localhost:8080/api/v1/produk/${id_produk}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Produk berhasil diperbarui.");
      setTimeout(() => navigate("/produk"), 1500);
    } catch (err: any) {
      console.error("Error updating produk:", err);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Edit Produk</h1>
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
                placeholder="Pilih Merk"
                defaultValue={formData.id_merk}
                onChange={handleSelectChange("id_merk")}
                id="id_merk"
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
                placeholder="Pilih Tipe"
                defaultValue={formData.id_tipe}
                onChange={handleSelectChange("id_tipe")}
                id="id_tipe"
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
                placeholder="Pilih Ukuran"
                defaultValue={formData.id_ukuran}
                onChange={handleSelectChange("id_ukuran")}
                id="id_ukuran"
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
                placeholder="Pilih Warna"
                defaultValue={formData.id_warna}
                onChange={handleSelectChange("id_warna")}
                id="id_warna"
              />
            </div>

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
                placeholder="Masukan harga jual produk"
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
                placeholder="Masukan harga pokok produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stok Kaos */}
            <div className="mb-4">
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
