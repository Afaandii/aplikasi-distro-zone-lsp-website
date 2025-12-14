import { useState, useEffect } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { IoChevronBack } from "react-icons/io5";
import Navigation from "./Navigation";
import Footer from "./Footer";

// Interface untuk item keranjang dari API
interface ApiCartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    product_name: string;
    image_url: string;
  };
}

// Interface yang digunakan oleh UI
interface CartItem {
  id: string;
  product_id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  product: {
    id: number;
    product_name: string;
    image_url: string;
  };
}

const CartProduct = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [totalPrice, setTotalPrice] = useState(0);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  // trigger untuk kurangi item cart
  const triggerCartUpdate = () => {
    const event = new CustomEvent("cartUpdated", {
      detail: { timestamp: Date.now() },
    });
    window.dispatchEvent(event);
  };

  // Tampilkan notifikasi (hanya untuk hapus)
  const showNotification = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const event = new CustomEvent("showNotification", {
      detail: { message, type },
    });
    window.dispatchEvent(event);
  };

  // Fungsi untuk mengambil data keranjang (dibuat menjadi reusable)
  const fetchCartData = async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        setError("Anda belum login. Silakan login terlebih dahulu.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "http://localhost:8000/api/v1/cart-product",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.status === "success") {
        const transformedItems: CartItem[] = data.data.items.map(
          (item: ApiCartItem) => ({
            id: item.id.toString(),
            product_id: item.product.id,
            name: item.product.product_name,
            image: item.product.image_url || "/placeholder-image.jpg",
            price: item.price,
            quantity: item.quantity,
          })
        );

        setItems(transformedItems);

        if (transformedItems.length > 0) {
          const firstItemId = transformedItems[0].id;
          setSelectedItems(new Set([firstItemId]));
          setSelectAll(false);
        }
      } else {
        throw new Error(data.message || "Gagal memuat data keranjang");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart saat komponen dimuat
  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    const newTotal = items.reduce((sum, item) => {
      if (selectedItems.has(item.id)) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(newTotal);
  }, [selectedItems, items]);

  const formatPrice = (price: number) => {
    return `Rp${price.toLocaleString("id-ID")}`;
  };

  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "") // Hapus karakter khusus
      .replace(/\s+/g, "-") // Ganti spasi dengan -
      .replace(/-+/g, "-") // Hindari multiple -
      .replace(/^-|-$/g, ""); // Bersihkan awal/akhir
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
    setSelectAll(!selectAll);
  };

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
    setSelectAll(newSelected.size === items.length);
  };

  // Update Quantity (tanpa notifikasi & tanpa skeleton)
  const updateQuantity = async (id: string, delta: number) => {
    const item = items.find((item) => item.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    // Langsung update UI tanpa loading
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );

    try {
      const token = getToken();
      const response = await fetch(
        "http://localhost:8000/api/v1/cart-product-update",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_item_id: parseInt(id),
            quantity: newQty,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memperbarui quantity");
      }
      triggerCartUpdate();
    } catch (err: any) {
      // Jika gagal, kembalikan ke nilai lama
      console.error(err);
      setError(err.message);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity } : item
        )
      );
    }
  };

  // Hapus satu item + notifikasi
  const removeItem = async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(
        "http://localhost:8000/api/v1/cart-product-delete",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart_item_id: parseInt(id),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menghapus item");
      }

      const data = await response.json();
      if (data.status === "success") {
        setItems((prev) => prev.filter((item) => item.id !== id));
        const newSelected = new Set(selectedItems);
        newSelected.delete(id);
        setSelectedItems(newSelected);
        setSelectAll(newSelected.size === items.length - 1 && items.length > 1);
        showNotification("Produk berhasil dihapus dari keranjang.", "success");
      } else {
        throw new Error(data.message || "Gagal menghapus item");
      }
    } catch (err: any) {
      setError(err.message);
      showNotification(err.message, "error");
    }
  };

  // Hapus semua item yang dipilih + notifikasi
  const removeAllItems = async () => {
    if (!window.confirm(`Hapus ${selectedItems.size} produk yang dipilih?`))
      return;

    try {
      const token = getToken();
      const response = await fetch(
        "http://localhost:8000/api/v1/cart-product-delete-all",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menghapus semua item");
      }

      const data = await response.json();
      if (data.status === "success") {
        setItems([]);
        setSelectedItems(new Set());
        setSelectAll(false);
        showNotification(
          "Semua produk berhasil dihapus dari keranjang.",
          "success"
        );
      } else {
        throw new Error(data.message || "Gagal menghapus semua item");
      }
    } catch (err: any) {
      setError(err.message);
      showNotification(err.message, "error");
    }
  };

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
        // Biarkan saja nilai default jika gagal mengambil data
      }
    };

    fetchUserData();
  }, []);

  const clearSelectedItemsAfterPayment = async () => {
    // Gunakan Promise.all untuk menghapus semua item yang dipilih secara bersamaan
    const deletePromises = Array.from(selectedItems).map((id) => {
      const token = getToken();
      return fetch("http://localhost:8000/api/v1/cart-product-delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart_item_id: parseInt(id),
        }),
      });
    });

    try {
      await Promise.all(deletePromises);
      fetchCartData();
      showNotification("Pembayaran berhasil! Keranjang diperbarui.", "success");
    } catch (err: any) {
      setError(err.message);
      showNotification(
        "Pembayaran berhasil, tapi gagal memperbarui keranjang.",
        "error"
      );
    }
  };

  const handleBuyNow = async () => {
    const token = getToken();
    if (selectedItems.size === 0) {
      alert("Pilih minimal satu produk untuk dibeli.");
      return;
    }

    const selectedCartItems = items.filter((item) =>
      selectedItems.has(item.id)
    );

    try {
      // 1. Hit API Laravel → dapatkan snap token
      const response = await fetch("http://localhost:8000/api/v1/payment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
          name: userData.name,
          email: userData.email,
          cart_items: selectedCartItems.map((item) => ({
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      const data = await response.json();

      if (!data.token) {
        alert("Gagal membuat invoice Midtrans");
        return;
      }

      // 2. Buka popup pembayaran Midtrans
      window.snap.pay(data.token, {
        onSuccess: function (result: any) {
          console.log("Success:", result);
          // 3. Jika sukses, hapus item yang dibayar dari keranjang
          clearSelectedItemsAfterPayment();
        },
        onPending: function (result: any) {
          console.log("Pending:", result);
        },
        onError: function (result: any) {
          console.log("Error:", result);
        },
        onClose: function () {
          console.log("Menutup Pop Up");
        },
      });
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat memulai pembayaran");
    }
  };

  if (loading) {
    return (
      <>
        {/* Navigasi */}
        <div className="hidden lg:block">
          <Navigation />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 lg:mt-26 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="hidden lg:block h-8 w-32 bg-gray-200 rounded animate-pulse mb-6"></div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Cart Items Section - Skeleton */}
              <div className="lg:col-span-2 space-y-4">
                {/* Select All - Desktop */}
                <div className="hidden lg:block bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Mobile: Product count and delete */}
                <div className="lg:hidden bg-white px-4 py-3 mt-16 flex items-center justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Cart Items - Skeleton */}
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="bg-white lg:rounded-lg lg:shadow-sm overflow-hidden"
                  >
                    <div className="flex items-center gap-3 p-4 border-b">
                      <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    </div>

                    <div className="p-4">
                      <div className="flex gap-3 lg:gap-4">
                        <div className="w-6 h-6 bg-gray-200 rounded animate-pulse shrink-0"></div>

                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gray-200 rounded-lg shrink-0 animate-pulse"></div>

                        <div className="flex-1 min-w-0">
                          <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
                          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-3"></div>

                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
                            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>

                            {/* Desktop: Action buttons and quantity */}
                            <div className="hidden lg:flex items-center gap-4">
                              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>

                              <div className="flex items-center border rounded-lg">
                                <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                                <div className="w-12 h-8 bg-gray-200 animate-pulse"></div>
                                <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                              </div>
                            </div>

                            {/* Mobile: Quantity controls only */}
                            <div className="lg:hidden flex items-center border rounded-lg self-end">
                              <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                              <div className="w-12 h-8 bg-gray-200 animate-pulse"></div>
                              <div className="w-8 h-8 bg-gray-200 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Summary Section - Skeleton */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>

                  <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Bar - Skeleton */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

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
            <button
              onClick={() => window.location.reload()}
              className="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <>
        {/* Navigasi */}
        <div className="hidden lg:block">
          <Navigation />
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <a href="/" className="text-gray-700">
                <IoChevronBack className="w-6 h-6" />
              </a>
              <h1 className="text-lg font-semibold">Keranjang</h1>
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50 lg:mt-26 lg:p-8 pb-32 lg:pb-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="hidden lg:block text-[26px] font-semibold mb-6">
              Keranjang
            </h1>

            <div className="grid lg:grid-cols-3">
              {/* Cart Items Section - Empty State */}
              <div className="lg:col-span-2 mt-6">
                <div className="bg-white rounded-lg p-8 text-center mt-4">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-24 h-24 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">
                    Keranjang belanja Anda kosong
                  </h2>
                  <p className="text-gray-500 mb-4">
                    Tambahkan produk ke keranjang untuk melanjutkan belanja
                  </p>
                  <a
                    href="/"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                  >
                    Mulai Belanja
                  </a>
                </div>
              </div>

              {/* Desktop Summary Section - Empty State */}
              <div className="hidden lg:block lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                  <h2 className="text-xl font-bold mb-4">Ringkasan belanja</h2>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-gray-600">Total</span>
                    <span className="text-2xl font-bold">Rp0</span>
                  </div>

                  <button
                    disabled
                    className="w-full bg-gray-300 cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Beli (0)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const selectedCount = selectedItems.size;

  return (
    <>
      {/* Navigasi */}
      <div className="hidden lg:block">
        <Navigation />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <a href="/" className="text-gray-700">
              <IoChevronBack className="w-6 h-6" />
            </a>
            <h1 className="text-lg font-semibold">Keranjang</h1>
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 lg:mt-26 lg:p-8 pb-32 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="hidden lg:block text-[26px] font-semibold mb-6">
            Keranjang
          </h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All - Desktop */}
              <div className="hidden lg:block bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleSelectAll}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        selectAll
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectAll && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                    <span className="font-medium">
                      Pilih Semua{" "}
                      <span className="text-gray-500">({items.length})</span>
                    </span>
                  </div>
                  <button
                    onClick={
                      selectedItems.size === items.length
                        ? removeAllItems
                        : () => {
                            selectedItems.forEach((id) => removeItem(id));
                          }
                    }
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Mobile: Product count and delete */}
              <div className="lg:hidden bg-white px-4 py-3 mt-16 flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {items.length} produk terpilih
                </span>
                <button
                  onClick={
                    selectedItems.size === items.length
                      ? removeAllItems
                      : () => {
                          selectedItems.forEach((id) => removeItem(id));
                        }
                  }
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Hapus
                </button>
              </div>

              {/* Cart Items */}
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white lg:rounded-lg lg:shadow-sm overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 border-b">
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedItems.has(item.id)
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedItems.has(item.id) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex gap-3 lg:gap-4">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                          selectedItems.has(item.id)
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedItems.has(item.id) && (
                          <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </button>

                      <div className="relative w-20 h-20 lg:w-24 lg:h-24 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <a
                          href={`/detail-produk/${slugify(item.name)}/${
                            item.product_id
                          }`}
                        >
                          <h3 className="text-sm font-medium mb-1 line-clamp-2">
                            {item.name}
                          </h3>
                        </a>

                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2 lg:gap-0">
                          <div>
                            <span className="text-base lg:text-lg font-bold">
                              {formatPrice(item.price)}
                            </span>
                          </div>

                          {/* Desktop: Action buttons and quantity */}
                          <div className="hidden lg:flex items-center gap-4">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <MdDeleteOutline className="w-5 h-5" />
                            </button>

                            <div className="flex items-center border rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                              >
                                −
                              </button>
                              <span className="px-4 py-1 border-x min-w-12 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Mobile: Quantity controls only */}
                          <div className="lg:hidden flex items-center border rounded-lg self-end">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-1.5 text-green-600 hover:bg-gray-50 transition-colors"
                            >
                              −
                            </button>
                            <span className="px-4 py-1.5 border-x min-w-12 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-1.5 text-green-600 hover:bg-gray-50 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Summary Section */}
            <div className="hidden lg:block lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-36">
                <h2 className="text-xl font-bold mb-4">Ringkasan belanja</h2>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* ✅ Tambahkan onClick untuk memanggil handleBuyNow */}
                <button
                  onClick={handleBuyNow}
                  className={`w-full ${
                    selectedCount > 0
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-300 cursor-not-allowed"
                  } text-white font-bold py-3 px-6 rounded-lg transition-colors`}
                  disabled={selectedCount === 0}
                >
                  Beli ({selectedCount})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  selectAll
                    ? "bg-green-500 border-green-500"
                    : "border-gray-300"
                }`}
              >
                {selectAll && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
              <div className="text-left">
                <span className="text-base font-bold">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
            <button
              onClick={handleBuyNow}
              className={`bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-colors ${
                selectedCount === 0 ? "disabled:bg-gray-300" : ""
              }`}
              disabled={selectedCount === 0}
            >
              Beli ({selectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* <div className="hidden lg:block">
        <Footer />
      </div> */}
      <Footer />
    </>
  );
};

export default CartProduct;
