import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Select from "../../components/form/Select";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role_id: "",
  });
  const [roles, setRoles] = useState<{ value: string; label: string }[]>([]);
  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken()
        const res = await axios.get(
          `http://localhost:8000/api/v1/auth/edit-user-role/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.status === "Ok") {
          const { roles: allRoles, roleById } = res.data.datas;
          const formattedRoles = allRoles.map((role: any) => ({
            value: role.id.toString(),
            label: role.role_name || "N/A",
          }));

          setRoles(formattedRoles);
          setFormData({
            role_id: roleById.role_id.toString(),
          });
        } else {
          throw new Error(res.data.message || "Unknown error");
        }
      } catch (err: any) {
        if (err.response) {
          setError(`Server Error: ${err.response.status} - ${err.response.data.message}`);
        } else if (err.request) {
          setError("No response from server. Check your network or backend.");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role_id: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = getToken()

    const payload = {
      role_id : formData.role_id
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/v1/auth/update-user-role/${id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === "success") {
        navigate("/users");
      }
    } catch (error) {
      console.error("Error updating role:", error);
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
          <h1 className="text-2xl font-bold text-white">Form manage roles users</h1>
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Dropdown Role */}
            <div className="mb-6">
              <label
                htmlFor="role_id"
                className="block text-sm font-medium text-white mb-1"
              >
                Role
              </label>
              <Select
                options={roles}
                placeholder="Pilih Role"
                onChange={handleRoleChange}
                id="role_id"
                name="role_id"
                defaultValue={formData.role_id}
              />
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