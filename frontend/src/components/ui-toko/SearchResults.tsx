import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Navigation from "./Navigation";
import CardProduct from "./CardProduct";
import Footer from "./Footer";

// Komponen Skeleton Loading
const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-xs animate-pulse">
      <div className="w-full h-64 bg-gray-200"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-8 bg-gray-200 rounded mt-4 w-1/2"></div>
      </div>
    </div>
  );
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("sr");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // LANGKAH 1: Coba ambil data dari endpoint pencarian
        const productResponse = await axios.get(
          `http://localhost:8000/api/v1/product/search?sr=${query}`
        );
        const productData = productResponse.data.data;

        const imageResponse = await axios.get(
          "http://localhost:8000/api/v1/product-image"
        );
        const imageData = imageResponse.data.data;

        const productsWithImages = productData.map((product: any) => {
          const productImage = imageData.find(
            (img: any) => Number(img.product_id) === Number(product.id)
          );
          return {
            id: product.id,
            image: productImage
              ? productImage.image_url
              : "/placeholder-image.png",
            title: product.product_name,
            finalPrice: product.price,
          };
        });

        setProducts(productsWithImages);
      } catch (err: any) {
        // LANGKAH 2: Jika LANGKAH 1 gagal (misalnya error 404), jalankan logika fallback
        console.warn(
          "Endpoint search tidak ditemukan, menjalankan fallback pencarian di frontend...",
          err
        );
        try {
          // Ambil SEMUA produk
          const allProductsResponse = await axios.get(
            "http://localhost:8000/api/v1/product"
          );
          const allProducts = allProductsResponse.data.data;
          const imageResponse = await axios.get(
            "http://localhost:8000/api/v1/product-image"
          );
          const imageData = imageResponse.data.data;

          // Gabungkan produk dengan gambar
          const productsWithImages = allProducts.map((product: any) => {
            const productImage = imageData.find(
              (img: any) => Number(img.product_id) === Number(product.id)
            );
            return {
              id: product.id,
              image: productImage ? productImage.image_url : "",
              title: product.product_name,
              finalPrice: product.price,
            };
          });

          // Saring (filter) produk berdasarkan query di browser
          const filteredProducts = productsWithImages.filter((product: any) =>
            product.title.toLowerCase().includes(query.toLowerCase())
          );

          setProducts(filteredProducts);
        } catch (fallbackError) {
          console.error("Fallback juga gagal:", fallbackError);
          setError("Gagal memuat data produk. Silakan coba lagi nanti.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <>
      <Navigation />
      <main className="md:pt-[130px] pt-14 pb-16 bg-white min-h-screen">
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
            <CardProduct products={products} />
          ) : (
            <p className="text-center text-xl text-gray-500 py-10">
              Tidak ada produk ditemukan untuk pencarian "{query}".
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
