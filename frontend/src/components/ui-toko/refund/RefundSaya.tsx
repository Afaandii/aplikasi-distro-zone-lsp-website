import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../Navigation";
import Footer from "../Footer";

interface Refund {
  id_refund: number;
  kode_transaksi: string;
  total_refund: number;
  alasan: string;
  status_refund: "pending" | "approved" | "rejected";
  admin_note: string | null;
  created_at: string;
}

export default function RefundSaya() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchRefunds = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("Token tidak ditemukan");
          return;
        }

        const res = await axios.get("http://localhost:8080/api/v1/refunds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const mappedRefunds = res.data.map((item: any) => ({
          id_refund: item.id_refund,
          kode_transaksi: item.midtrans_order_id,
          total_refund: item.refund_amount || 0,
          alasan: item.reason,
          status_refund: mapStatus(item.status),
          admin_note: item.admin_note || null,
          created_at: item.created_at,
        }));

        console.log(mappedRefunds);
        setRefunds(mappedRefunds);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data refund");
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  const mapStatus = (
    apiStatus: string
  ): "pending" | "approved" | "rejected" => {
    switch (apiStatus.toLowerCase()) {
      case "pending":
        return "pending";
      case "approved":
      case "success":
        return "approved";
      case "rejected":
      case "failed":
        return "rejected";
      default:
        return "pending";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <>
      <Navigation />
      <div className="p-6 mt-36 mb-12 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Refund Saya</h1>

        {refunds.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Belum ada pengajuan refund.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-purple-600 to-purple-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      No
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Kode Transaksi
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">
                      Total Refund
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {refunds.map((r, index) => (
                    <tr
                      key={r.id_refund}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                        {r.kode_transaksi}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold text-right">
                        Rp {r.total_refund.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status_refund === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : r.status_refund === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {r.status_refund === "pending" && "⏳ "}
                          {r.status_refund === "approved" && "✓ "}
                          {r.status_refund === "rejected" && "✗ "}
                          {r.status_refund.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedRefund(r)}
                          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL DETAIL */}
        {selectedRefund && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-t-xl">
                <h2 className="text-xl font-bold">Detail Refund</h2>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Kode Transaksi</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {selectedRefund.kode_transaksi}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Refund</p>
                  <p className="text-2xl font-bold text-purple-600">
                    Rp {selectedRefund.total_refund.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    Tanggal Pengajuan
                  </p>
                  <p className="text-base font-medium text-gray-900">
                    {formatDate(selectedRefund.created_at)}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Alasan Refund</p>
                  <p className="text-base text-gray-900 leading-relaxed">
                    {selectedRefund.alasan}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">Status</p>
                  <span
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedRefund.status_refund === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedRefund.status_refund === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedRefund.status_refund === "pending" && "⏳ "}
                    {selectedRefund.status_refund === "approved" && "✓ "}
                    {selectedRefund.status_refund === "rejected" && "✗ "}
                    {selectedRefund.status_refund.toUpperCase()}
                  </span>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 font-semibold mb-2">
                    Catatan Admin
                  </p>
                  <p className="text-base text-gray-900 leading-relaxed">
                    {selectedRefund.admin_note || (
                      <span className="text-gray-500 italic">
                        Belum ada balasan dari admin
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200">
                <button
                  onClick={() => setSelectedRefund(null)}
                  className="w-full px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
