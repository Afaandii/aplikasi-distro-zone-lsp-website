import { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Refund Saya</h1>

      {refunds.length === 0 ? (
        <p>Belum ada pengajuan refund.</p>
      ) : (
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Kode Transaksi</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((r) => (
              <tr key={r.id_refund} className="text-center">
                <td className="p-2 border">{r.kode_transaksi}</td>
                <td className="p-2 border">
                  Rp {r.total_refund.toLocaleString("id-ID")}
                </td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      r.status_refund === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : r.status_refund === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status_refund.toUpperCase()}
                  </span>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => setSelectedRefund(r)}
                    className="text-blue-600 hover:underline"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL DETAIL */}
      {selectedRefund && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-3">Detail Refund</h2>

            <p>
              <strong>Kode Transaksi:</strong> {selectedRefund.kode_transaksi}
            </p>
            <p>
              <strong>Total Refund:</strong> Rp{" "}
              {selectedRefund.total_refund.toLocaleString("id-ID")}
            </p>
            <p className="mt-2">
              <strong>Alasan:</strong>
              <br />
              {selectedRefund.alasan}
            </p>
            <p className="mt-2">
              <strong>Status:</strong>{" "}
              {selectedRefund.status_refund.toUpperCase()}
            </p>

            <p className="mt-2">
              <strong>Catatan Admin:</strong>
              <br />
              {selectedRefund.admin_note
                ? selectedRefund.admin_note
                : "Belum ada balasan dari admin"}
            </p>

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedRefund(null)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
