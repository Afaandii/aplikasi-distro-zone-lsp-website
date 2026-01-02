import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface User {
  id_user: number;
  nama: string;
  username: string;
}

interface Transaksi {
  id_transaksi: number;
  kode_transaksi: string;
  total: number;
  metode_pembayaran?: string;
  Customer?: User;
  Kasir?: User;
}

interface Refund {
  id_refund: number;
  status: string;
  reason: string;
  admin_note?: string;
  refund_amount: number;
  midtrans_order_id: string;
  created_at: string;
  User: User;
  Transaksi: Transaksi;
}

const RefundAdminDetail = () => {
  const { id_refund } = useParams<{ id_refund: string }>();
  const navigate = useNavigate();

  const [refund, setRefund] = useState<Refund | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const fetchRefundDetail = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/refunds/detail/${id_refund}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setRefund(res.data);
    } catch (error) {
      console.error("Error fetch refund detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundDetail();
  }, [id_refund]);

  const handleApprove = async () => {
    if (!refund) return;

    if (!window.confirm("Approve refund ini?")) return;

    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/refunds/approve/${id_refund}`,
        {
          admin_note: adminNote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Refund approved");
      navigate("/refund");
    } catch (error) {
      console.error("Approve refund error:", error);
      alert("Gagal approve refund");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Reject refund ini?")) return;

    try {
      await axios.put(
        `http://localhost:8080/api/v1/admin/refunds/reject/${id_refund}`,
        {
          admin_note: adminNote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Refund rejected");
      navigate("/refund");
    } catch (error) {
      console.error("Reject refund error:", error);
      alert("Gagal reject refund");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!refund) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-white">Data refund tidak ditemukan</p>
      </div>
    );
  }

  // Format tanggal
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-white mb-6">Detail Refund</h1>

      {/* Header Card */}
      <div className="bg-gray-700 px-4 py-3 rounded-t-lg border-b border-gray-600">
        <h2 className="font-semibold text-white">Detail Refund</h2>
      </div>
      {/* Main Card */}
      <div className="bg-gray-800 rounded-b-lg shadow-lg p-6 max-w-4xl mx-auto">
        {/* Body Card */}
        <div className="p-4 space-y-4 text-white">
          {/* ID Refund */}
          <div>
            <span className="font-medium">ID Refund:</span> {refund.id_refund}
          </div>

          {/* Customer */}
          <div>
            <span className="font-medium">Customer:</span> {refund.User.nama} (
            {refund.User.username})
          </div>

          {/* Kode Transaksi */}
          <div>
            <span className="font-medium">Kode Pesanan:</span>{" "}
            {refund.Transaksi.kode_transaksi}
          </div>

          {/* Metode Pembayaran */}
          <div>
            <span className="font-medium">Metode Pembayaran:</span>{" "}
            {refund.Transaksi.metode_pembayaran || "-"}
          </div>

          {/* Alasan Refund */}
          <div>
            <span className="font-medium">Alasan:</span> {refund.reason}
          </div>

          {/* Jumlah Refund */}
          <div>
            <span className="font-medium">Jumlah Refund:</span> Rp{" "}
            {refund.refund_amount.toLocaleString()}
          </div>

          {/* Midtrans Order ID */}
          <div>
            <span className="font-medium">Midtrans Order ID:</span>{" "}
            {refund.midtrans_order_id}
          </div>

          {/* Status */}
          <div>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                refund.status === "PENDING"
                  ? "bg-yellow-500 text-black"
                  : refund.status === "APPROVED"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {refund.status}
            </span>
          </div>

          {/* Tanggal Dibuat */}
          <div>
            <span className="font-medium">Tanggal Diajukan:</span>{" "}
            {formatDate(refund.created_at)}
          </div>

          {/* Admin Note */}
          {refund.admin_note && (
            <div>
              <span className="font-medium">Catatan Admin:</span>{" "}
              {refund.admin_note}
            </div>
          )}

          {/* Admin Action (hanya jika PENDING) */}
          {refund.status === "PENDING" && (
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Admin Action</h3>

              <textarea
                className="w-full bg-gray-700 text-white border border-gray-600 rounded p-2 mb-4"
                placeholder="Catatan admin (opsional)"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button - Kembali */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => navigate("/refund")}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundAdminDetail;
