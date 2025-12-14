import { useEffect, useRef, useState } from "react";
import {
  FaStar,
  FaHeart,
  FaShareAlt,
  FaCommentAlt,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useNavigate, useParams } from "react-router-dom";

export default function CardDetailProduct() {
  // All hooks must be at the top, in the same order on every render
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const { nama, id } = useParams<{ nama: string; id: string }>();
  const navigate = useNavigate();
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // State untuk data produk
  const [productData, setProductData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk interaksi UI
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("detail");
  const [mainImage, setMainImage] = useState<string>("");
  const [showFullTitle, setShowFullTitle] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  // Update tombol scroll
  const updateScrollButtons = () => {
    if (!thumbnailRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = thumbnailRef.current;
    setShowPrevButton(scrollLeft > 0);
    setShowNextButton(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const triggerCartUpdate = () => {
    const event = new CustomEvent("cartUpdated", {
      detail: { timestamp: Date.now() },
    });
    window.dispatchEvent(event);
  };

  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  const addToCart = async () => {
    if (!productData) return;

    setIsAddingToCart(true);

    const token = getToken();
    try {
      const response = await fetch(
        "http://localhost:8000/api/v1/cart-product-store",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: productData.id,
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menambahkan produk ke keranjang");
      }

      const data = await response.json();

      if (data.status === "success") {
        showNotification(data.message, "success");
        // TRIGGER EVENT CUSTOM UNTUK MEMPERBARUI BADGE CART
        triggerCartUpdate();
      } else {
        throw new Error(
          data.message || "Gagal menambahkan produk ke keranjang"
        );
      }
    } catch (err: any) {
      showNotification(err.message, "error");
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Effect for thumbnail scrolling
  useEffect(() => {
    const ref = thumbnailRef.current;
    if (!ref) return;

    updateScrollButtons();

    const handleScroll = () => {
      updateScrollButtons();
    };

    ref.addEventListener("scroll", handleScroll);

    return () => {
      ref.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Effect for fetching product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!nama || !id) {
          throw new Error("Nama atau ID tidak ditemukan di URL");
        }

        const response = await fetch(
          `http://localhost:8000/api/v1/product-detail-shop/${nama}/${id}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Respons bukan JSON");
        }

        const data = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Gagal mengambil data produk");
        }

        setProductData(data.data);
        if (data.data.images && data.data.images.length > 0) {
          setMainImage(data.data.images[0].url);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [nama, id]);

  // Effect for ensuring mainImage has a value
  useEffect(() => {
    if (productData?.images && productData.images.length > 0 && !mainImage) {
      setMainImage(productData.images[0].url);
    }
  }, [productData, mainImage]);

  // ambil data user yang lagi login
  useEffect(() => {
    const fetchUserData = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8000/api/v1/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.status === "Ok") {
            setUserData({
              name: data.data.name,
              email: data.data.email,
            });
          }
        }
      } catch (err: any) {
        console.error("Gagal mengambil data user:", err);
      }
    };

    fetchUserData();
  }, []);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailRef.current) {
      const scrollAmount = 120;
      thumbnailRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < productData?.stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  // Tampilkan loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Tampilkan error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  // Jika data belum tersedia
  if (!productData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Produk tidak ditemukan.
          </div>
        </div>
      </div>
    );
  }

  // Destructure product data
  const {
    title,
    price,
    rating,
    stock,
    images,
    condition,
    minOrder,
    category,
    description,
    features,
  } = productData;

  // handle transaksi midtrans
  const handleBuyNow = async () => {
    const token = getToken();

    if (!token) {
      const currentUrl = window.location.pathname;
      navigate(`/login?redirect=${encodeURIComponent(currentUrl)}`);
      return;
    }

    if (!productData) return;

    try {
      // 1. Hit API Laravel → dapatkan snap token
      const response = await fetch("http://localhost:8000/api/v1/payment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: productData.price * quantity,
          name: userData.name,
          email: userData.email,
          product_id: productData.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!data.token) {
        alert("Gagal membuat invoice Midtrans, token tidak ada!");
        return;
      }

      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          console.log("Success:", result);
        },
        onPending: function (result: any) {
          console.log("Pending:", result);
        },
        onError: function (result: any) {
          console.log("Error:", result);
        },
        onClose: function () {},
      });
    } catch (err) {
      console.error(err);
      alert("Ups! kesalahan saat memulai pembayaran");
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1100px] mx-auto px-2 sm:px-4 mt-20 sm:mt-6 lg:mt-32 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Column - Product Images */}
            <div className="w-full lg:w-[280px] lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)]">
              <div className="bg-white rounded-lg overflow-hidden">
                <div
                  className="aspect-square relative bg-gray-100 overflow-hidden"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={mainImage}
                    alt={title}
                    className={`w-full h-full rounded-lg object-cover transition-all duration-200 ${
                      isHovering ? "blur-sm" : ""
                    }`}
                  />
                  {isHovering && (
                    <div
                      className="absolute inset-0 pointer-events-none z-10"
                      style={{
                        background: `url(${mainImage}) no-repeat`,
                        backgroundSize: "200%",
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }}
                    />
                  )}
                </div>

                <div className="relative p-2">
                  {showPrevButton && (
                    <button
                      onClick={() => scrollThumbnails("left")}
                      className="absolute -left-1 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-1.5 shadow-lg border border-gray-200"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft size={16} className="text-gray-700" />
                    </button>
                  )}

                  <div
                    ref={thumbnailRef}
                    className="flex gap-2 overflow-x-auto scrollbar-hide"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {images.map((img: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setMainImage(img.url)}
                        className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                          mainImage === img.url
                            ? "border-green-500"
                            : "border-gray-200"
                        }`}
                      >
                        <img
                          src={img.url}
                          alt={img.alt}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  {showNextButton && (
                    <button
                      onClick={() => scrollThumbnails("right")}
                      className="absolute -right-1 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-gray-50 rounded-full p-1.5 shadow-lg border border-gray-200"
                      aria-label="Next image"
                    >
                      <FaChevronRight size={16} className="text-gray-700" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Column - Product Info */}
            <div className="flex-1 space-y-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h1>

                {/* Rating Only — Terjual dan Total Reviews Dihapus */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-xs sm:text-sm">
                      {rating}
                    </span>
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formatPrice(price)}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={() => setActiveTab("detail")}
                      className={`flex-1 pb-2 text-center font-medium text-xs sm:text-base border-b-2 transition-colors ${
                        activeTab === "detail"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      Spesifikasi Produk
                    </button>
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`flex-1 pb-2 text-center font-medium text-xs sm:text-base border-b-2 transition-colors ${
                        activeTab === "info"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      Informasi Produk
                    </button>
                  </div>

                  {/* Tab Spesifikasi Produk */}
                  {activeTab === "detail" && (
                    <div className="space-y-4 sm:space-y-5">
                      {/* Informasi Dasar (Kondisi, Min Pemesanan, Etalase) */}
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-base">
                          <span className="text-gray-600">Kondisi:</span>
                          <span className="font-semibold">{condition}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-base">
                          <span className="text-gray-600">Min. Pemesanan:</span>
                          <span className="font-semibold">{minOrder} Buah</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-base">
                          <span className="text-gray-600">Etalase:</span>
                          <span className="font-semibold text-green-600">
                            {category}
                          </span>
                        </div>
                      </div>

                      {/* Spesifikasi Produk data */}
                      <div className="pt-3 sm:pt-4 border-t">
                        <div className="text-xs sm:text-base text-gray-700">
                          {features && features.length > 0 ? (
                            <ul className="list-disc pl-5 space-y-1">
                              {features.map(
                                (feature: string, index: number) => (
                                  <li key={index}>{feature}</li>
                                )
                              )}
                            </ul>
                          ) : (
                            "Tidak ada spesifikasi produk."
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Informasi Produk */}
                  {activeTab === "info" && (
                    <div className="space-y-4 sm:space-y-5">
                      {/* Informasi Produk data */}
                      <div className="text-xs sm:text-base text-gray-700">
                        {description ? (
                          <p>{description}</p>
                        ) : (
                          "Tidak ada informasi produk."
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Card (Updated) */}
            <div className="w-full lg:w-[300px] lg:sticky lg:top-32 lg:h-[400px]">
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm lg:h-full flex flex-col justify-between border border-gray-100">
                <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  {/* Gambar produk */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg shrink-0 overflow-hidden border border-gray-200">
                    <img
                      src={mainImage}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    {/* Judul produk - bisa diklik untuk lihat full */}
                    <div
                      onClick={() => setShowFullTitle(!showFullTitle)}
                      className={`font-semibold text-gray-900 text-sm sm:text-base cursor-pointer ${
                        showFullTitle ? "whitespace-normal" : "line-clamp-1"
                      }`}
                      title={title}
                      aria-label={title}
                    >
                      {title}
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs text-gray-600 mb-1 font-medium">
                    Atur jumlah
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border-2 border-gray-200 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange("decrement")}
                        className="px-2.5 sm:px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          if (val >= 1 && val <= stock) setQuantity(val);
                        }}
                        className="w-12 sm:w-14 text-center text-sm border-0 focus:outline-none"
                      />
                      <button
                        onClick={() => handleQuantityChange("increment")}
                        className="px-2.5 sm:px-3 py-1.5 text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50"
                        disabled={quantity >= stock}
                      >
                        +
                      </button>
                    </div>
                    <div className="text-xs text-gray-600">
                      Stok:{" "}
                      <span className="font-semibold text-gray-900">
                        {stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm sm:text-md">
                      Subtotal
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatPrice(price * quantity)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={addToCart}
                    disabled={isAddingToCart}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base py-2 rounded-xl transition-colors shadow-md disabled:bg-gray-400"
                  >
                    {isAddingToCart ? "Menambahkan..." : "+ Keranjang"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50 font-bold text-sm sm:text-base py-2 rounded-xl transition-colors"
                  >
                    Beli Langsung
                  </button>
                </div>

                <div className="pt-3 sm:pt-4 border-t mt-auto">
                  <div className="flex gap-3 sm:gap-4 justify-center sm:justify-start">
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs">
                      <FaCommentAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Chat</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs">
                      <FaHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Wishlist</span>
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-xs">
                      <FaShareAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
