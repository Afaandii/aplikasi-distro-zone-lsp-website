import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";
import Footer from "./Footer";

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full animate-pulse">
      <div className="w-full aspect-square bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded mt-4 w-1/2"></div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  const [currentImage, setCurrentImage] = useState(product.gambar);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    setCurrentImage(product.gambar);
  }, [product.gambar]);

  return (
    <div className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md">
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

      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
          {product.tipe}
        </div>

        {/* Colors - Mini Gallery */}
        {product.allPhotos.length > 1 && (
          <div className="flex items-center space-x-1 mb-3">
            {product.allPhotos
              .slice(0, 4)
              .map((photoUrl: string, index: number) => (
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

// Komponen Filter
const ProductFilter = ({
  filters,
  onFilterChange,
  onClose,
  isMobile = false,
}: any) => {
  const priceRanges = [
    { label: "Semua Harga", value: "all" },
    { label: "Di bawah 100k", value: "0-100000" },
    { label: "100k - 200k", value: "100000-200000" },
    { label: "200k - 300k", value: "200000-300000" },
    { label: "Di atas 300k", value: "300000-999999" },
  ];

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c: string) => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handlePriceChange = (value: string) => {
    onFilterChange({ ...filters, priceRange: value });
  };

  const resetFilters = () => {
    onFilterChange({ categories: [], priceRange: "all" });
  };

  const FilterContent = (
    <>
      <div className="mb-8">
        <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wider mb-4">
          Tipe Kaos
        </h3>
        <div className="space-y-2">
          {["T-Shirt", "Long Sleeve", "Oversize"].map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.categories.includes(type)}
                onChange={() => toggleCategory(type)}
                className="w-5 h-5 rounded border-2 border-gray-300 bg-white checked:bg-orange-500 checked:border-orange-500 transition-colors cursor-pointer"
              />
              <span className="text-gray-600 group-hover:text-gray-900 transition-colors text-sm">
                {type}
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
              className="flex items-center space-x-3 cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange === range.value}
                onChange={() => handlePriceChange(range.value)}
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
        onClick={resetFilters}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
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

// Komponen Sort
const ProductSort = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
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
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
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

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("sr");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    priceRange: "all",
  });
  const [sortBy, setSortBy] = useState("newest");

  // Fetch data
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Ambil data dari endpoint pencarian
        const productResponse = await axios.get(
          `http://localhost:8080/api/v1/produk/search?q=${encodeURIComponent(
            query
          )}`
        );

        // Ambil foto produk
        const imageResponse = await axios.get(
          "http://localhost:8080/api/v1/foto-produk"
        );
        const imageData = imageResponse.data;

        // Ambil data tipe
        const tipeResponse = await axios.get(
          "http://localhost:8080/api/v1/tipe"
        );
        const tipeData = tipeResponse.data;

        // Map tipe nama
        const mapTipeNama = (idTipe: number) => {
          const tipe = tipeData.find((t: any) => t.id_tipe === idTipe);
          return tipe ? tipe.nama_tipe : "Tipe Tidak Diketahui";
        };

        // Kelompokkan foto per produk
        const photosByProduct: Record<number, string[]> = {};
        imageData.forEach((photo: any) => {
          if (!photosByProduct[photo.id_produk]) {
            photosByProduct[photo.id_produk] = [];
          }
          if (photo.url_foto) {
            photosByProduct[photo.id_produk].push(photo.url_foto);
          }
        });

        const transformedProducts = productResponse.data.map((p: any) => {
          const allPhotos = photosByProduct[p.id_produk] || [];
          const gambar = allPhotos[0] || "";
          return {
            id: p.id_produk,
            nama: p.nama_kaos,
            tipe: mapTipeNama(p.id_tipe),
            idTipe: p.id_tipe,
            harga: p.harga_jual,
            gambar,
            allPhotos,
          };
        });

        setProducts(transformedProducts);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError("Gagal memuat hasil pencarian. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  // Filter & Sort Logic
  const filteredAndSortedProducts = products
    .filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.tipe)
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
    })
    .sort((a, b) => {
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

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  return (
    <>
      <Navigation />
      <main className="md:pt-32.5 pt-14 pb-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          ) : products.length > 0 ? (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar Filter */}
              <aside className="lg:w-64 shrink-0">
                <ProductFilter
                  filters={filters}
                  onFilterChange={setFilters}
                  isMobile={false}
                />
              </aside>

              {/* Main Content */}
              <main className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-gray-600">
                      Menampilkan {filteredAndSortedProducts.length} dari{" "}
                      {products.length} produk untuk "{query}"
                    </p>
                  </div>

                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 hover:border-orange-500 px-4 py-2.5 rounded-lg transition-colors duration-200 text-sm font-medium text-gray-900"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h14a1 1 0 011 1M3 4a1 1 0 011-1h14a1 1 0 011 1M3 4a1 1 0 011-1h14a1 1 0 011 1"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12a1 1 0 011-1h14a1 1 0 011 1M3 12a1 1 0 011-1h14a1 1 0 011 1M3 12a1 1 0 011-1h14a1 1 0 011 1"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 20a1 1 0 011-1h14a1 1 0 011 1M3 20a1 1 0 011-1h14a1 1 0 011 1M3 20a1 1 0 011-1h14a1 1 0 011 1"
                      />
                    </svg>
                    <span>Filter</span>
                  </button>

                  {/* Sort Dropdown */}
                  <div className="ml-auto">
                    <ProductSort value={sortBy} onChange={setSortBy} />
                  </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </main>
            </div>
          ) : (
            <p className="text-center text-xl text-gray-500 py-10">
              Tidak ada produk ditemukan untuk pencarian "{query}".
            </p>
          )}
        </div>
      </main>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <ProductFilter
          filters={filters}
          onFilterChange={setFilters}
          onClose={() => setIsMobileFilterOpen(false)}
          isMobile
        />
      )}

      <Footer />
    </>
  );
}
