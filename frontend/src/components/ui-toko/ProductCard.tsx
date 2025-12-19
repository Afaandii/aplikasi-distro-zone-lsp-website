import React, { useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Navbar from "./Navigation";

// Types
interface Product {
  id: number;
  nama: string;
  tipe: string;
  harga: number;
  hargaOri?: number;
  gambar: string;
  colors?: string[];
}

interface FilterState {
  categories: string[];
  priceRange: string;
}

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {/* Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-5"
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
            <div className="text-4xl font-black text-gray-300 mb-2">
              {product.nama.split(" ")[0]}
            </div>
            <div className="text-xs text-gray-400">{product.gambar}</div>
          </div>
        </div>

        {/* Zoom Effect on Image */}
        <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {product.tipe}
        </div>

        {/* Product Name */}
        <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-1">
          {product.nama}
        </h3>

        {/* Colors */}
        {product.colors && (
          <div className="flex items-center space-x-2 mb-3">
            {product.colors.map((color, index) => (
              <button
                key={index}
                className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-orange-500 transition-colors duration-200"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-orange-500 font-black text-lg">
              {formatPrice(product.harga)}
            </div>
            {product.hargaOri && (
              <div className="text-gray-400 text-xs line-through">
                {formatPrice(product.hargaOri)}
              </div>
            )}
          </div>

          {product.hargaOri && (
            <div className="bg-red-50 text-red-500 text-xs font-bold px-2 py-1 rounded">
              -
              {Math.round(
                ((product.hargaOri - product.harga) / product.hargaOri) * 100
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
  const tipe = ["Lengan Panjang", "Lengan Pendek"];
  const priceRanges = [
    { label: "Semua Harga", value: "all" },
    { label: "Di bawah 100k", value: "0-100000" },
    { label: "100k - 200k", value: "100000-200000" },
    { label: "200k - 300k", value: "200000-300000" },
    { label: "Di atas 300k", value: "300000-999999" },
  ];

  const toggleTipe = (tipe: string) => {
    const newCategories = filters.categories.includes(tipe)
      ? filters.categories.filter((c) => c !== tipe)
      : [...filters.categories, tipe];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const FilterContent = (
    <>
      {/* Tipe */}
      <div className="mb-8">
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Tipe Kaos
        </h3>
        <div className="space-y-2">
          {tipe.map((tipe) => (
            <label
              key={tipe}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(tipe)}
                onChange={() => toggleTipe(tipe)}
                className="w-5 h-5 rounded border-2 border-gray-300 bg-white checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                {tipe}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
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
                className="w-5 h-5 border-2 border-gray-300 bg-white checked:border-orange-500 transition-colors cursor-pointer"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => onFilterChange({ categories: [], priceRange: "all" })}
        className="mt-8 w-full bg-red-400 hover:bg-red-700 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors duration-200"
      >
        Reset Filter
      </button>
    </>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-gray-900">FILTER</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose className="w-6 h-6 text-gray-900" />
              </button>
            </div>
            {FilterContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block bg-white rounded-xl border border-gray-200 p-6 sticky top-34 shadow-sm">
      <h2 className="text-xl font-black text-gray-900 mb-6">FILTER</h2>
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
        className="flex items-center space-x-2 bg-white border border-gray-300 hover:border-orange-500 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-900"
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
          <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-20">
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
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {option.value}
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
        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-gray-900"
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
                : "bg-white border border-gray-300 hover:border-orange-500 text-gray-600"
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="text-gray-400 px-2">
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 hover:border-orange-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-gray-900"
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

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Dummy Products Data
  const allProducts: Product[] = [
    {
      id: 1,
      nama: "Urban Street Tee Black",
      tipe: "Lengan Panjang",
      harga: 149000,
      hargaOri: 199000,
      gambar: "tshirt-1",
      colors: ["#000000", "#FFFFFF", "#DC2626"],
    },
    {
      id: 2,
      nama: "Oversized Hoodie Premium",
      tipe: "Lengan Panjang",
      harga: 299000,
      gambar: "hoodie-1",
      colors: ["#000000", "#374151", "#7C3AED"],
    },
    {
      id: 3,
      nama: "Classic Logo Tee White",
      tipe: "Lengan Pendek",
      harga: 139000,
      gambar: "tshirt-2",
      colors: ["#FFFFFF", "#000000", "#F97316"],
    },
    {
      id: 4,
      nama: "Vintage Denim Jacket",
      tipe: "Lengan Pendek",
      harga: 449000,
      gambar: "jacket-1",
      colors: ["#1F2937", "#78716C"],
    },
    {
      id: 5,
      nama: "Graphic Tee Vol.2",
      tipe: "Lengan Panjang",
      harga: 159000,
      gambar: "tshirt-3",
      colors: ["#000000", "#FFFFFF", "#0EA5E9"],
    },
    {
      id: 6,
      nama: "Zipper Hoodie Grey",
      tipe: "Lengan Panjang",
      harga: 319000,
      gambar: "hoodie-2",
      colors: ["#6B7280", "#000000"],
    },
    {
      id: 7,
      nama: "Minimal Logo Tee",
      tipe: "Lengan Pendek",
      harga: 129000,
      gambar: "tshirt-4",
      colors: ["#000000", "#FFFFFF", "#10B981"],
    },
    {
      id: 8,
      nama: "Premium Crewneck",
      tipe: "Lengan Pendek",
      harga: 279000,
      gambar: "sweater-1",
      colors: ["#000000", "#9CA3AF", "#DC2626"],
    },
    {
      id: 9,
      nama: "Bomber Jacket Black",
      tipe: "Lengan Panjang",
      harga: 499000,
      gambar: "jacket-2",
      colors: ["#000000", "#1F2937"],
    },
    {
      id: 10,
      nama: "Distro Cap Original",
      tipe: "Lengan Panjang",
      harga: 89000,
      gambar: "cap-1",
      colors: ["#000000", "#FFFFFF", "#F97316"],
    },
    {
      id: 11,
      nama: "Streetwear Backpack",
      tipe: "Lengan Pendek",
      harga: 249000,
      gambar: "bag-1",
      colors: ["#000000", "#1F2937"],
    },
    {
      id: 12,
      nama: "Oversized Tee Premium",
      tipe: "Lengan Pendek",
      harga: 169000,
      hargaOri: 219000,
      gambar: "tshirt-5",
      colors: ["#000000", "#FFFFFF", "#7C3AED"],
    },
    {
      id: 13,
      nama: "Pullover Hoodie Navy",
      tipe: "Lengan Panjang",
      harga: 289000,
      gambar: "hoodie-3",
      colors: ["#1E3A8A", "#000000"],
    },
    {
      id: 14,
      nama: "Canvas Tote Bag",
      tipe: "Lengan Panjang",
      harga: 129000,
      gambar: "bag-2",
      colors: ["#F5F5DC", "#000000"],
    },
    {
      id: 15,
      nama: "Windbreaker Jacket",
      tipe: "Lengan Pendek",
      harga: 399000,
      gambar: "jacket-3",
      colors: ["#000000", "#DC2626", "#F97316"],
    },
    {
      id: 16,
      nama: "Basic Crew Tee Pack",
      tipe: "Lengan Pendek",
      harga: 349000,
      hargaOri: 447000,
      gambar: "tshirt-pack",
      colors: ["#000000", "#FFFFFF", "#6B7280"],
    },
  ];

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.tipe)
    ) {
      return false;
    }

    // Price filter
    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (product.harga < min || product.harga > max) {
        return false;
      }
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.harga - b.harga;
      case "price-desc":
        return b.harga - a.harga;
      case "name-asc":
        return a.nama.localeCompare(b.nama);
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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
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
                <p className="text-gray-600">
                  Menampilkan {paginatedProducts.length} dari{" "}
                  {sortedProducts.length} produk
                </p>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 hover:border-orange-500 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-900"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              {/* Sort Dropdown */}
              <div className="ml-auto">
                <ProductSort value={sortBy} onChange={handleSortChange} />
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
          onFilterChange={handleFilterChange}
          onClose={() => setIsMobileFilterOpen(false)}
          isMobile
        />
      )}
    </div>
  );
};

export default ProductsPage;
