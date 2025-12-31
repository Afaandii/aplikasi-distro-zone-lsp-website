import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";

type User = {
  id_user: number;
  nama: string;
  username: string;
};

type Transaksi = {
  id_transaksi: number;
  kode_transaksi: string;
  total: number;
};

type Refund = {
  id_refund: number;
  midtrans_order_id: string;
  refund_amount: number;
  reason: string;
  status: string;
  created_at: string;
  User?: User;
  Transaksi?: Transaksi;
};

export default function RefundAdmin() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchRefunds = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/refunds",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRefunds(res.data);
    } catch (error) {
      console.error("Error fetch refund:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <>
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white">Data Refund Customer</h1>
      </section>

      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-4 py-3 bg-gray-700 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">
            Daftar Pengajuan Refund
          </h3>
        </div>

        <div className="p-4">
          {loading ? (
            <p className="text-gray-300 text-center">Loading refund...</p>
          ) : refunds.length === 0 ? (
            <p className="text-red-400 text-center">
              Belum ada pengajuan refund
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-600">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-4 py-3 text-gray-300">No</th>
                    <th className="px-4 py-3 text-gray-300">Customer</th>
                    <th className="px-4 py-3 text-gray-300">Order ID</th>
                    <th className="px-4 py-3 text-gray-300">Jumlah Refund</th>
                    <th className="px-4 py-3 text-gray-300">Status</th>
                    <th className="px-4 py-3 text-gray-300">Tanggal</th>
                    <th className="px-4 py-3 text-gray-300">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-600">
                  {refunds.map((r, i) => (
                    <tr key={r.id_refund} className="hover:bg-gray-700">
                      <td className="px-4 py-3 text-white">{i + 1}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {r.User?.nama ?? "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {r.midtrans_order_id ||
                          r.Transaksi?.kode_transaksi ||
                          "-"}
                      </td>

                      <td className="px-4 py-3 text-green-400">
                        {formatRupiah(
                          r.refund_amount > 0
                            ? r.refund_amount
                            : r.Transaksi?.total ?? 0
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            r.status === "PENDING"
                              ? "bg-yellow-600 text-white"
                              : r.status === "APPROVED"
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/detail-refund/${r.id_refund}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          Detail
                        </Link>
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
