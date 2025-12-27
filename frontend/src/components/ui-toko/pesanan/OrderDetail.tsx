import React from "react";
import { FaChevronRight, FaMapPin } from "react-icons/fa";
import { BsCreditCard } from "react-icons/bs";
import { OrderStatusTracker } from "./OrderSharedComponent";
import type { Order } from "./OrderSharedData";
import Footer from "../Footer";

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
}

const OrderDetail: React.FC<OrderDetailProps> = ({ order, onBack }) => {
  const handleAction = (action: string) => {
    alert(`Action: ${action} untuk pesanan ${order.id}`);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-8">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Detail Pesanan
                </h1>
                <p className="text-sm text-gray-500">{order.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4">
          {/* Status Tracker */}
          <OrderStatusTracker currentStatus={order.status} />

          {/* Shipping Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <FaMapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Informasi Pengiriman
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="w-24 text-gray-500">Penerima:</span>
                <span className="font-medium text-gray-900">
                  {order.recipient.name}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-500">No. HP:</span>
                <span className="text-gray-900">{order.recipient.phone}</span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-500">Alamat:</span>
                <span className="text-gray-900 flex-1">
                  {order.recipient.address}, {order.recipient.city}
                </span>
              </div>
              <div className="flex">
                <span className="w-24 text-gray-500">Wilayah:</span>
                <span className="text-gray-900">{order.shipping.courier}</span>
              </div>
              {/* Hapus bagian No. Resi karena tidak digunakan */}
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Daftar Produk</h3>
              <span className="text-sm text-gray-500">{order.storeName}</span>
            </div>
            <div className="space-y-4">
              {order.products.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.variant}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-gray-500">
                        x{product.quantity}
                      </span>
                      <span className="font-semibold text-gray-900">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BsCreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">
                Ringkasan Pembayaran
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal Produk</span>
                <span className="text-gray-900">
                  Rp {order.payment.subtotal.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Ongkos Kirim</span>
                <span className="text-gray-900">
                  Rp {order.payment.shippingCost.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between">
                <span className="font-semibold text-gray-900">
                  Total Pembayaran
                </span>
                <span className="font-bold text-lg text-gray-900">
                  Rp {order.payment.total.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="pt-2 flex justify-between text-xs">
                <span className="text-gray-500">Metode Pembayaran</span>
                <span className="font-medium text-gray-700">
                  {order.payment.method}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            {order.status === "waiting" && (
              <button
                onClick={() => handleAction("Batalkan Pesanan")}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Batalkan Pesanan
              </button>
            )}
            {order.status === "processing" && (
              <button
                onClick={() => handleAction("Batalkan Pesanan")}
                className="w-full py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Batalkan Pesanan
              </button>
            )}
            {order.status === "packing" && (
              <button
                disabled
                onClick={() => handleAction("Batalkan Pesanan")}
                className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed transition-colors font-medium"
              >
                Batalkan Pesanan
              </button>
            )}
            {order.status === "shipping" && (
              <button
                disabled
                onClick={() => handleAction("Batalkan Pesanan")}
                className="w-full py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed transition-colors font-medium"
              >
                Batalkan Pesanan
              </button>
            )}
            {order.status === "completed" && (
              <button
                onClick={() => handleAction("Beli Lagi")}
                className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Beli Lagi
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderDetail;
