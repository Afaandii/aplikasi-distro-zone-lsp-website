import React from "react";
import { FaClock } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { BsBox, BsCheck2Circle, BsTruck } from "react-icons/bs";
import type { Order } from "./OrderSharedData";

// =========================
// 3. STATUS BADGE COMPONENT
// =========================
interface StatusBadgeProps {
  status: Order["status"];
  label: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const statusColors = {
    waiting: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    packing: "bg-purple-100 text-purple-800",
    shipping: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
    >
      {label}
    </span>
  );
};

// =========================
// 4. ORDER STATUS TRACKER COMPONENT
// =========================
interface OrderStatusTrackerProps {
  currentStatus: Order["status"];
}

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
}) => {
  const steps = [
    { key: "waiting", label: "Pesanan Dibuat", icon: FaClock },
    { key: "processing", label: "Diproses", icon: FiPackage },
    { key: "packing", label: "Dikemas", icon: BsBox },
    { key: "shipping", label: "Dikirim", icon: BsTruck },
    { key: "completed", label: "Selesai", icon: BsCheck2Circle },
  ];

  const statusOrder = [
    "waiting",
    "processing",
    "packing",
    "shipping",
    "completed",
  ];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6">Status Pesanan</h3>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden md:block">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-0 relative">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div
                key={step.key}
                className="flex md:flex-col items-center md:items-center gap-3 md:gap-2"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-colors ${
                    isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  } ${isCurrent ? "ring-4 ring-green-100" : ""}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <p
                  className={`text-sm font-medium ${
                    isCompleted ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
