import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";

export default function CreateUser() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id_role: "",
    nama: "",
    username: "",
    password: "",
    nik: "",
    alamat: "",
    no_telp: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Fetch roles dari API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/v1/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform data untuk komponen Select
        const roleOptions = response.data.map((role: any) => ({
          value: role.id_role.toString(),
          label: role.nama_role,
        }));

        setRoles(roleOptions);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      id_role: value.toString(),
    }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken();

    try {
      const form = new FormData();

      form.append("id_role", formData.id_role);
      form.append("nama", formData.nama);
      form.append("username", formData.username);
      form.append("password", formData.password);
      form.append("nik", formData.nik);
      form.append("alamat", formData.alamat);
      form.append("no_telp", formData.no_telp);
      if (selectedFile) {
        form.append("foto_profile", selectedFile);
      }

      const response = await axios.post(
        "http://localhost:8080/api/v1/user",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❗ JANGAN set Content-Type manual
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage("User berhasil ditambahkan.");
        navigate("/user");
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      setError(
        error.response?.data?.error ||
          "An error occurred while creating the user"
      );
    }
  };

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Form Tambah User Karyawan
          </h1>
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
        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded-md flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-2 text-white hover:text-gray-200"
            >
              &times;
            </button>
          </div>
        )}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Role */}
            <div className="mb-6">
              <label
                htmlFor="id_role"
                className="block text-sm font-medium text-white mb-1"
              >
                Role
              </label>
              <Select
                options={roles}
                placeholder="Pilih Role"
                onChange={handleRoleChange}
                id="id_role"
                name="id_role"
                defaultValue={formData.id_role}
              />
            </div>

            {/* Nama */}
            <div className="mb-4">
              <label
                htmlFor="nama"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukan nama"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Username*/}
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-white mb-1"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukan username"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            {/* Password */}
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukan password"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Nik */}
            <div className="mb-6">
              <label
                htmlFor="nik"
                className="block text-sm font-medium text-white mb-1"
              >
                Nik
              </label>
              <input
                type="number"
                id="nik"
                name="nik"
                value={formData.nik}
                onChange={handleChange}
                placeholder="Masukan nik"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Alamat */}
            <div className="mb-6">
              <label
                htmlFor="alamat"
                className="block text-sm font-medium text-white mb-1"
              >
                Alamat
              </label>
              <input
                type="text"
                id="alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                placeholder="Masukan alamat"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* No Telp */}
            <div className="mb-6">
              <label
                htmlFor="no_telp"
                className="block text-sm font-medium text-white mb-1"
              >
                No Telp
              </label>
              <input
                type="number"
                id="no_telp"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
                placeholder="Masukan no telp"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Gambar Field */}
            <div className="mb-6">
              <label
                htmlFor="foto_profile"
                className="block text-sm font-medium text-white mb-1"
              >
                Foto Profile
              </label>
              <FileInput onChange={handleFileChange} />
              {selectedFile && (
                <div className="mt-2 text-sm text-gray-400">
                  Selected file: {selectedFile.name}
                </div>
              )}
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
                to="/user"
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
