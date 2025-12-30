import { useEffect, useState } from "react";
import axios from "axios";

type Pesanan = {
  id_pesanan: number;
  kode_pesanan: string;
};

const AjukanKomplain = () => {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [pesananId, setPesananId] = useState<number | null>(null);
  const [jenisKomplain, setJenisKomplain] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    axios
      .get("http://localhost:8080/api/v1/user/pesanan", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPesanan(res.data))
      .catch(console.error);
  }, [token]);

  const submitKomplain = async () => {
    if (
      pesananId === null ||
      pesananId <= 0 ||
      !jenisKomplain ||
      !deskripsi.trim()
    ) {
      alert("Lengkapi semua field");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://localhost:8080/api/v1/complaint",
        {
          id_pesanan: pesananId,
          jenis_komplain: jenisKomplain,
          deskripsi: deskripsi.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Komplain berhasil dikirim");
      setJenisKomplain("");
      setDeskripsi("");
      setPesananId(null);
    } catch (err) {
      alert("Gagal mengirim komplain");
      console.log("Terjadi Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ajukan Komplain</h1>

      <label className="block mb-2 font-semibold">Pilih Pesanan</label>
      <select
        value={pesananId ?? ""}
        onChange={(e) => {
          const val = e.target.value;
          setPesananId(val ? Number(val) : null);
        }}
        className="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="">-- Pilih Pesanan --</option>
        {pesanan.map((p) => (
          <option key={p.id_pesanan} value={p.id_pesanan}>
            {p.kode_pesanan}
          </option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">Jenis Komplain</label>
      <select
        value={jenisKomplain}
        onChange={(e) => setJenisKomplain(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="">-- Pilih Jenis Komplain --</option>
        <option value="barang_rusak">Barang Rusak</option>
        <option value="salah_ukuran">Salah Ukuran</option>
        <option value="tidak_sesuai_gambar">Tidak Sesuai Gambar</option>
        <option value="lama_diproses">Lama Diproses</option>
        <option value="pengiriman_bermasalah">Pengiriman Bermasalah</option>
        <option value="lainnya">Lainnya</option>
      </select>

      <label className="block mb-2 font-semibold">Isi Komplain</label>
      <textarea
        value={deskripsi}
        onChange={(e) => setDeskripsi(e.target.value)}
        rows={4}
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="Jelaskan masalah Anda..."
      />

      <button
        onClick={submitKomplain}
        className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
      >
        {loading ? "Mengirim..." : "Ajukan Komplain"}
      </button>
    </div>
  );
};

export default AjukanKomplain;
