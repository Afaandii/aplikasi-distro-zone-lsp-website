import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import {
  FaPencilAlt,
  FaChevronRight,
  FaChevronLeft,
  FaClipboard,
} from "react-icons/fa";
import { BsBoxArrowLeft } from "react-icons/bs";
import axios from "axios";
import FileInput from "../../components/form/input/FileInput";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [isMobile, setIsMobile] = useState(false);

  // State untuk data user yang sedang login
  const [userData, setUserData] = useState({
    id_user: 0,
    id_role: 0,
    nama: "",
    username: "",
    nik: "",
    alamat: "",
    kota: "",
    no_telp: "",
    foto_profile: "/images/user/default.jpg",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // State untuk form edit
  const [editFormData, setEditFormData] = useState({
    nama: "",
    username: "",
    nik: "",
    alamat: "",
    kota: "",
    no_telp: "",
    password: "",
    profile_image: null as File | null,
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Ambil data user dari localStorage/sessionStorage
  useEffect(() => {
    const getUserFromStorage = () => {
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserData({
            id_user: parsedUser.id_user || 0,
            id_role: parsedUser.id_role || 3,
            nama: parsedUser.nama || "",
            username: parsedUser.username || "",
            nik: parsedUser.nik || "",
            alamat: parsedUser.alamat || "",
            kota: parsedUser.kota || "",
            no_telp: parsedUser.no_telp || "",
            foto_profile: parsedUser.foto_profile || "/images/user/default.jpg",
          });

          setEditFormData({
            nama: parsedUser.nama || "",
            username: parsedUser.username || "",
            nik: parsedUser.nik || "",
            alamat: parsedUser.alamat || "",
            kota: parsedUser.kota || "",
            no_telp: parsedUser.no_telp || "",
            password: "",
            profile_image: null,
          });
        } catch (e) {
          console.error("Error parsing user data from storage:", e);
          setError("Data pengguna tidak valid.");
        }
      } else {
        setError("Data pengguna tidak ditemukan.");
      }
      setLoading(false);
    };

    getUserFromStorage();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditFormData((prev) => ({ ...prev, profile_image: file }));
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const token = getToken();

      const formData = new FormData();
      formData.append("id_role", String(userData.id_role));
      formData.append("nama", editFormData.nama);
      formData.append("username", editFormData.username);
      formData.append("nik", editFormData.nik);
      formData.append("alamat", editFormData.alamat);
      formData.append("kota", editFormData.kota);
      formData.append("no_telp", editFormData.no_telp);

      if (editFormData.password) {
        formData.append("password", editFormData.password);
      }

      if (editFormData.profile_image) {
        formData.append("foto_profile", editFormData.profile_image);
      }

      const response = await axios.put(
        `http://localhost:8080/api/v1/user/${userData.id_user}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedUser = response.data;

        setUserData({
          id_user: updatedUser.id_user,
          id_role: updatedUser.id_role,
          nama: updatedUser.nama,
          username: updatedUser.username,
          nik: updatedUser.nik,
          alamat: updatedUser.alamat,
          kota: updatedUser.kota,
          no_telp: updatedUser.no_telp,
          foto_profile: updatedUser.foto_profile || "/images/user/default.jpg",
        });

        setEditFormData({
          nama: updatedUser.nama,
          username: updatedUser.username,
          nik: updatedUser.nik,
          alamat: updatedUser.alamat,
          kota: updatedUser.kota,
          no_telp: updatedUser.no_telp,
          password: "",
          profile_image: null,
        });

        // Update data user di storage setelah sukses update
        const userToStore = {
          id_user: updatedUser.id_user,
          nama: updatedUser.nama,
          username: updatedUser.username,
          nik: updatedUser.nik,
          alamat: updatedUser.alamat,
          kota: updatedUser.kota,
          no_telp: updatedUser.no_telp,
          foto_profile: updatedUser.foto_profile || "/images/user/default.jpg",
        };

        if (localStorage.getItem("user")) {
          localStorage.setItem("user", JSON.stringify(userToStore));
        }
        if (sessionStorage.getItem("user")) {
          sessionStorage.setItem("user", JSON.stringify(userToStore));
        }

        closeModal();
      } else {
        setError(response.data.message || "Gagal memperbarui data.");
      }
    } catch (err: any) {
      if (err.response) {
        setError(
          `Server Error: ${err.response.status} - ${
            err.response.data.message || err.response.statusText
          }`
        );
      } else if (err.request) {
        setError(
          "Tidak ada respons dari server. Periksa koneksi atau backend."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-2xl p-6 max-w-md">
          <p className="text-red-600 dark:text-red-300">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4 flex items-center">
        <a href="/" className="flex items-center space-x-2">
          <FaChevronLeft className="w-5 h-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Kembali
          </h1>
        </a>
      </div>

      <div className="max-w-6xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-10">
                  <img src="/images/distro-zone-bag.png" alt="Goshop" />
                </div>
                <span className="text-purple-500 font-bold text-xl pt-4">
                  Distro
                </span>
                <span className="text-purple-500 font-bold text-xl pt-4">
                  Zone
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90 mb-4">
                Pusat Akun
              </h2>

              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Detail profil dan pengaturan di halaman ini akan digunakan di
                semua aplikasi{" "}
                <span className="text-green-600 underline cursor-pointer">
                  DistroZone.
                </span>
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 lg:p-8 mb-6">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-6 border-2 border-gray-200 dark:border-gray-700">
                    {userData.foto_profile &&
                    userData.foto_profile !== "/images/user/default.jpg" ? (
                      <img
                        src={userData.foto_profile}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">😊</span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90 mb-1">
                      Profil
                    </h2>
                  </div>
                </div>
                <button
                  onClick={openModal}
                  className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-2"
                >
                  <FaPencilAlt className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    Nama lengkap
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    {userData.nama}
                  </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    Username
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    {userData.username}
                  </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    NIK
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    {userData.nik}
                  </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    Alamat
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    {userData.alamat}
                  </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    Kota
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    {userData.kota}
                  </div>
                </div>

                <div className="flex border-b border-gray-100 dark:border-gray-700 pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    No. Telepon
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    {userData.no_telp}
                  </div>
                </div>

                <div className="flex pb-4">
                  <div className="w-40 text-gray-600 dark:text-gray-400">
                    Password
                  </div>
                  <div className="flex-1 font-medium text-gray-900 dark:text-white/90">
                    ••••••••
                  </div>
                </div>
              </div>
            </div>

            {/* Pembelian Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 lg:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white/90">
                  Pembelian
                </h2>
              </div>
              <button className="w-full flex items-center justify-between px-6 lg:px-8 py-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center">
                  <FaClipboard className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-3" />
                  <span className="font-medium text-gray-900 dark:text-white/90">
                    Daftar Transaksi
                  </span>
                </div>
                <FaChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              {/* Logout Button (Hanya Mobile) */}
              {isMobile && (
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    localStorage.removeItem("user");
                    sessionStorage.removeItem("user");
                    window.location.href = "/";
                  }}
                  className="w-full flex items-center justify-center px-6 lg:px-8 py-5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-100 dark:border-gray-700"
                >
                  <BsBoxArrowLeft className="w-5 h-5 text-red-600 mr-2" />
                  <span className="font-medium text-red-600">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Edit */}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-175 mt-36 lg:mt-32"
      >
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white dark:bg-gray-900 p-4 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
          </div>
          <form className="flex flex-col">
            <div className="h-130 overflow-hidden px-2 pb-3">
              <div className="mt-7">
                <div className="space-y-5">
                  {/* Nama */}
                  <div>
                    <Label>Nama Lengkap</Label>
                    <Input
                      type="text"
                      value={editFormData.nama}
                      onChange={handleInputChange}
                      name="nama"
                    />
                  </div>
                  {/* Username */}
                  <div>
                    <Label>Username</Label>
                    <Input
                      type="text"
                      value={editFormData.username}
                      onChange={handleInputChange}
                      name="username"
                    />
                  </div>
                  {/* NIK */}
                  <div>
                    <Label>NIK</Label>
                    <Input
                      type="text"
                      value={editFormData.nik}
                      onChange={handleInputChange}
                      name="nik"
                    />
                  </div>
                  {/* Alamat */}
                  <div>
                    <Label>Alamat</Label>
                    <Input
                      type="text"
                      value={editFormData.alamat}
                      onChange={handleInputChange}
                      name="alamat"
                    />
                  </div>
                  {/* Kota */}
                  <div>
                    <Label>Kota</Label>
                    <Input
                      type="text"
                      value={editFormData.kota}
                      onChange={handleInputChange}
                      name="kota"
                    />
                  </div>
                  {/* No. Telepon */}
                  <div>
                    <Label>No. Telepon</Label>
                    <Input
                      type="text"
                      value={editFormData.no_telp}
                      onChange={handleInputChange}
                      name="no_telp"
                    />
                  </div>
                  {/* Password */}
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      placeholder="Enter new password (optional)"
                      value={editFormData.password}
                      onChange={handleInputChange}
                      name="password"
                    />
                  </div>
                  {/* Image */}
                  <div>
                    <Label>Foto Profil</Label>
                    <FileInput onChange={handleFileChange} />

                    {/* Gambar Saat Ini */}
                    {userData.foto_profile && (
                      <div className="mt-4">
                        <div className="w-28 h-28 overflow-hidden border border-gray-300 dark:border-gray-700 rounded-lg">
                          <img
                            src={userData.foto_profile}
                            alt="Current Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Gambar saat ini
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Tombol Aksi */}
            <div className="flex items-center gap-3 px-2 mt-6 justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Tutup
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={submitting}
                className={submitting ? "opacity-70 cursor-not-allowed" : ""}
              >
                {submitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
