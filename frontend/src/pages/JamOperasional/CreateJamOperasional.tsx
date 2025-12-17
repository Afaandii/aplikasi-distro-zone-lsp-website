import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateJamOperasional() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();

    const payload = {
      tipe_layanan: formData.tipe_layanan,
      hari: formData.hari,
      jam_buka: `${formData.jam_buka}:00`,
      jam_tutup: `${formData.jam_tutup}:00`,
      status: formData.status,
    };

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/jam-operasional",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({
        tipe_layanan: "",
        hari: "",
        jam_buka: "",
        jam_tutup: "",
        status: "",
      });
      if (response.status === 201) {
        setSuccessMessage("Jam operasional berhasil ditambahkan.");
        navigate("/jam-operasional");
      }
    } catch (error: any) {
      console.error("Error creating jam operasional:", error);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Form Tambah Jam Operasional
          </h1>
        </div>
      </section>

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
      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Tipe layanan Field */}
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

            {/* Hari Field */}
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
                required
              />
            </div>

            {/* Jam Buka Field */}
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
                required
              />
            </div>

            {/* Jam Tutup Field */}
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
                required
              />
            </div>

            {/* Status Field */}
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
