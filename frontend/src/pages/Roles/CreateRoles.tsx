import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateRoles() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama_role: "",
    keterangan: "",
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
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/role",
        {
          nama_role: formData.nama_role,
          keterangan: formData.keterangan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({ nama_role: "", keterangan: "" });
      if (response.status === 201) {
        setSuccessMessage("Roles berhasil ditambahkan.");
        navigate("/role");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Tambah Role</h1>
        </div>
      </section>

      {/* Form Card */}
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
            {/* Nama role Field */}
            <div className="mb-4">
              <label
                htmlFor="nama_role"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama Role
              </label>
              <input
                type="text"
                id="nama_role"
                name="nama_role"
                value={formData.nama_role}
                onChange={handleChange}
                placeholder="Masukan nama role"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Keterangan Field */}
            <div className="mb-6">
              <label
                htmlFor="keterangan"
                className="block text-sm font-medium text-white mb-1"
              >
                Keterangan
              </label>
              <input
                type="text"
                id="keterangan"
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Masukan keterangan contoh: bisa handle apa...."
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
                to="/role"
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
