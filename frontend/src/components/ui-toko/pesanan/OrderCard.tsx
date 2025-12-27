import React from "react";
import { FaChevronRight, FaShoppingBag } from "react-icons/fa";
import { StatusBadge } from "./OrderSharedComponent";
import type { Order } from "./OrderSharedData";

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const firstProduct = order.products[0];
  const totalItems = order.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FaShoppingBag className="w-4 h-4 text-gray-600" />
          <span className="font-semibold text-gray-800">{order.storeName}</span>
        </div>
        <StatusBadge status={order.status} label={order.statusLabel} />
      </div>

      <div className="p-4">
        <div className="flex gap-4">
          <img
            src={firstProduct.image}
            alt={firstProduct.name}
            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {firstProduct.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{firstProduct.variant}</p>
            <p className="text-sm text-gray-500 mt-1">{totalItems} item</p>
          </div>
        </div>

        {order.products.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              +{order.products.length - 1} produk lainnya
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Total Pembayaran</p>
            <p className="text-lg font-bold text-gray-900">
              Rp {order.totalAmount.toLocaleString("id-ID")}
            </p>
          </div>
          <button
            onClick={onClick}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            Lihat Detail
            <FaChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
