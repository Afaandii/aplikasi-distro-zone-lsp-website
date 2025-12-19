import React, { useEffect, useState } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Navbar from "./Navigation";
import axios from "axios";

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
        {/* Real Image */}
        {product.gambar ? (
          <img
            src={product.gambar}
            alt={product.nama}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          // Fallback jika gambar tidak ada
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="text-4xl font-black text-gray-300 mb-2">
                {product.nama.split(" ")[0]}
              </div>
              <div className="text-xs text-gray-400">No Image</div>
            </div>
          </div>
        )}

        {/* Overlay for hover effect (optional) */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
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
        {/* Colors */}
        {product.colors &&
          Array.isArray(product.colors) &&
          product.colors.length > 0 && (
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

  // State untuk menyimpan data produk dan foto dari API
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;

  // Fungsi untuk mengambil data produk dan foto produk
  const fetchProductsAndPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      // Ambil produk
      const productsResponse = await axios.get<{ data: any[] }>(
        "http://localhost:8080/api/v1/produk"
      );

      // Ambil foto produk
      const photosResponse = await axios.get<{ data: any[] }>(
        "http://localhost:8080/api/v1/foto-produk"
      );

      // Map foto produk berdasarkan id_produk
      const photoMap: Record<number, string[]> = {};
      photosResponse.data.forEach((photo: any) => {
        if (!photoMap[photo.id_produk]) {
          photoMap[photo.id_produk] = [];
        }
        photoMap[photo.id_produk].push(photo.url_foto);
      });

      // Transformasi data produk: tambahkan `gambar` (foto pertama) dan `colors` (jika ada)
      const transformedProducts = productsResponse.data.map((p: any) => {
        // Gunakan foto pertama sebagai gambar utama, atau placeholder jika tidak ada
        const firstPhoto = photoMap[p.id_produk]
          ? photoMap[p.id_produk][1]
          : "";

        // Asumsikan colors belum ada di API, jadi kita buat default atau kosong
        // Jika API mengirim colors, ganti [] dengan p.colors
        const colors = p.colors || []; // Sesuaikan jika API kirim field 'colors'

        return {
          id: p.id_produk,
          nama: p.nama_kaos,
          tipe: p.id_tipe === 1 ? "Lengan Panjang" : "Lengan Pendek", // Sesuaikan mapping tipe
          harga: p.harga_jual,
          hargaOri: p.harga_pokok, // Jika harga pokok lebih tinggi, jadikan hargaOri
          gambar: firstPhoto, // Ganti dengan URL default jika tidak ada foto
          colors: colors.length > 0 ? colors : undefined, // Biarkan undefined jika tidak ada warna
        };
      });

      setProducts(transformedProducts);
    } catch (err) {
      console.error("Error fetching products or photos:", err);
      setError("Gagal memuat produk. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  };

  // Efek untuk memuat data saat komponen dimount
  useEffect(() => {
    fetchProductsAndPhotos();
  }, []);

  // Handle perubahan filter atau sort
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // Fungsi untuk memfilter produk
  const filteredProducts = products.filter((product) => {
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

  // Fungsi untuk mengurutkan produk
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

  // Jika sedang loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <ProductFilter filters={filters} onFilterChange={setFilters} />
            </aside>
            <main className="flex-1">
              <div className="text-center py-16">Memuat produk...</div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // Jika error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <ProductFilter filters={filters} onFilterChange={setFilters} />
            </aside>
            <main className="flex-1">
              <div className="text-center py-16 text-red-500">{error}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }

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
