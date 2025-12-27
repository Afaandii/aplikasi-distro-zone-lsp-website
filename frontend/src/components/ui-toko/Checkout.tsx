import React, { useState, useEffect } from "react";
import { FiMapPin, FiShoppingBag, FiAlertCircle } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface Address {
  id: string;
  name: string;
  phone: string;
  fullAddress: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface TarifPengiriman {
  wilayah: string;
}

interface AlertStates {
  show: boolean;
  message: string;
  type: "success" | "error";
}

const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>();
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [ongkir, setOngkir] = useState<number>(0);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [alamat, setAlamat] = useState("");
  const [kota, setKota] = useState("");
  const [daftarKota, setDaftarKota] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<AlertStates>({
    show: false,
    message: "",
    type: "success",
  });
  const products: Product[] = location.state?.products || [];

  // Ambil daftar kota dari API saat komponen pertama kali dimuat
  useEffect(() => {
    const fetchDaftarKota = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/v1/tarif-pengiriman"
        );
        if (!response.ok) {
          throw new Error("Gagal mengambil daftar kota");
        }
        const data = await response.json();

        const kotaList = data.map((item: TarifPengiriman) =>
          item.wilayah.trim()
        );
        setDaftarKota(kotaList);

        if (selectedAddress) {
          const currentCity =
            selectedAddress.fullAddress.split(", ").pop() || "";
          if (!kotaList.includes(currentCity)) {
            setKota("");
          } else {
            setKota(currentCity);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchDaftarKota();
  }, []);

  // Calculate subtotal
  useEffect(() => {
    const calculatedSubtotal = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);
  }, [products]);

  useEffect(() => {
    if (!selectedAddress || products.length === 0) return;

    const fetchPreview = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await fetch("http://localhost:8080/api/checkout/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alamat_pengiriman: selectedAddress.fullAddress,
          items: products.map((p) => ({
            id: Number(p.id),
            quantity: p.quantity,
          })),
        }),
      });

      const data = await res.json();

      setSubtotal(data.subtotal);
      setOngkir(data.ongkir);
      setTotal(data.total);
    };

    fetchPreview();
  }, [selectedAddress, products]);

  // Handle checkout
  const handleCheckout = async () => {
    if (!selectedAddress) return;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8080/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          alamat_pengiriman: selectedAddress.fullAddress,
          items: products.map((p) => ({
            id: Number(p.id),
            quantity: p.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Response tidak OK");
      }

      const data = await response.json();

      if (!data.snap_token) {
        alert("Snap token tidak ditemukan");
        return;
      }

      // ✅ INI TOKEN MIDTRANS
      const snapToken = data.snap_token;

      // ✅ CEK SNAP
      if (!window.snap) {
        alert("Midtrans Snap belum dimuat");
        return;
      }

      // 🔥 TAMPILKAN SNAP
      window.snap.pay(snapToken, {
        onSuccess: function (result) {
          console.log("SUCCESS", result);
          setAlerts({
            show: true,
            message:
              "Pembayaran berhasil!, pesanan sedang diverifikasi oleh kasir",
            type: "success",
          });

          setTimeout(() => {
            setAlerts({ show: false, message: "", type: "success" });
            const firstProductId = products[0]?.id;
            console.log(firstProductId);
            if (firstProductId) {
              navigate(`/detail-produk/${firstProductId}`);
            } else {
              navigate(-1);
            }
          }, 2000);
        },
        onPending: function (result) {
          console.log("PENDING", result);
        },
        onError: function (result) {
          console.error("ERROR", result);
          setAlerts({
            show: true,
            message: "Terjadi kesalahan saat pembayaran. Silakan coba lagi.",
            type: "error",
          });
        },
        onClose: function () {
          console.log("Snap ditutup");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat checkout");
    }
  };

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    const sessionUser = sessionStorage.getItem("user");

    const userData = localUser
      ? JSON.parse(localUser)
      : sessionUser
      ? JSON.parse(sessionUser)
      : null;

    if (userData) {
      const mappedAddress: Address = {
        id: String(userData.id_user),
        name: userData.nama,
        phone: userData.no_hp || "",
        fullAddress: `${userData.alamat}, ${userData.kota}`,
      };

      setSelectedAddress(mappedAddress);
      setAlamat(userData.alamat);
      setKota(userData.kota);
    }
  }, []);

  const handleSaveAddress = async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/v1/user/address", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        alamat,
        kota,
      }),
    });

    if (!res.ok) {
      alert("Gagal menyimpan alamat");
      return;
    }

    const data = await res.json();

    // update state
    setSelectedAddress({
      id: String(data.id),
      name: data.nama,
      phone: data.no_hp,
      fullAddress: `${data.alamat}, ${data.kota}`,
    });

    // update local storage
    localStorage.setItem("user", JSON.stringify(data));

    setShowAddressModal(false);
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (!products.length) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-600">Tidak ada produk untuk checkout</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 py-8 mt-14 lg:mt-28">
        {/* Tampilkan Alert Kustom */}
        {alerts.show && (
          <div
            className={`fixed top-32 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-opacity duration-300 ${
              alerts.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {alerts.message}
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Column - 70% */}
            <div className="lg:col-span-8 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiMapPin className="text-gray-600 text-xl mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Alamat Pengiriman
                  </h2>
                </div>

                {selectedAddress ? (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedAddress.name}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {selectedAddress.phone}
                        </p>
                        <p className="text-gray-700 text-sm mt-2">
                          {selectedAddress.fullAddress}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="text-green-600 text-sm font-medium hover:text-green-700"
                      >
                        Ubah
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <FiAlertCircle className="text-yellow-600 mt-0.5 mr-2" />
                      <div className="flex-1">
                        <p className="text-yellow-800 text-sm font-medium">
                          Alamat pengiriman belum ditambahkan
                        </p>
                        <button
                          onClick={() => setShowAddressModal(true)}
                          className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                        >
                          Tambah Alamat
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <FiShoppingBag className="text-gray-600 text-xl mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Produk yang Dibeli
                  </h2>
                </div>

                <div className="space-y-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start border border-gray-200 rounded-lg p-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-4 flex-1">
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>
                        <div className="mt-1 text-sm text-gray-600">
                          <p>Warna: {product.color}</p>
                          <p>Ukuran: {product.size}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Jumlah: {product.quantity}
                          </span>
                          <span className="font-semibold text-gray-900">
                            {formatCurrency(product.price * product.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - 30% (Sticky) */}
            <div className="lg:col-span-4 mt-6 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm p-6 lg:sticky lg:top-32">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Ringkasan Belanja
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal Produk</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Ongkos Kirim</span>
                    <span>{formatCurrency(ongkir)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold text-gray-900">
                    Total Bayar
                  </span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={!selectedAddress}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Bayar Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              {selectedAddress ? "Ubah Alamat" : "Tambah Alamat"}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Alamat Lengkap
                </label>
                <textarea
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  className="w-full border rounded-lg p-2"
                  rows={3}
                  placeholder="Contoh: Jl. Gembili No 2, Desa Wage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Kota</label>
                <select
                  value={kota}
                  onChange={(e) => setKota(e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Pilih Kota</option>
                  {daftarKota.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Batal
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Checkout;
