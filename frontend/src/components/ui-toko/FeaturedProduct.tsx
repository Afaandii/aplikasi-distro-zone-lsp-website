import React, { useState } from "react";
import { FaEye, FaHeart, FaShoppingCart } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "BEST SELLER" | "LIMITED";
  colors?: string[];
}

const FeaturedProducts: React.FC = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const products: Product[] = [
    {
      id: 1,
      name: "Urban Street Tee",
      category: "T-Shirt",
      price: 149000,
      originalPrice: 199000,
      image: "tshirt-1",
      badge: "BEST SELLER",
      colors: ["#000000", "#FFFFFF", "#DC2626"],
    },
    {
      id: 2,
      name: "Oversized Hoodie Black",
      category: "Hoodie",
      price: 299000,
      image: "hoodie-1",
      badge: "NEW",
      colors: ["#000000", "#374151", "#7C3AED"],
    },
    {
      id: 3,
      name: "Classic Logo Tee",
      category: "T-Shirt",
      price: 139000,
      image: "tshirt-2",
      colors: ["#000000", "#FFFFFF", "#F97316"],
    },
    {
      id: 4,
      name: "Vintage Jacket",
      category: "Jacket",
      price: 449000,
      image: "jacket-1",
      badge: "LIMITED",
      colors: ["#1F2937", "#78716C"],
    },
    {
      id: 5,
      name: "Graphic Tee Vol.2",
      category: "T-Shirt",
      price: 159000,
      image: "tshirt-3",
      colors: ["#000000", "#FFFFFF", "#0EA5E9"],
    },
    {
      id: 6,
      name: "Zipper Hoodie Grey",
      category: "Hoodie",
      price: 319000,
      image: "hoodie-2",
      badge: "NEW",
      colors: ["#6B7280", "#000000"],
    },
    {
      id: 7,
      name: "Minimal Logo Tee",
      category: "T-Shirt",
      price: 129000,
      image: "tshirt-4",
      colors: ["#000000", "#FFFFFF", "#10B981"],
    },
    {
      id: 8,
      name: "Premium Crewneck",
      category: "Sweater",
      price: 279000,
      image: "sweater-1",
      badge: "BEST SELLER",
      colors: ["#000000", "#9CA3AF", "#DC2626"],
    },
  ];

  const toggleLike = (productId: number) => {
    setLikedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "NEW":
        return "bg-orange-500 text-white";
      case "BEST SELLER":
        return "bg-green-500 text-white";
      case "LIMITED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500" />
              <span className="text-orange-500 font-bold text-sm tracking-wider uppercase">
                Featured Collection
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500" />
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
              PRODUK UNGGULAN
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Koleksi terbaru dan favorit customer yang wajib kamu punya
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300"
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden">
                {/* Image Placeholder with Pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        #f97316,
                        #f97316 10px,
                        transparent 10px,
                        transparent 20px
                      )`,
                    }}
                  />
                  <div className="text-center z-10">
                    <div className="text-4xl font-black text-white/20 mb-2">
                      {product.name.split(" ")[0]}
                    </div>
                    <div className="text-xs text-gray-600">{product.image}</div>
                  </div>
                </div>

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={`${getBadgeColor(
                        product.badge
                      )} text-xs font-bold px-3 py-1 rounded-full`}
                    >
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Like Button */}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-3 right-3 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300 group/like"
                  aria-label="Like product"
                >
                  <FaHeart
                    className={`w-5 h-5 transition-all duration-300 ${
                      likedProducts.has(product.id)
                        ? "fill-red-500 text-red-500 scale-110"
                        : "text-white group-hover/like:scale-110"
                    }`}
                  />
                </button>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <button className="flex items-center space-x-2 bg-white text-black font-bold px-4 py-2 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-200">
                      <FaEye className="w-4 h-4" />
                      <span className="text-sm">Detail</span>
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                      <FaShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Category */}
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  {product.category}
                </div>

                {/* Product Name */}
                <h3 className="text-white font-bold text-base mb-2 line-clamp-1">
                  {product.name}
                </h3>

                {/* Colors */}
                {product.colors && (
                  <div className="flex items-center space-x-2 mb-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        className="w-5 h-5 rounded-full border-2 border-white/20 hover:border-orange-500 transition-colors duration-200"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-orange-500 font-black text-lg">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-gray-600 text-xs line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </div>

                  {/* Discount Badge */}
                  {product.originalPrice && (
                    <div className="bg-red-500/20 text-red-500 text-xs font-bold px-2 py-1 rounded">
                      -
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100
                      )}
                      %
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <button className="group inline-flex items-center space-x-2 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105">
            <span>Lihat Semua Produk</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
