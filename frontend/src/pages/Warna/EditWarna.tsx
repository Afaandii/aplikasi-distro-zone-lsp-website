import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditWarna() {
  const { id_warna } = useParams<{ id_warna: string }>();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nama_warna: "",
    keterangan: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchWarna = async () => {
    try {
      const token = getToken();

      const res = await axios.get(
        `http://localhost:8080/api/v1/warna/${id_warna}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cari kategori sesuai ID
      const wrn = res.data;
      if (wrn) {
        setFormData({
          nama_warna: wrn.nama_warna,
          keterangan: wrn.keterangan ?? "",
        });
      }
    } catch (err) {
      console.error("Error fetching warna:", err);
    }
  };

  useEffect(() => {
    fetchWarna();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();
    try {
      const response = await axios.put(
        `http://localhost:8080/api/v1/warna/${id_warna}`,
        {
          nama_warna: formData.nama_warna,
          keterangan: formData.keterangan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Warna berhasil diperbarui.");
        navigate("/warna");
      }
    } catch (error) {
      console.error("Error updating warna:", error);
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
          <h1 className="text-2xl font-bold text-white">Form Edit Warna</h1>
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
            {/* Nama warna */}
            <div className="mb-4">
              <label
                htmlFor="nama_warna"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama Warna
              </label>
              <input
                type="text"
                id="nama_warna"
                name="nama_warna"
                value={formData.nama_warna}
                onChange={handleChange}
                placeholder="Masukan nama warna"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* keterangan warna */}
            <div className="mb-6">
              <label
                htmlFor="keterangan"
                className="block text-sm font-medium text-white mb-1"
              >
                Keterangan Warna
              </label>
              <input
                type="text"
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Masukan keterangan merk"
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
                to="/warna"
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
