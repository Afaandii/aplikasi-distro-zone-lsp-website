import React, { useState, useEffect, useRef } from "react";
import {
  FaSearch,
  FaShoppingCart,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { MdClose } from "react-icons/md";

// ============================================================================
// TYPES
// ============================================================================
interface NavItem {
  label: string;
  href: string;
  hasMegaMenu?: boolean;
}

interface CategoryItem {
  label: string;
  href: string;
  image?: string;
}

// ============================================================================
// MENU DATA
// ============================================================================
const categoryData: CategoryItem[] = [
  {
    label: "Semua Produk",
    href: "/produk-list",
  },
  {
    label: "Kaos",
    href: "/produk?kategori=kaos",
    image: "kaos-category",
  },
  {
    label: "Kemeja",
    href: "/produk?kategori=kemeja",
    image: "kemeja-category",
  },
  {
    label: "Jaket",
    href: "/produk?kategori=jaket",
    image: "jaket-category",
  },
  {
    label: "Celana",
    href: "/produk?kategori=celana",
    image: "celana-category",
  },
  {
    label: "Aksesoris",
    href: "/produk?kategori=aksesoris",
    image: "aksesoris-category",
  },
];

const menuData: NavItem[] = [
  { label: "Produk", href: "#", hasMegaMenu: true },
  { label: "Tentang Distrozone", href: "/about-us" },
  { label: "Blog", href: "/blog" },
];

// ============================================================================
// MEGA MENU COMPONENT (DESKTOP)
// ============================================================================
const MegaMenu: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const visualCategories = categoryData.filter((cat) => cat.image);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 top-20 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Mega Menu Wrapper */}
      <div className="fixed top-20 left-0 right-0 z-50">
        <div
          className="
            bg-white 
            w-full 
            h-[calc(100vh-5rem)] 
            shadow-xl
            animate-megaIn
          "
        >
          {/* Inner Container */}
          <div className="max-w-7xl mx-auto h-full grid grid-cols-[280px_1fr]">
            {/* LEFT: CATEGORY LIST */}
            <aside className="border-r border-gray-200 p-8 overflow-y-auto">
              <h1 className="text-xs font-bold text-gray-500 uppercase mb-6">
                <a href="/kategori-list" className="mb-6">
                  Kategori
                </a>
              </h1>
              <nav className="space-y-2">
                {categoryData.map((cat) => (
                  <a
                    key={cat.label}
                    href={cat.href}
                    onClick={onClose}
                    className="block text-sm font-medium text-gray-700 hover:text-orange-500 transition"
                  >
                    {cat.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* RIGHT: VISUAL GRID */}
            <section className="p-10 overflow-y-auto">
              <h3 className="text-xs font-bold text-gray-500 uppercase mb-8">
                Koleksi
              </h3>

              <div className="grid grid-cols-3 gap-6">
                {visualCategories.map((cat) => (
                  <a
                    key={cat.label}
                    href={cat.href}
                    onClick={onClose}
                    className="group relative aspect-4/5 overflow-hidden bg-zinc-100"
                  >
                    {/* Fake image background */}
                    <div className="absolute inset-0 bg-linear-to-br from-zinc-200 to-zinc-300" />

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />

                    {/* Text */}
                    <div className="absolute bottom-6 left-6">
                      <h4 className="text-white text-lg font-bold">
                        {cat.label}
                      </h4>
                      <span className="text-white/80 text-sm">
                        Lihat Koleksi →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================================
// MOBILE ACCORDION COMPONENT
// ============================================================================
const MobileAccordion: React.FC<{
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}> = ({ item, isOpen, onToggle, onClose }) => {
  if (!item.hasMegaMenu) {
    return (
      <a
        href={item.href}
        onClick={onClose}
        className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
      >
        {item.label}
      </a>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
      >
        <span>{item.label}</span>
        <FaChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="pl-4 py-2 space-y-1">
          {categoryData.map((category, index) => (
            <a
              key={index}
              href={category.href}
              onClick={onClose}
              className="block px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              {category.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN NAVBAR COMPONENT
// ============================================================================
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [openMobileAccordion, setOpenMobileAccordion] = useState<string | null>(
    null
  );
  const [cartCount] = useState(3);

  const megaMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  const closeMegaMenu = () => {
    setMegaMenuOpen(false);
  };

  // Mobile Accordion Handler
  const handleMobileAccordionToggle = (label: string) => {
    setOpenMobileAccordion(openMobileAccordion === label ? null : label);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/95 backdrop-blur-md shadow-lg" : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="shrink-0">
              <a href="/" className="flex items-center group">
                <div className="text-2xl md:text-3xl font-black tracking-tighter">
                  <span className="text-white">DISTRO</span>
                  <span className="text-orange-500 group-hover:text-orange-400 transition-colors">
                    ZONE
                  </span>
                </div>
              </a>
            </div>

            {/* Desktop Menu - Center */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {menuData.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  ref={item.hasMegaMenu ? megaMenuRef : null}
                >
                  {item.hasMegaMenu ? (
                    <button
                      type="button"
                      onClick={() => setMegaMenuOpen((prev) => !prev)}
                      className="flex items-center space-x-1 px-3 lg:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      <span>{item.label}</span>
                      <FaChevronDown
                        className={`w-3 h-3 transition-transform ${
                          megaMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition"
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Search"
              >
                <FaSearch className="w-5 h-5" />
              </button>

              {/* Cart Icon with Badge */}
              <a
                href="#cart"
                className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Shopping Cart"
              >
                <FaShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </a>

              {/* User Icon - Hidden on mobile */}
              <a
                href="#login"
                className="hidden sm:flex p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="User Account"
              >
                <FaUser className="w-5 h-5" />
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? (
                  <MdClose className="w-6 h-6" />
                ) : (
                  <IoMenu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-white/10 bg-black/98 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari produk distro..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}

        {/* Mega Menu (Desktop Only) */}
        <div>
          <MegaMenu isOpen={megaMenuOpen} onClose={closeMegaMenu} />
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 right-0 bottom-0 w-full max-w-sm bg-zinc-900 shadow-xl">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Items */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {menuData.map((item) => (
                  <MobileAccordion
                    key={item.label}
                    item={item}
                    isOpen={openMobileAccordion === item.label}
                    onToggle={() => handleMobileAccordionToggle(item.label)}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />
                ))}

                {/* User Login Link - Mobile Only */}
                <a
                  href="#login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <FaUser className="w-5 h-5" />
                  <span>Login / Daftar</span>
                </a>
              </nav>

              {/* Mobile Menu Footer */}
              <div className="border-t border-white/10 p-4">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors duration-200">
                  Belanja Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
