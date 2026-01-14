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
  idTipe: number;
  harga: number;
  hargaOri?: number;
  gambar: string;
  allPhotos: string[]; // Semua foto produk
}

interface FilterState {
  categories: string[];
  priceRange: string;
}

interface Tipe {
  id_tipe: number;
  nama_tipe: string;
}

// Skeleton Loading
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm animate-pulse">
      <div className="relative aspect-square bg-gray-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(product.gambar);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Reset ke gambar awal saat product berubah
  useEffect(() => {
    setCurrentImage(product.gambar);
  }, [product.gambar]);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md">
      {/* Product Image */}
      <a href={`/detail-produk/${product.id}`}>
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {currentImage ? (
            <img
              src={currentImage}
              alt={product.nama}
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-4xl font-black text-gray-300 mb-2">
                  {product.nama.split(" ")[0]}
                </div>
                <div className="text-xs text-gray-400">No Image</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
        </div>
      </a>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {product.tipe}
        </div>

        {/* Colors - Mini Gallery */}
        {product.allPhotos.length > 1 && (
          <div className="flex items-center space-x-1 mb-3">
            {product.allPhotos.slice(0, 4).map((photoUrl, index) => (
              <div
                key={index}
                className="w-8 h-8 border border-gray-300 rounded-sm overflow-hidden cursor-pointer hover:border-orange-500 transition-colors duration-200 relative group"
                onClick={() => setCurrentImage(photoUrl)}
                onMouseEnter={() => setCurrentImage(photoUrl)}
                onMouseLeave={() => setCurrentImage(product.gambar)}
              >
                <img
                  src={photoUrl}
                  alt={`Varian ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            ))}
          </div>
        )}

        <a href={`/detail-produk/${product.id}`}>
          <h3 className="text-gray-900 font-bold text-base mb-2 line-clamp-1">
            {product.nama}
          </h3>
        </a>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-orange-500 font-black text-lg">
              {formatPrice(product.harga)}
            </div>
          </div>
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
  types: Tipe[];
}> = ({ filters, onFilterChange, onClose, isMobile, types }) => {
  const priceRanges = [
    { label: "Semua Harga", value: "all" },
    { label: "Di bawah 100k", value: "0-100000" },
    { label: "100k - 200k", value: "100000-200000" },
    { label: "200k - 300k", value: "200000-300000" },
    { label: "Di atas 300k", value: "300000-999999" },
  ];

  const toggleTipe = (typeId: number) => {
    const typeIdStr = typeId.toString();
    const newCategories = filters.categories.includes(typeIdStr)
      ? filters.categories.filter((c) => c !== typeIdStr)
      : [...filters.categories, typeIdStr];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const FilterContent = (
    <>
      <div className="mb-8">
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Tipe Kaos
        </h3>
        <div className="space-y-2">
          {types.map((tipe) => (
            <label
              key={tipe.id_tipe}
              className="flex items-center space-x-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(tipe.id_tipe.toString())}
                onChange={() => toggleTipe(tipe.id_tipe)}
                className="w-5 h-5 rounded border-2 border-gray-300 bg-white checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                {tipe.nama_tipe}
              </span>
            </label>
          ))}
        </div>
      </div>

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
  const [types, setTypes] = useState<Tipe[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const itemsPerPage = 12;

  const fetchTypes = async () => {
    try {
      const response = await axios.get<{ data: any[] }>(
        "http://localhost:8080/api/v1/tipe"
      );
      setTypes(
        response.data.map((t: any) => ({
          id_tipe: t.id_tipe,
          nama_tipe: t.nama_tipe,
        }))
      );
    } catch (err) {
      console.error("Error fetching types:", err);
    }
  };

  const fetchProductsAndPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const productsResponse = await axios.get<{ data: any[] }>(
        "http://localhost:8080/api/v1/produk"
      );
      const photosResponse = await axios.get<{ data: any[] }>(
        "http://localhost:8080/api/v1/foto-produk"
      );

      // Kelompokkan SEMUA foto per produk (tanpa butuh id_warna)
      const photosByProduct: Record<number, string[]> = {};
      photosResponse.data.forEach((photo: any) => {
        if (!photosByProduct[photo.id_produk]) {
          photosByProduct[photo.id_produk] = [];
        }
        if (photo.url_foto) {
          photosByProduct[photo.id_produk].push(photo.url_foto);
        }
      });

      const transformedProducts = productsResponse.data.map((p: any) => {
        const tipeObj = types.find((t) => t.id_tipe === p.id_tipe);
        const tipeNama = tipeObj
          ? tipeObj.nama_tipe
          : p.Tipe?.nama_tipe || "Unknown Type";

        const allPhotos = photosByProduct[p.id_produk] || [];
        const firstPhoto = allPhotos[0] || "";

        return {
          id: p.id_produk,
          nama: p.nama_kaos,
          tipe: tipeNama,
          idTipe: p.id_tipe,
          harga: p.harga_jual,
          hargaOri: p.harga_pokok,
          gambar: firstPhoto,
          allPhotos: allPhotos,
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

  useEffect(() => {
    fetchTypes().then(() => {
      fetchProductsAndPhotos();
    });
  }, []);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) => {
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.idTipe.toString())
    ) {
      return false;
    }

    if (filters.priceRange !== "all") {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (product.harga < min || product.harga > max) {
        return false;
      }
    }

    return true;
  });

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

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filter (tetap tampil tapi disabled) */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-34 shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  ))}
                  <div className="h-10 bg-gray-200 rounded mt-8"></div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="h-10 bg-gray-200 rounded w-32 lg:hidden"></div>
                <div className="h-10 bg-gray-200 rounded w-40"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 shrink-0">
              <ProductFilter
                filters={filters}
                onFilterChange={setFilters}
                types={types}
              />
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
      <Navbar />
      <div className="max-w-7xl bg-white mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:pt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 shrink-0">
            <ProductFilter
              filters={filters}
              onFilterChange={setFilters}
              types={types}
            />
          </aside>

          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-gray-600">
                  Menampilkan {paginatedProducts.length} dari{" "}
                  {sortedProducts.length} produk
                </p>
              </div>

              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 hover:border-orange-500 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-900"
              >
                <FaFilter className="w-4 h-4" />
                <span>Filter</span>
              </button>

              <div className="ml-auto">
                <ProductSort value={sortBy} onChange={handleSortChange} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

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

      {isMobileFilterOpen && (
        <ProductFilter
          filters={filters}
          onFilterChange={handleFilterChange}
          onClose={() => setIsMobileFilterOpen(false)}
          isMobile
          types={types}
        />
      )}
    </div>
  );
};

export default ProductsPage;
