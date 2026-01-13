import { useEffect, useRef, useState } from "react";
import { FaChevronRight, FaChevronLeft } from "react-icons/fa";
import Navigation from "./Navigation";
import Footer from "./Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

type ImageType = {
  url: string;
  alt: string;
  id_warna: number;
};

type VariantType = {
  id: number;
  id_ukuran: number;
  id_warna: number;
  stok: number;
  ukuran: string;
  warna: string;
};

export default function CardDetailProduct() {
  const { id_produk } = useParams<{ id_produk: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<ImageType[]>([]);
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [warnaTouched, setWarnaTouched] = useState(false);
  const [ukuranTouched, setUkuranTouched] = useState(false);
  const [stock, setStock] = useState(0);
  const thumbnailRef = useRef<HTMLDivElement>(null);
  const [showPrevButton, setShowPrevButton] = useState(false);
  const [showNextButton, setShowNextButton] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [selectedWarna, setSelectedWarna] = useState<number | null>(null);
  const [selectedUkuran, setSelectedUkuran] = useState<number | null>(null);
  const [activeVariant, setActiveVariant] = useState<VariantType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("detail");
  const [mainImage, setMainImage] = useState<string>("");
  const [hoverImage, setHoverImage] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [alertState, setAlertState] = useState<AlertState>({
    show: false,
    message: "",
    type: "success",
  });
  const navigate = useNavigate();

  const condition = "Baru";
  const minOrder = 1;
  const features: string[] = [];

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const showCustomAlert = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setAlertState({ show: true, message, type });
    setTimeout(() => {
      setAlertState((prev) => ({ ...prev, show: false }));
    }, 3000);
  };

  useEffect(() => {
    const fetchDetailProduk = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `http://localhost:8080/api/v1/detail-produk/${id_produk}`
        );

        const data = res.data;

        // ===== BASIC INFO =====
        setTitle(data.nama_kaos);
        setPrice(data.harga_jual);
        setDescription(data.deskripsi);
        setSpecification(data.spesifikasi);
        setCategory(data.Tipe?.nama_tipe || "");

        // ===== FOTO PRODUK =====
        const mappedImages = data.FotoProduk.map((foto: any) => ({
          url: foto.url_foto,
          alt: foto.Warna?.nama_warna || "Foto produk",
          id_warna: foto.id_warna,
        }));

        setImages(mappedImages);
        setMainImage(mappedImages[0]?.url || "");

        // ===== VARIAN (UKURAN + WARNA) =====
        const mappedVariants: VariantType[] = data.Varian.map((v: any) => ({
          id: v.id_varian,
          id_ukuran: v.id_ukuran,
          id_warna: v.id_warna,
          stok: v.stok_kaos,
          ukuran: v.Ukuran?.nama_ukuran,
          warna: v.Warna?.nama_warna,
        }));

        setVariants(mappedVariants);
      } catch (err) {
        setError("Gagal memuat detail produk" + err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetailProduk();
  }, [id_produk]);

  useEffect(() => {
    if (variants.length === 0) return;

    const first = variants[0];
    setActiveVariant(first);
    setStock(first.stok);
  }, [variants]);

  useEffect(() => {
    if (!selectedWarna || !selectedUkuran) return;

    const found = variants.find(
      (v) => v.id_warna === selectedWarna && v.id_ukuran === selectedUkuran
    );

    if (found) {
      setActiveVariant(found);
      setStock(found.stok);
      setQuantity(1);
    }
  }, [selectedWarna, selectedUkuran, variants]);

  // Update tombol berdasarkan scroll position
  const updateScrollButtons = () => {
    if (!thumbnailRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = thumbnailRef.current;
    setShowPrevButton(scrollLeft > 0);
    setShowNextButton(scrollLeft + clientWidth < scrollWidth - 1);
  };

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

  // Update posisi zoom saat hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleQuantityChange = (type: "increment" | "decrement") => {
    if (type === "increment" && quantity < stock) {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  // ukuran yang tersedia berdasarkan warna terpilih
  const availableUkuran = selectedWarna
    ? variants
        .filter((v) => v.id_warna === selectedWarna)
        .map((v) => v.id_ukuran)
    : [];

  // warna yang tersedia berdasarkan ukuran terpilih
  const availableWarna = selectedUkuran
    ? variants
        .filter((v) => v.id_ukuran === selectedUkuran)
        .map((v) => v.id_warna)
    : [];

  const currentVariant = variants.find(
    (v) => v.id_warna === selectedWarna && v.id_ukuran === selectedUkuran
  );
  const getImageByWarna = (idWarna: number | null) => {
    if (!idWarna) return null;
    return images.find((img) => img.id_warna === idWarna)?.url || null;
  };

  const handleAddToCart = async () => {
    if (!currentVariant || !selectedUkuran || !selectedWarna) {
      alert("Pilih warna dan ukuran terlebih dahulu");
      return;
    }

    const token = getToken();
    if (!token) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/cart-product",
        {
          product_id: parseInt(id_produk || "0"),
          quantity: quantity,
          price: price,
          warna_id: currentVariant.id_warna,
          ukuran_id: currentVariant.id_ukuran,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        showCustomAlert("Produk berhasil ditambahkan ke keranjang", "success");
        window.dispatchEvent(new CustomEvent("cartUpdated"));
      } else {
        alert(response.data.message || "Gagal menambahkan ke keranjang");
      }
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Terjadi kesalahan saat menambahkan ke keranjang"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  // handling  data payload buat ke halaman checkout
  const handleBuyNow = () => {
    if (!currentVariant || !selectedUkuran || !selectedWarna) {
      alert("Pilih warna dan ukuran terlebih dahulu");
      return;
    }

    navigate("/checkout-produk-page", {
      state: {
        products: [
          {
            id_produk: id_produk,
            name: title,
            image: mainImage,
            warna: currentVariant.warna,
            ukuran: currentVariant.ukuran,
            quantity: quantity,
            price: price,
            warna_id: currentVariant.id_warna,
            ukuran_id: currentVariant.id_ukuran,
          },
        ],
      },
    });
  };

  // Komponen Skeleton Loading
  const SkeletonDetailProduct = () => {
    return (
      <div className="max-w-275 mx-auto px-2 sm:px-4 mt-4 sm:mt-6 lg:mt-40 mb-10">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Column - Image */}
          <div className="w-full lg:w-70">
            <div className="bg-white rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-2">
                <div className="flex gap-2 overflow-x-auto">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="shrink-0 w-16 h-16 bg-gray-200 rounded animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Info */}
          <div className="flex-1 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>

              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-16 h-8 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-8 bg-gray-200 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex gap-4 mb-4">
                  <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>

                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mt-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mt-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-24 mt-3 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="w-full lg:w-75">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>

              <div className="mb-5">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>

              <div className="pt-3 border-t mb-5">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50">
          <SkeletonDetailProduct />
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navigation />
        <div className="text-center py-20 text-red-500">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50">
        {alertState.show && (
          <div
            className={`fixed top-18 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg text-white font-medium shadow-lg transition-opacity duration-300 ${
              alertState.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {alertState.message}
          </div>
        )}
        <div className="max-w-275 mx-auto px-2 sm:px-4 mt-4 sm:mt-6 lg:mt-40 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left Column - Product Images */}
            <div className="w-full lg:w-70 lg:sticky lg:top-32 lg:h-[calc(100vh-10rem)]">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Main Image with Zoom */}
                <div
                  className="aspect-square relative bg-gray-100 overflow-hidden"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                >
                  <img
                    src={hoverImage || mainImage}
                    alt={title}
                    className={`w-full h-full rounded-lg object-cover transition-all duration-200 ${
                      isHovering ? "blur-sm" : ""
                    }`}
                  />
                  {/* Zoom Overlay */}
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

                {/* Thumbnail Container */}
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
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setMainImage(img.url)}
                        className={`shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                          mainImage === img.url
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

                <div className="mb-4 sm:mb-6">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {formatPrice(price)}
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                    Pilih Warna:{" "}
                    <span className="font-normal text-gray-600">
                      {currentVariant?.warna ||
                        variants.find((v) => v.id_warna === selectedWarna)
                          ?.warna ||
                        activeVariant?.warna}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Map(variants.map((v) => [v.id_warna, v])).values(),
                    ].map((v) => {
                      const disabled =
                        ukuranTouched &&
                        selectedUkuran !== null &&
                        !availableWarna.includes(v.id_warna);

                      return (
                        <button
                          key={v.id_warna}
                          disabled={disabled}
                          onClick={() => {
                            setSelectedWarna(v.id_warna);
                            setWarnaTouched(true);

                            const img = getImageByWarna(v.id_warna);
                            if (img) {
                              setMainImage(img);
                              setHoverImage(null);
                            }
                          }}
                          onMouseEnter={() => {
                            const img = getImageByWarna(v.id_warna);
                            if (img) setHoverImage(img);
                          }}
                          onMouseLeave={() => {
                            setHoverImage(null);
                          }}
                          className={`px-3 py-2 border-2 rounded-lg transition flex items-center gap-2
                            ${
                              selectedWarna === v.id_warna
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200"
                            }
                            ${
                              disabled
                                ? "opacity-40 cursor-not-allowed"
                                : "hover:border-green-400"
                            }
                          `}
                        >
                          <img
                            src={getImageByWarna(v.id_warna) || mainImage}
                            alt={v.warna}
                            className="w-6 h-6 rounded object-cover"
                          />

                          <span className="text-sm">{v.warna}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-4 sm:mb-6">
                  <label className="block text-xs sm:text-sm font-semibold mb-2 sm:mb-3">
                    Pilih Ukuran:{" "}
                    <span className="font-normal text-gray-600">
                      {currentVariant?.ukuran ||
                        variants.find((v) => v.id_ukuran === selectedUkuran)
                          ?.ukuran ||
                        activeVariant?.ukuran}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      ...new Map(
                        variants.map((v) => [v.id_ukuran, v])
                      ).values(),
                    ].map((v) => {
                      const disabled =
                        warnaTouched &&
                        selectedWarna !== null &&
                        !availableUkuran.includes(v.id_ukuran);

                      return (
                        <button
                          key={v.id_ukuran}
                          disabled={disabled}
                          onClick={() => {
                            setSelectedUkuran(v.id_ukuran);
                            setUkuranTouched(true);
                          }}
                          className={`px-3 py-2 border-2 rounded-lg transition
                        ${
                          selectedUkuran === v.id_ukuran
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200"
                        }
                        ${
                          disabled
                            ? "opacity-40 cursor-not-allowed"
                            : "hover:border-green-400"
                        }
                      `}
                        >
                          {v.ukuran}
                        </button>
                      );
                    })}
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
                      Deskripsi Produk
                    </button>
                    <button
                      onClick={() => setActiveTab("info")}
                      className={`flex-1 pb-2 text-center font-medium text-xs sm:text-base border-b-2 transition-colors ${
                        activeTab === "info"
                          ? "border-green-500 text-green-600"
                          : "border-transparent text-gray-500"
                      }`}
                    >
                      Spesifikasi Produk
                    </button>
                  </div>

                  {activeTab === "detail" && (
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
                  )}
                  {activeTab === "info" && (
                    <div>
                      <p className="text-xs sm:text-base text-gray-700 whitespace-pre-line">
                        {specification}
                      </p>
                    </div>
                  )}
                </div>

                {activeTab === "detail" && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                    <div
                      className={`text-gray-700 text-xs sm:text-base ${
                        !showFullDescription ? "line-clamp-4" : ""
                      }`}
                    >
                      <p className="mb-2 sm:mb-3">{description}</p>

                      {features.length > 0 && (
                        <div className="space-y-1 sm:space-y-2">
                          {features.map((feature, index) => (
                            <p key={index} className="text-xs sm:text-sm">
                              • {feature}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setShowFullDescription(!showFullDescription)
                      }
                      className="text-green-600 font-medium text-xs sm:text-sm mt-2 hover:underline"
                    >
                      {showFullDescription
                        ? "Lihat Lebih Sedikit"
                        : "Lihat Selengkapnya"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Purchase Card */}
            <div className="w-full lg:w-75 lg:sticky lg:top-32 lg:h-100">
              <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm lg:h-full flex flex-col justify-between border border-gray-100">
                <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl">
                      <img src={mainImage} alt={title} />
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                      {title}
                    </div>
                  </div>
                </div>

                <div className="mb-4 sm:mb-5">
                  <label className="block text-xs text-gray-600 mb-1 font-medium">
                    Atur jumlah dan catatan
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
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className={`w-full bg-green-600 hover:bg-green-700 text-white font-bold text-sm sm:text-base py-2 rounded-xl transition-colors shadow-md ${
                      isAddingToCart ? "opacity-70 cursor-not-allowed" : ""
                    }`}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
