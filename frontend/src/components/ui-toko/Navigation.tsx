import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiDownload,
  FiGrid,
  FiHome,
  FiUser,
} from "react-icons/fi";
import UserDropdown from "../header/UserDropdown";
import { IoDocumentTextOutline } from "react-icons/io5";

export default function Navigation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Jika kita berada di halaman search, ambil query dari URL
    if (location.pathname === "/search") {
      const queryFromUrl = searchParams.get("sr");
      queueMicrotask(() => {
        setSearchQuery(queryFromUrl || "");
      });
    } else {
      queueMicrotask(() => {
        setSearchQuery("");
      });
    }
  }, [location.pathname, location.search, searchParams]);

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // Check if user is logged in
  useEffect(() => {
    const token = getToken();
    queueMicrotask(() => {
      setIsLoggedIn(!!token);
    });
  }, []);

  const fetchCartCount = useCallback(async () => {
    try {
      const token = getToken();

      if (!token) {
        setCartCount(0);
        return;
      }

      const res = await axios.get("http://localhost:8000/api/v1/cart-product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const totalItems = res.data?.data?.total_items ?? 0;
      setCartCount(totalItems);
    } catch (error) {
      console.error("Gagal mengambil cart:", error);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    const loadCart = async () => {
      await fetchCartCount();
    };

    loadCart();
  }, [fetchCartCount]);

  useEffect(() => {
    // Fungsi untuk menangani event custom
    const handleCartUpdate = () => {
      fetchCartCount();
    };

    // Tambahkan event listener
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Bersihkan event listener saat komponen dilepas
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [fetchCartCount]);

  // FUNGSI UNTUK MENANGANI SEARCH
  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?sr=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* Desktop Navigation (fixed saat discroll) */}
      <div className="hidden md:block fixed top-0 left-0 right-0 z-50 ">
        <div className="bg-white text-gray-500 px-7 py-2">
          <div className="max-w-297.5 mx-auto flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:opacity-80">
                <FiDownload size={16} />
                <span>Download Aplikasi DistroZone</span>
              </button>
            </div>
            <div className="flex items-center gap-6 ">
              <a href="/about-us">Tentang DistroZone</a>
              <a href="/customer-service-page">Customer Service</a>
            </div>
          </div>
        </div>

        <div className="bg-white text-gray-500 px-7">
          <div className="max-w-297.5 mx-auto flex items-center gap-7">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/">
                <img
                  src="/images/distro-zone.png"
                  alt="DistroZone"
                  className="w-46 h-14"
                />
              </a>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-3xl pt-2">
              <div className="relative flex items-center rounded-lg overflow-hidden bg-white border border-blue-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Cari produk"
                  className="flex-1 px-4 py-2.5 text-gray-700 placeholder-gray-500 focus:outline-none rounded-l-lg"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 mr-1 rounded-md transition-colors"
                >
                  <FiSearch size={24} />
                </button>
              </div>
            </div>

            {/* Cart and Auth Buttons */}
            <div className="flex items-center gap-4">
              <a href="/cart-produk" className="relative hover:opacity-80 ml-2">
                <FiShoppingCart size={28} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
              <div className="w-[1.3px] bg-gray-300 h-8 mx-3"></div>

              {/* Conditional rendering for auth buttons or user dropdown */}
              {isLoggedIn ? (
                <UserDropdown />
              ) : (
                <>
                  <a
                    href="/login"
                    className="px-6 py-1 border-2 font-medium text-green-600 border-green-600 rounded-full hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors"
                  >
                    Masuk
                  </a>
                  <a
                    href="/register"
                    className="px-6 py-1 bg-green-600 font-medium text-white rounded-full transition-colors"
                  >
                    Daftar
                  </a>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white text-gray-500 px-6 py-1.5">
          <div className="max-w-297.5 mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 hover:opacity-80">
                <FiGrid size={20} />
                <span className="font-medium">Kategori</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation (md ke bawah) */}
      <div className="md:hidden">
        {/* Top Fixed Bar */}
        <div className="fixed top-0 left-0 right-0 bg-white text-gray-800 px-2 py-3 z-50">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="shrink-0">
              <a href="/">
                <img
                  src="/images/distro-zone-bag.png"
                  alt="DistroZone"
                  className="w-10 h-10"
                />
              </a>
            </div>

            {/* Search Bar - Mengisi ruang */}
            <div className="flex-1 max-w-xs">
              <div className="relative flex items-center rounded-lg overflow-hidden bg-white border border-blue-200">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Cari produk"
                  className="flex-1 px-2 py-2 text-gray-800 text-sm placeholder-gray-500 focus:outline-none rounded-l-lg"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-600 text-white p-1.5 mr-1 rounded-md"
                >
                  <FiSearch size={16} />
                </button>
              </div>
            </div>

            {/* Conditional rendering for auth button or user icon */}
            {isLoggedIn ? (
              <a
                href="/cart-produk"
                className="flex flex-col items-center relative"
              >
                <FiShoppingCart size={26} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>
            ) : (
              <a
                href="/login"
                className="text-sm font-medium px-3 py-1.5 border-2 border-green-600 rounded-full whitespace-nowrap"
              >
                Masuk
              </a>
            )}
          </div>
        </div>

        {/* Bottom Fixed Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 z-50">
          <a href="/" className="flex flex-col items-center text-gray-600">
            <FiHome size={24} />
            <span className="text-xs mt-1">Home</span>
          </a>
          <a
            href="/pesanan-list"
            className="flex flex-col items-center text-gray-600 relative"
          >
            <IoDocumentTextOutline size={24} className="bg-white" />
            <span className="text-xs mt-1">Pesanan</span>
          </a>

          {/* Conditional rendering for account button */}
          {isLoggedIn ? (
            <a
              href="/user-profile"
              className="flex flex-col items-center text-gray-600"
            >
              <FiUser size={24} />
              <span className="text-xs mt-1">Akun</span>
            </a>
          ) : (
            <a
              href="/login"
              className="flex flex-col items-center text-gray-600"
            >
              <FiUser size={24} />
              <span className="text-xs mt-1">Masuk</span>
            </a>
          )}
        </div>
      </div>
    </>
  );
}
