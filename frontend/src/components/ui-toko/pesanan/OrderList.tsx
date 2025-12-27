import React, { useState, useEffect } from "react";
import { FiPackage } from "react-icons/fi";
import { type Order } from "./OrderSharedData";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail";
import Navigation from "../Navigation";
import Footer from "../Footer";

// Definisikan interface untuk data pesanan dari backend (sesuai dengan struktur log)
interface BackendProduct {
  id_detail_pesanan: number;
  id_pesanan: number;
  id_produk: number;
  jumlah: number;
  total: number;
  Produk: {
    id_produk: number;
    nama_kaos: string;
    deskripsi: string;
    harga_jual: number;
    harga_pokok: number;
    id_merk: number;
    id_tipe: number;
    berat: number;
    Merk: {
      nama_merk: string;
    };
    Tipe: {
      nama_tipe: string;
    };
    Varian: Array<{
      id_varian: number;
      id_ukuran: number;
      id_warna: number;
      stok_kaos: number;
      Ukuran: {
        nama_ukuran: string;
      };
      Warna: {
        nama_warna: string;
      };
    }>;
    FotoProduk: Array<{
      url_foto: string;
    }>;
  };
}

interface BackendPesanan {
  id_pesanan: number;
  id_pemesan: number;
  diverifikasi_oleh: number | null;
  id_tarif_pengiriman: number;
  kode_pesanan: string;
  metode_pembayaran: string;
  status_pembayaran: string;
  status_pesanan: string;
  subtotal: number;
  total_bayar: number;
  updated_at: string;
  created_at: string;
  Pemesan: {
    id_user: number;
    nama: string;
    no_telp: string;
    alamat: string;
    kota: string;
  };
  TarifPengiriman: {
    wilayah: string;
    harga_per_kg: number;
  };
  DetailPesanan: BackendProduct[]; // Array dari produk
}

// Fungsi helper untuk mengkonversi data backend ke format yang digunakan UI
const convertBackendToOrder = (backendData: BackendPesanan): Order => {
  // Map status pesanan backend ke status UI
  const statusMap: Record<string, Order["status"]> = {
    menunggu_verifikasi_kasir: "waiting",
    diproses: "processing",
    dikemas: "packing",
    dikirim: "shipping",
    selesai: "completed",
  };

  // Default status jika tidak ditemukan di map
  const status: Order["status"] =
    statusMap[backendData.status_pesanan] || "waiting";

  // Map label status
  const statusLabelMap: Record<Order["status"], string> = {
    waiting: "Menunggu Verifikasi",
    processing: "Diproses",
    packing: "Dikemas",
    shipping: "Dikirim",
    completed: "Selesai",
  };

  return {
    id: backendData.kode_pesanan,
    storeName: "DistroZone",
    status: status,
    statusLabel: statusLabelMap[status],
    createdAt: new Date(backendData.created_at).toLocaleDateString("id-ID"),
    products: backendData.DetailPesanan.map((p) => {
      // Ambil informasi dari nested object Produk
      const produk = p.Produk;

      // Ambil warna dan ukuran dari varian pertama (asumsikan varian pertama adalah yang dipilih)
      const firstVarian = produk.Varian[0] || {};
      const warna = firstVarian.Warna?.nama_warna || "Warna Tidak Diketahui";
      const ukuran =
        firstVarian.Ukuran?.nama_ukuran || "Ukuran Tidak Diketahui";

      // Ambil gambar dari foto pertama
      const gambar = produk.FotoProduk[0]?.url_foto || "";

      // Buat variant
      const variant = `${warna}, ${ukuran}`;

      return {
        id: String(p.id_produk),
        name: produk.nama_kaos || "Produk Tanpa Nama",
        image: gambar,
        variant: variant,
        quantity: p.jumlah || 1,
        price: produk.harga_jual || 0,
      };
    }),
    totalAmount: backendData.total_bayar,
    recipient: {
      name: backendData.Pemesan.nama,
      phone: backendData.Pemesan.no_telp,
      address: backendData.Pemesan.alamat,
      city: backendData.Pemesan.kota,
    },
    shipping: {
      courier: backendData.TarifPengiriman.wilayah,
      cost: backendData.TarifPengiriman.harga_per_kg,
      trackingNumber: undefined,
    },
    payment: {
      method: backendData.metode_pembayaran,
      subtotal: backendData.subtotal,
      shippingCost: backendData.total_bayar - backendData.subtotal,
      total: backendData.total_bayar,
    },
  };
};

const OrderList: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Ambil data pesanan dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");

        const response = await fetch(
          "http://localhost:8080/api/v1/pesanan/my",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data pesanan");
        }

        const data = await response.json();
        console.log("Response Data:", data); // Log data untuk debugging

        // Konversi data backend ke format UI
        const convertedOrders = data.map(convertBackendToOrder);

        setOrders(convertedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const tabs = [
    { key: "all", label: "Semua" },
    { key: "waiting", label: "Menunggu" },
    { key: "processing", label: "Diproses" },
    { key: "packing", label: "Dikemas" },
    { key: "shipping", label: "Dikirim" },
    { key: "completed", label: "Selesai" },
  ];

  const filteredOrders =
    selectedTab === "all"
      ? orders
      : orders.filter((order) => order.status === selectedTab);

  if (selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrder(null)}
      />
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 pb-8 pt-14 lg:pt-32">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Pesanan Saya</h1>
          </div>

          {/* Tabs */}
          <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
            <div className="flex gap-2 min-w-max pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                    selectedTab === tab.key
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order List */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          {loading ? (
            // Tampilkan skeleton loader sederhana jika sedang loading
            <div className="text-center py-16">
              <div className="animate-pulse">
                <div className="bg-gray-300 h-16 w-16 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tidak ada pesanan
              </h3>
              <p className="text-gray-500">
                Belum ada pesanan pada kategori ini
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderList;
