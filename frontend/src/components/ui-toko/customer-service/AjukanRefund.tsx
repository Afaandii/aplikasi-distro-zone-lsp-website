import { useEffect, useState } from "react";
import axios from "axios";

type Transaksi = {
  id_transaksi: number;
  kode_transaksi: string;
  total: number;
};

const AjukanRefund = () => {
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [transaksiId, setTransaksiId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/v1/user/transaksi", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTransaksi(res.data))
      .catch(console.error);
  }, [token]);

  const submitRefund = async () => {
    if (transaksiId === null || transaksiId <= 0 || !reason.trim()) {
      alert("Lengkapi data refund dengan benar");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/v1/refunds",
        {
          id_transaksi: transaksiId,
          reason: reason.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Refund berhasil diajukan");
      setReason("");
      setTransaksiId(null);
    } catch (err) {
      alert("Gagal mengajukan refund");
      console.log("Terjadi error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ajukan Refund</h1>

      <label className="block mb-2 font-semibold">Pilih Transaksi</label>
      <select
        value={transaksiId ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          setTransaksiId(val ? Number(val) : null);
        }}
        className="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="">-- Pilih Transaksi --</option>
        {transaksi.map((t) => (
          <option key={t.id_transaksi} value={t.id_transaksi}>
            {t.kode_transaksi} - Rp {t.total.toLocaleString()}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Alasan Refund</label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        rows={4}
        placeholder="Contoh: barang rusak / salah ukuran"
      />

      <p className="text-sm text-gray-600 mb-4">
        * Refund akan diverifikasi admin sebelum diproses oleh sistem.
      </p>

      <button
        onClick={submitRefund}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        {loading ? "Mengirim..." : "Ajukan Refund"}
      </button>
    </div>
  );
};

export default AjukanRefund;
