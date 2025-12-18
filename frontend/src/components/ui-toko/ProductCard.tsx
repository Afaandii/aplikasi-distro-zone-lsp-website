import React, { useState } from "react";
import {
  FaChevronDown,
  FaFilter,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Navbar from "./Navigation";

// Types
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: "NEW" | "BEST SELLER";
  colors?: string[];
}

interface FilterState {
  categories: string[];
  priceRange: string;
}

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBadgeColor = (badge: string) => {
    return badge === "NEW" ? "bg-orange-500" : "bg-green-500";
  };

  return (
    <div className="group relative bg-zinc-900 rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-300">
      {/* Product Image */}
      <div className="relative aspect-square bg-linear-to-br from-zinc-800 to-zinc-900 overflow-hidden">
        {/* Image Placeholder */}
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
              )} text-white text-xs font-bold px-3 py-1 rounded-full`}
            >
              {product.badge}
            </span>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-300"
        >
          <FaHeart
            className={`w-5 h-5 transition-all duration-300 ${
              isLiked ? "fill-red-500 text-red-500 scale-110" : "text-white"
            }`}
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center space-x-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button className="bg-white hover:bg-orange-500 text-black hover:text-white font-bold px-4 py-2 rounded-lg transition-colors duration-200 text-sm">
              Detail
            </button>
            <button className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center transition-colors duration-200">
              <FaShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Zoom Effect on Image */}
        <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700" />
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
  );
};

// Product Filter Component
const ProductFilter: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
  isMobile?: boolean;
}> = ({ filters, onFilterChange, onClose, isMobile }) => {
  const categories = ["T-Shirt", "Hoodie", "Jaket", "Sweater", "Aksesoris"];
  const priceRanges = [
    { label: "Semua Harga", value: "all" },
    { label: "Di bawah 100k", value: "0-100000" },
    { label: "100k - 200k", value: "100000-200000" },
    { label: "200k - 300k", value: "200000-300000" },
    { label: "Di atas 300k", value: "300000-999999" },
  ];

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const FilterContent = (
    <>
      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
          Kategori
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => toggleCategory(category)}
                className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer"
              />
              <span className="text-gray-400 group-hover:text-white transition-colors text-sm">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-white font-bold text-sm uppercase tracking-wider mb-4">
          Harga
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.value}
                onChange={() =>
                  onFilterChange({ ...filters, priceRange: range.value })
                }
                className="w-5 h-5 border-2 border-white/20 bg-transparent checked:border-orange-500 transition-colors cursor-pointer"
              />
              <span className="text-gray-400 group-hover:text-white transition-colors text-sm">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onFilterChange({ categories: [], priceRange: "all" })}
        className="mt-8 w-full bg-white/5 hover:bg-white/10 border border-white/20 text-white font-bold py-3 rounded-lg transition-colors duration-200"
      >
        Reset Filter
      </button>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-zinc-900 shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-white">FILTER</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              >
                <MdClose className="w-6 h-6 text-white" />
              </button>
            </div>
            {FilterContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-zinc-900 rounded-xl border border-white/10 p-6 sticky top-24">
      <h2 className="text-xl font-black text-white mb-6">FILTER</h2>
      {FilterContent}
    </div>
  );
};

// Product Sort Component
const ProductSort: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { label: "Terbaru", value: "newest" },
    { label: "Harga Terendah", value: "price-asc" },
    { label: "Harga Tertinggi", value: "price-desc" },
    { label: "Nama A-Z", value: "name-asc" },
  ];

  const selectedLabel =
    sortOptions.find((opt) => opt.value === value)?.label || "Urutkan";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-zinc-900 border border-white/10 hover:border-orange-500/50 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-white"
      >
        <span>{selectedLabel}</span>
        <FaChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-xl overflow-hidden z-20">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                  value === option.value
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Pagination Component
const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/10 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
      >
        ‹
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
              currentPage === page
                ? "bg-orange-500 text-white"
                : "bg-zinc-900 border border-white/10 hover:border-orange-500 text-gray-400"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="text-gray-600 px-2">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center bg-zinc-900 border border-white/10 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-white"
      >
        ›
      </button>
    </div>
  );
};

// Main Products Page
const ProductsPage: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: "all",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const itemsPerPage = 12;

  // Dummy Products Data
  const allProducts: Product[] = [
    {
      id: 1,
      name: "Urban Street Tee Black",
      category: "T-Shirt",
      price: 149000,
      originalPrice: 199000,
      image: "tshirt-1",
      badge: "BEST SELLER",
      colors: ["#000000", "#FFFFFF", "#DC2626"],
    },
    {
      id: 2,
      name: "Oversized Hoodie Premium",
      category: "Hoodie",
      price: 299000,
      image: "hoodie-1",
      badge: "NEW",
      colors: ["#000000", "#374151", "#7C3AED"],
    },
    {
      id: 3,
      name: "Classic Logo Tee White",
      category: "T-Shirt",
      price: 139000,
      image: "tshirt-2",
      colors: ["#FFFFFF", "#000000", "#F97316"],
    },
    {
      id: 4,
      name: "Vintage Denim Jacket",
      category: "Jaket",
      price: 449000,
      image: "jacket-1",
      colors: ["#1F2937", "#78716C"],
    },
    {
      id: 5,
      name: "Graphic Tee Vol.2",
      category: "T-Shirt",
      price: 159000,
      image: "tshirt-3",
      badge: "NEW",
      colors: ["#000000", "#FFFFFF", "#0EA5E9"],
    },
    {
      id: 6,
      name: "Zipper Hoodie Grey",
      category: "Hoodie",
      price: 319000,
      image: "hoodie-2",
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
    {
      id: 9,
      name: "Bomber Jacket Black",
      category: "Jaket",
      price: 499000,
      image: "jacket-2",
      colors: ["#000000", "#1F2937"],
    },
    {
      id: 10,
      name: "Distro Cap Original",
      category: "Aksesoris",
      price: 89000,
      image: "cap-1",
      badge: "NEW",
      colors: ["#000000", "#FFFFFF", "#F97316"],
    },
    {
      id: 11,
      name: "Streetwear Backpack",
      category: "Aksesoris",
      price: 249000,
      image: "bag-1",
      colors: ["#000000", "#1F2937"],
    },
    {
      id: 12,
      name: "Oversized Tee Premium",
      category: "T-Shirt",
      price: 169000,
      originalPrice: 219000,
      image: "tshirt-5",
      badge: "BEST SELLER",
      colors: ["#000000", "#FFFFFF", "#7C3AED"],
    },
    {
      id: 13,
      name: "Pullover Hoodie Navy",
      category: "Hoodie",
      price: 289000,
      image: "hoodie-3",
      colors: ["#1E3A8A", "#000000"],
    },
    {
      id: 14,
      name: "Canvas Tote Bag",
      category: "Aksesoris",
      price: 129000,
      image: "bag-2",
      badge: "NEW",
      colors: ["#F5F5DC", "#000000"],
    },
    {
      id: 15,
      name: "Windbreaker Jacket",
      category: "Jaket",
      price: 399000,
      image: "jacket-3",
      colors: ["#000000", "#DC2626", "#F97316"],
    },
    {
      id: 16,
      name: "Basic Crew Tee Pack",
      category: "T-Shirt",
      price: 349000,
      originalPrice: 447000,
      image: "tshirt-pack",
      colors: ["#000000", "#FFFFFF", "#6B7280"],
    },
  ];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    // Price filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (product.price < min || product.price > max) {
        return false;
      }
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter - Desktop */}
          <aside className="lg:w-64 shrink-0">
            <ProductFilter filters={filters} onFilterChange={setFilters} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              {/* Header */}
              <div>
                <p className="text-gray-400">
                  Menampilkan {paginatedProducts.length} dari{" "}
                  {sortedProducts.length} produk
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-zinc-900 border border-white/10 hover:border-orange-500/50 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-white"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              {/* Sort Dropdown */}
              <div className="ml-auto">
                <ProductSort value={sortBy} onChange={setSortBy} />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isMobileFilterOpen && (
        <ProductFilter
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setIsMobileFilterOpen(false)}
          isMobile
        />
      )}
    </div>
  );
};

export default ProductsPage;
