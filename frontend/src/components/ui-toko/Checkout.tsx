import React, { useState, useEffect } from "react";
import { FiMapPin, FiShoppingBag, FiAlertCircle } from "react-icons/fi";
import { useLocation } from "react-router-dom";
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

const Checkout: React.FC = () => {
  const location = useLocation();

  // Dummy Data address
  const dummyAddress: Address = {
    id: "1",
    name: "Budi Santoso",
    phone: "081234567890",
    fullAddress:
      "Jl. Raya Darmo No. 123, Darmo, Wonokromo, Surabaya, Jawa Timur 60241",
  };

  const products: Product[] = location.state?.products || [];

  // States
  const [selectedAddress] = useState<Address | null>(dummyAddress);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  // Calculate subtotal
  useEffect(() => {
    const calculatedSubtotal = products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal);
  }, [products]);

  // Handle checkout
  const handleCheckout = () => {
    console.log("Checkout clicked");
    console.log({
      address: selectedAddress,
      products: products,
      total,
    });
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
                      <button className="text-green-600 text-sm font-medium hover:text-green-700">
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
                        <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
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
      <Footer />
    </>
  );
};

export default Checkout;
