import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import axios from "axios";

export default function EditVarian() {
  const { id_varian } = useParams<{ id_varian: string }>();
  const navigate = useNavigate();

  const [produk, setProduk] = useState<{ value: string; label: string }[]>([]);
  const [ukuran, setUkuran] = useState<{ value: string; label: string }[]>([]);
  const [warna, setWarna] = useState<{ value: string; label: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

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
    const token = getToken();

    const fetchData = async () => {
      try {
        const [varianRes, masterRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/varian/${id_varian}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/api/v1/master-data/produk`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const varian = varianRes.data;
        const master = masterRes.data;

        //  form dari produk
        setFormData({
          id_produk: String(varian.id_produk ?? ""),
          id_ukuran: String(varian.id_ukuran ?? ""),
          id_warna: String(varian.id_warna ?? ""),
          stok_kaos: String(varian.stok_kaos ?? ""),
        });

        // options select dari MASTER TABLE
        setProduk(
          master.produk.map((p: any) => ({
            value: String(p.id_produk),
            label: p.nama_kaos,
          }))
        );
        setUkuran(
          master.ukuran.map((uk: any) => ({
            value: String(uk.id_ukuran),
            label: uk.nama_ukuran,
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
  }, [id_varian]);

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
      !formData.id_produk ||
      !formData.id_ukuran ||
      !formData.id_warna ||
      !formData.stok_kaos
    ) {
      setMessage("Harap lengkapi semua field wajib.");
      return;
    }

    try {
      const payload = {
        id_produk: parseInt(formData.id_produk),
        id_ukuran: parseInt(formData.id_ukuran),
        id_warna: parseInt(formData.id_warna),
        stok_kaos: parseInt(formData.stok_kaos),
      };

      await axios.put(
        `http://localhost:8080/api/v1/varian/${id_varian}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Varian berhasil diperbarui.");
      setTimeout(() => navigate("/varian"), 1000);
    } catch (err: any) {
      console.error("Error updating varian:", err);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Edit Varian</h1>
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
                placeholder="Pilih Produk"
                defaultValue={formData.id_produk}
                onChange={handleSelectChange("id_produk")}
                id="id_produk"
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

            {/* Stok Kaos */}
            <div className="mb-6">
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
