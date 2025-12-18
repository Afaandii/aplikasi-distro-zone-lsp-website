import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Roles = {
  id_role: number;
  nama_role: string;
  keterangan: string | null;
};

export default function Roles() {
  const [roles, setroles] = useState<Roles[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchRoles = async () => {
    try {
      const token = getToken();

      const res = await axios.get("http://localhost:8080/api/v1/role", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setroles(res.data);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async (id_role: number) => {
    if (!window.confirm("Anda yakin ingin menghapus role ini?")) return;

    const token = getToken();
    try {
      await axios.delete(`http://localhost:8080/api/v1/role/${id_role}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setroles((prev) => prev.filter((rol) => rol.id_role !== id_role));
      setSuccessMessage("Role berhasil dihapus.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Manage Tabel Role</h1>
          <Link
            to="/create-role"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">DataTable Role</h3>
        </div>

        <div className="p-4">
          {/* pesan sukses */}
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

          {loading ? (
            <p className="text-gray-300 text-center">Loading Data...</p>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Tidak ada data role</p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah role baru menggunakan tombol + di atas
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Name Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Keterangan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {roles.map((rol, index) => (
                    <tr key={rol.id_role} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{index + 1}</td>
                      <td className="px-4 py-3 text-white">{rol.nama_role}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {rol.keterangan ?? "-"}
                      </td>

                      <td className="px-4 py-3">
                        <Link
                          to={`/edit-role/${rol.id_role}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded mr-2"
                        >
                          <FaEdit className="text-lg" />
                        </Link>

                        <button
                          onClick={() => handleDelete(rol.id_role)}
                          className="inline-flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
