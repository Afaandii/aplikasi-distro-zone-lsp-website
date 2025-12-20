import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "../../components/form/Select";
import FileInput from "../../components/form/input/FileInput";

export default function EditUser() {
  const { id_user } = useParams<{ id_user: string }>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id_role: "",
    nama: "",
    username: "",
    password: "",
    nik: "",
    alamat: "",
    no_telp: "",
    foto_profile: "",
  });
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();

        const [userRes, roleRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/v1/user/${id_user}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:8080/api/v1/role`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const roleOptions = roleRes.data.map((role: any) => ({
          value: role.id_role.toString(),
          label: role.nama_role,
        }));
        setRoles(roleOptions);

        const user = userRes.data;
        setFormData({
          id_role: user.id_role.toString(),
          nama: user.nama,
          username: user.username,
          password: user.password,
          nik: user.nik,
          alamat: user.alamat,
          no_telp: user.no_telp,
          foto_profile: user.foto_profile,
        });
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data user");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    try {
      const token = getToken();
      const form = new FormData();

      form.append("id_role", formData.id_role);
      form.append("nama", formData.nama);
      form.append("username", formData.username);
      if (formData.password) {
        form.append("password", formData.password);
      }
      form.append("nik", formData.nik);
      form.append("alamat", formData.alamat);
      form.append("no_telp", formData.no_telp);

      if (selectedFile) {
        form.append("foto_profile", selectedFile);
      }

      await axios.put(`http://localhost:8080/api/v1/user/${id_user}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTimeout(() => navigate("/user"), 1000);
    } catch (err) {
      console.error(err);
      setError("Gagal mengupdate user");
    }
  };

  if (loading) {
    return (
      <div className="p-5 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Form manage roles users
          </h1>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Dropdown Role */}
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
                htmlFor="url_foto"
                className="block text-sm font-medium text-white mb-1"
              >
                Foto Profile
              </label>
              <FileInput onChange={handleFileChange} className="custom-class" />

              {loading ? (
                <div className="mt-2">
                  <div className="w-32 h-28 bg-gray-700 animate-pulse rounded border border-gray-600" />
                  <span className="block mt-2 text-sm text-gray-400">
                    Loading data...
                  </span>
                </div>
              ) : formData?.foto_profile ? (
                <div className="mt-2">
                  <img
                    src={formData.foto_profile}
                    alt="Current"
                    className="w-32 h-28 object-cover rounded border border-gray-600"
                  />
                  <span className="block mt-2 text-sm text-gray-400">
                    Foto profile saat ini
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <div className="text-sm text-gray-500 italic">
                    Belum ada foto profile.
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                Simpan
              </button>
              <Link
                to="/users"
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
