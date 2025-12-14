import { useRef, useState, useEffect } from "react";
import axios from "axios";
import {
  FaTag,
  FaWatchmanMonitoring,
  FaFileInvoiceDollar,
  FaShoppingCart,
  FaLaptop,
  FaFutbol,
  FaStore,
  FaCreditCard,
  FaTshirt,
  FaBaby,
  FaSpa,
  FaHome,
  FaGamepad,
  FaCar,
  FaPaintBrush,
  FaWrench,
  FaLeaf,
  FaHandHolding,
  FaBath,
} from "react-icons/fa";

interface Category {
  id: number;
  category_name: string;
  description: string;
}

export default function CategoryProduct() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Fungsi mapping nama kategori ke ikon
  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("elektronik") || lowerName.includes("gadget")) {
      return <FaLaptop />;
    }
    if (
      lowerName.includes("kesehatan") ||
      lowerName.includes("olahraga") ||
      lowerName.includes("sport") ||
      lowerName.includes("wellness")
    ) {
      return <FaFutbol />;
    }
    if (lowerName.includes("fashion")) {
      return <FaTshirt />;
    }
    if (lowerName.includes("bayi") || lowerName.includes("ibu")) {
      return <FaBaby />;
    }
    if (
      lowerName.includes("kosmetik") ||
      lowerName.includes("kecantikan") ||
      lowerName.includes("spa")
    ) {
      return <FaSpa />;
    }
    if (lowerName.includes("rumah") || lowerName.includes("tangga")) {
      return <FaHome />;
    }
    if (lowerName.includes("mainan")) {
      return <FaGamepad />;
    }
    if (lowerName.includes("otomotif")) {
      return <FaCar />;
    }
    if (lowerName.includes("hobi")) {
      return <FaPaintBrush />;
    }
    if (lowerName.includes("perbaikan")) {
      return <FaWrench />;
    }
    if (lowerName.includes("kebun") || lowerName.includes("pertanian")) {
      return <FaLeaf />;
    }
    if (lowerName.includes("tagihan") || lowerName.includes("isi ulang")) {
      return <FaFileInvoiceDollar />;
    }
    if (lowerName.includes("komisi")) {
      return <FaStore />;
    }
    if (lowerName.includes("paylater") || lowerName.includes("kredit")) {
      return <FaCreditCard />;
    }
    if (lowerName.includes("diskon") || lowerName.includes("promo")) {
      return <FaTag />;
    }
    if (lowerName.includes("watch") || lowerName.includes("jam")) {
      return <FaWatchmanMonitoring />;
    }
    if (lowerName.includes("blibli") || lowerName.includes("mart")) {
      return <FaShoppingCart />;
    }
    if (lowerName.includes("handmake")) {
      return <FaHandHolding />;
    }
    if (lowerName.includes("kamar") || lowerName.includes("kamar mandi")) {
      return <FaBath />;
    }
    return <FaTag />;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/categories"
        );
        if (response.data.status === "success") {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 py-3">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.map((category) => (
          <div
            key={category.id}
            className="shrink-0 w-24 sm:w-28 cursor-pointer flex flex-col items-center justify-center h-32 p-2"
          >
            {/* Icon Container - Lingkaran Putih */}
            <div className="bg-white rounded-full p-3 flex items-center justify-center w-16 h-16 shadow-sm border border-gray-200">
              <div className="text-xl text-gray-700">
                {getCategoryIcon(category.category_name)}
              </div>
            </div>

            {/* Category Name - Centered & Fixed Height */}
            <p className="text-center text-xs font-medium text-gray-800 line-clamp-2 h-10 flex items-center justify-center px-1 mt-1">
              {category.category_name}
            </p>
          </div>
        ))}
      </div>

      {/* CSS untuk menyembunyikan scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
