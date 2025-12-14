import { useEffect, useState, type FC } from "react";

interface CardProductProps {
  id: number;
  image: string;
  title: string;
  finalPrice: number;
}

// Komponen CardProduct tidak diubah, tetap menerima props individual
const CardProduct: FC<CardProductProps> = ({
  id,
  image,
  title,
  finalPrice,
}) => {
  const formatPrice = (price: number): string => {
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

  const productSlug = slugify(title);
  const detailUrl = `/detail-produk/${productSlug}/${id}`;

  return (
    <a href={detailUrl}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full max-w-xs">
        {/* Image Container */}
        <div className="relative">
          <img src={image} alt={title} className="w-full h-64 object-cover" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-gray-800 font-medium text-base mb-3 h-12 line-clamp-2">
            {title}
          </h3>

          {/* Price Section - Hanya harga final */}
          <div className="text-gray-900 font-bold text-xl">
            {formatPrice(finalPrice)}
          </div>
        </div>
      </div>
    </a>
  );
};

// Skeleton Loader Component
const ProductSkeleton: FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-xs">
      {/* Skeleton Image */}
      <div className="relative">
        <div className="w-full h-64 bg-gray-200 animate-pulse"></div>
      </div>

      {/* Skeleton Content */}
      <div className="p-4">
        {/* Skeleton Title */}
        <div className="h-12 mb-3">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        </div>

        {/* Skeleton Price */}
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );
};

// 1. Tentukan props baru untuk komponen ini
interface ProductListProps {
  // Props 'products' bersifat opsional. Jika ada, gunakan data ini.
  products?: Array<{
    id: number;
    image: string;
    title: string;
    finalPrice: number;
  }>;
}

// 2. Ubah nama komponen dan tambahkan props
const ProductList: FC<ProductListProps> = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts || null);
  const [loading, setLoading] = useState(!initialProducts);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    // Jika sudah ada produk dari props, tidak perlu fetch lagi
    if (initialProducts) {
      return;
    }

    try {
      setLoading(true);
      const productResponse = await fetch(
        "http://localhost:8000/api/v1/product"
      );
      if (!productResponse.ok) throw new Error("Gagal mengambil data produk");
      const productData = await productResponse.json();

      const imageResponse = await fetch(
        "http://localhost:8000/api/v1/product-image"
      );
      if (!imageResponse.ok)
        throw new Error("Gagal mengambil data gambar produk");
      const imageData = await imageResponse.json();

      const productsWithImages = productData.data.map((product: any) => {
        const productImage = imageData.data.find(
          (img: any) => Number(img.product_id) === Number(product.id)
        );

        return {
          id: product.id,
          image: productImage ? productImage.image_url : product.productName,
          title: product.product_name,
          finalPrice: product.price,
        };
      });

      setProducts(productsWithImages);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [initialProducts]);

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

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {loading
            ? Array.from({ length: 10 }).map((_, index) => (
                <ProductSkeleton key={`skeleton-${index}`} />
              ))
            : products?.map((product) => (
                <CardProduct
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  title={product.title}
                  finalPrice={product.finalPrice}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

export { CardProduct };
export default ProductList;
