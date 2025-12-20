import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditTarifPengiriman() {
  const { id_tarif_pengiriman } = useParams<{ id_tarif_pengiriman: string }>();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    wilayah: "",
    harga_per_kg: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchTarifPengiriman = async () => {
    try {
      const token = getToken();

      const res = await axios.get(
        `http://localhost:8080/api/v1/tarif-pengiriman/${id_tarif_pengiriman}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cari kategori sesuai ID
      const trfp = res.data;
      if (trfp) {
        setFormData({
          wilayah: trfp.wilayah,
          harga_per_kg: trfp.harga_per_kg,
        });
      }
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };

  useEffect(() => {
    fetchTarifPengiriman();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/tarif-pengiriman/${id_tarif_pengiriman}`,
        {
          wilayah: formData.wilayah,
          harga_per_kg: formData.harga_per_kg,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Tarif pengiriman berhasil diperbarui.");
        setTimeout(() => navigate("/tarif-pengiriman"), 1000);
      }
    } catch (error) {
      console.error("Error updating tarif pengiriman:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Form Edit Tarif Pengiriman
          </h1>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-600 text-white rounded-md flex items-center justify-between">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Nama wilayah */}
            <div className="mb-4">
              <label
                htmlFor="wilayah"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama Wilayah
              </label>
              <input
                type="text"
                id="wilayah"
                name="wilayah"
                value={formData.wilayah}
                onChange={handleChange}
                placeholder="Masukan nama wilayah"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Harga per kg */}
            <div className="mb-6">
              <label
                htmlFor="harga_per_kg"
                className="block text-sm font-medium text-white mb-1"
              >
                Harga PerKg
              </label>
              <input
                type="text"
                id="harga_per_kg"
                name="harga_per_kg"
                value={formData.harga_per_kg}
                onChange={handleChange}
                placeholder="Masukan harga per kg"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                to="/tarif-pengiriman"
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
