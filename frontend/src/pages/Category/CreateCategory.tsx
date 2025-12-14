import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateCategory() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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

    const token = getToken()

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/create-categories",
        {
          category_name: formData.name,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData({ name: "", description: "" });
      if (response.status === 201) {
        setSuccessMessage("Kategori berhasil ditambahkan.");
        navigate("/category");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Tambah Kategori</h1>
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
            {/* Nama Kategori Field */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama Kategori
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukan nama kategori"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* description Field */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-white mb-1"
              >
                Deskripsi
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Masukan description"
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
                to="/category"
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