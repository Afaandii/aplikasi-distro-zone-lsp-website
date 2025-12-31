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

  // Cek apakah boleh approve
  const canApproveNow = () => {
    if (!refund) return true;

    // Ambil metode pembayaran dari Transaksi
    const metodePembayaran = refund.Transaksi.metode_pembayaran || "";
    const isBankTransfer = [
      "BCA",
      "BNI",
      "BRI",
      "MANDIRI",
      "BANK_TRANSFER",
    ].includes(metodePembayaran);

    if (!isBankTransfer) return true;

    // Hitung selisih waktu dari created_at transaksi
    const transactionTime = new Date(refund.created_at).getTime();
    const now = Date.now();
    const diffHours = (now - transactionTime) / (1000 * 60 * 60);

    return diffHours >= 24;
  };

  const handleApprove = async () => {
    if (!refund) return;

    const metodePembayaran = refund.Transaksi.metode_pembayaran || "";
    const isBankTransfer = [
      "BCA",
      "BNI",
      "BRI",
      "MANDIRI",
      "BANK_TRANSFER",
    ].includes(metodePembayaran);

    if (isBankTransfer && !canApproveNow()) {
      alert(
        "⚠️ Refund untuk metode BCA VA hanya dapat diproses setelah 24 jam sejak transaksi."
      );
      return;
    }

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
      navigate("/admin/refunds");
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
      navigate("/admin/refunds");
    } catch (error) {
      console.error("Reject refund error:", error);
      alert("Gagal reject refund");
    }
  };

  if (loading) return <p className="text-black">Loading...</p>;
  if (!refund) return <p className="text-black">Data refund tidak ditemukan</p>;
  const metodePembayaran = refund.Transaksi.metode_pembayaran || "";
  const isBankTransferRefund = [
    "BCA",
    "BNI",
    "BRI",
    "MANDIRI",
    "BANK_TRANSFER",
  ].includes(metodePembayaran);
  const isLessThan24Hours = isBankTransferRefund && !canApproveNow();

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-6">Detail Refund</h1>

      {/* INFO REFUND */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Informasi Refund</h2>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td>Status</td>
              <td className="font-semibold">{refund.status}</td>
            </tr>
            <tr>
              <td>Alasan</td>
              <td>{refund.reason}</td>
            </tr>
            <tr>
              <td>Refund Amount</td>
              <td>Rp {refund.refund_amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Midtrans Order ID</td>
              <td>{refund.midtrans_order_id}</td>
            </tr>
            <tr>
              <td>Tanggal</td>
              <td>{new Date(refund.created_at).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* INFO CUSTOMER */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>
          {refund.User?.nama} ({refund.User?.username})
        </p>
      </div>

      {/* INFO TRANSAKSI */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Transaksi</h2>
        <table className="w-full text-sm">
          <tbody>
            <tr>
              <td>Kode Transaksi</td>
              <td>{refund.Transaksi.kode_transaksi}</td>
            </tr>
            <tr>
              <td>Total</td>
              <td>Rp {refund.Transaksi.total.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Metode Pembayaran</td>
              <td>{refund.Transaksi.metode_pembayaran || "-"}</td>{" "}
            </tr>
            {refund.Transaksi.Customer && (
              <tr>
                <td>Customer</td>
                <td>{refund.Transaksi.Customer.nama}</td>
              </tr>
            )}
            {refund.Transaksi.Kasir && (
              <tr>
                <td>Kasir</td>
                <td>{refund.Transaksi.Kasir.nama}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ACTION ADMIN */}
      {refund.status === "PENDING" && (
        <div className="border-t pt-4">
          <h2 className="font-semibold mb-2">Admin Action</h2>

          {isLessThan24Hours && (
            <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded">
              ⏳ Refund untuk metode {metodePembayaran} hanya dapat diproses
              setelah 24 jam sejak transaksi.
            </div>
          )}

          <textarea
            className="w-full border p-2 mb-4 text-black"
            placeholder="Catatan admin (opsional)"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />

          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={isLessThan24Hours}
              className={`px-4 py-2 rounded ${
                isLessThan24Hours
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              Approve
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {refund.status !== "PENDING" && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <p className="font-semibold">Admin Note</p>
          <p>{refund.admin_note || "-"}</p>
        </div>
      )}
    </div>
  );
};

export default RefundAdminDetail;
