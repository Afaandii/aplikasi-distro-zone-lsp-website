import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditJamOperasional() {
  const { id_jam_operasional } = useParams<{ id_jam_operasional: string }>();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    tipe_layanan: "",
    hari: "",
    jam_buka: "",
    jam_tutup: "",
    status: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchJamOperasional = async () => {
    try {
      const token = getToken();

      const res = await axios.get(
        `http://localhost:8080/api/v1/jam-operasional/${id_jam_operasional}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cari kategori sesuai ID
      const jop = res.data;
      if (jop) {
        setFormData({
          tipe_layanan: jop.tipe_layanan,
          hari: jop.hari,
          jam_buka: jop.jam_buka,
          jam_tutup: jop.jam_tutup,
          status: jop.status,
        });
      }
    } catch (err) {
      console.error("Error fetching category:", err);
    }
  };

  useEffect(() => {
    fetchJamOperasional();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/jam-operasional/${id_jam_operasional}`,
        {
          tipe_layanan: formData.tipe_layanan,
          hari: formData.hari,
          jam_buka: formData.jam_buka,
          jam_tutup: formData.jam_tutup,
          status: formData.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Jam Operasional berhasil diperbarui.");
        navigate("/jam-operasional");
      }
    } catch (error) {
      console.error("Error updating jam operasional:", error);
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
            Form Edit Jam Operasional
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
            {/* Tipe layanan */}
            <div className="mb-4">
              <label
                htmlFor="tipe_layanan"
                className="block text-sm font-medium text-white mb-1"
              >
                Tipe Layanan
              </label>
              <input
                type="text"
                id="tipe_layanan"
                name="tipe_layanan"
                value={formData.tipe_layanan}
                onChange={handleChange}
                placeholder="Masukan nama merk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Hari */}
            <div className="mb-6">
              <label
                htmlFor="hari"
                className="block text-sm font-medium text-white mb-1"
              >
                Hari
              </label>
              <input
                type="text"
                id="hari"
                name="hari"
                value={formData.hari}
                onChange={handleChange}
                placeholder="Masukan hari"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Jam Buka */}
            <div className="mb-6">
              <label
                htmlFor="jam_buka"
                className="block text-sm font-medium text-white mb-1"
              >
                Jam Buka
              </label>
              <input
                type="time"
                id="jam_buka"
                name="jam_buka"
                value={formData.jam_buka}
                onChange={handleChange}
                placeholder="Masukan jam buka"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Jam Tutup */}
            <div className="mb-6">
              <label
                htmlFor="jam_tutup"
                className="block text-sm font-medium text-white mb-1"
              >
                Jam Tutup
              </label>
              <input
                type="time"
                id="jam_tutup"
                name="jam_tutup"
                value={formData.jam_tutup}
                onChange={handleChange}
                placeholder="Masukan jam tutup"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status */}
            <div className="mb-6">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-white mb-1"
              >
                Status
              </label>
              <input
                type="text"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                placeholder="Masukan status"
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
                to="/jam-operasional"
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
