import { useState, useEffect } from "react";
import axios from "axios";
// import { Link } from "react-router-dom";
// import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

type Transaction = {
  id: number;
  user_id: number;
  transaction_code: string | null;
  total_amount: number;
  transaction_status: string;
  payment_method: string;
  midtrans_order_id: string;
  paid_at: any;

  user?: { id: number; name: string };
};

export default function Transaction() {
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const fetchTransaction = async () => {
    try {
      const token = getToken();

      const res = await axios.get("http://localhost:8000/api/v1/transaction", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.status === "success") {
        setTransaction(res.data.transaction);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  // const handleDelete = async (id: number) => {
  //   if (!window.confirm("Anda yakin ingin menghapus kategori ini?")) return;

  //   const token = getToken();
  //   try {
  //     await axios.delete(
  //       `http://localhost:8000/api/v1/delete-categories/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     setpayment((prev) => prev.filter((cat) => cat.id !== id));
  //     setSuccessMessage("Kategori berhasil dihapus.");

  //     setTimeout(() => setSuccessMessage(null), 3000);
  //   } catch (err) {
  //     console.error("Delete failed:", err);
  //   }
  // };

  return (
    <>
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">
            Manage Tabel Transaksi
          </h1>

          {/* <Link
            to="/create-category"
            className="inline-flex items-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            <FaPlus className="text-lg" />
          </Link> */}
        </div>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            DataTable Transaksi
          </h3>
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
          ) : transaction.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-red-500 text-lg">Tidak ada data transaksi</p>
              <p className="text-gray-400 text-sm mt-2">
                Silakan tambah transaksi baru menggunakan tombol + di atas
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
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kode Transaksi
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Midtrans Order Id
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Metode Pembayaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Total Pembayaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status Pembayaran
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Tanggal Pembayaran
                    </th>
                    {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th> */}
                  </tr>
                </thead>

                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {transaction.map((trans, index) => (
                    <tr key={trans.id} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{index + 1}</td>
                      <td className="px-4 py-3 text-white">
                        {trans.user?.name}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.transaction_code}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.midtrans_order_id}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.payment_method}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.total_amount}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.transaction_status}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {trans.paid_at}
                      </td>

                      {/* <td className="px-4 py-3">
                        <Link
                          to={`/edit-category/${pay.id}`}
                          className="inline-flex items-center px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded mr-2"
                        >
                          <FaEdit className="text-lg" />
                        </Link>

                        <button
                          onClick={() => handleDelete(pay.id)}
                          className="inline-flex items-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </td> */}
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
