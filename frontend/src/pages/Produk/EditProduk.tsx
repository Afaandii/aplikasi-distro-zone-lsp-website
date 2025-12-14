import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Select from "../../components/form/Select";
import TextArea from "../../components/form/input/TextArea";
import axios from "axios";

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([]);
  const [jenis, setJenis] = useState<{ value: string; label: string }[]>([]);
  const [brands, setBrands] = useState<{ value: string; label: string }[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    category_id: "",
    type_id: "",
    brand_id: "",
    product_name: "",
    price: "",
    stock: "",
    ratings: "",
    spesification_product: "",
    information_product: "",
  });

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  useEffect(() => {
    const token = getToken();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/v1/edit-product/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { product, categories, types, brands } = response.data.data;

        // Format select options
        const formattedCategories = categories.map((cat: any) => ({
          value: cat.id.toString(),
          label: cat.category_name || "N/A",
        }));
        const formattedJenis = types.map((jenis: any) => ({
          value: jenis.id.toString(),
          label: jenis.type_name || "N/A",
        }));
        const formattedBrands = brands.map((brand: any) => ({
          value: brand.id.toString(),
          label: brand.brand_name || "N/A",
        }));

        setFormData({
          category_id: product.category_id?.toString() || "",
          type_id: product.type_id?.toString() || "",
          brand_id: product.brand_id?.toString() || "",
          product_name: product.product_name || "",
          price: product.price?.toString() || "",
          stock: product.stock?.toString() || "",
          ratings: product.rating?.toString() || "",
          spesification_product: product.spesification_product || "",
          information_product: product.information_product || "",
        });

        setCategories(formattedCategories);
        setJenis(formattedJenis);
        setBrands(formattedBrands);
      } catch (err) {
        console.error("Error fetching ", err);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: value.toString() }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();

    if (
      !formData.category_id ||
      !formData.type_id ||
      !formData.brand_id ||
      !formData.product_name ||
      !formData.price ||
      !formData.stock
    ) {
      setMessage("Harap lengkapi semua field wajib.");
      return;
    }

    try {
      const payload = {
        category_id: formData.category_id,
        type_id: formData.type_id,
        brand_id: formData.brand_id,
        product_name: formData.product_name,
        price: parseInt(formData.price),
        stock: parseInt(formData.stock),
        rating: parseFloat(formData.ratings) || 0,
        spesification_product: formData.spesification_product,
        information_product: formData.information_product,
      };

      await axios.put(
        `http://localhost:8000/api/v1/update-product/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Produk berhasil diperbarui.");
      setTimeout(() => navigate("/product"), 1500);
    } catch (err: any) {
      console.error("Error updating product:", err);
    }
  };

  return (
    <>
      <section className="mb-6">
        <div className="flex items-center justify-between p-3 rounded-t-lg">
          <h1 className="text-2xl font-bold text-white">Form Edit Product</h1>
        </div>
      </section>

      {message && (
        <div className="mb-4 p-3 bg-green-600 text-white rounded-md flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-white hover:text-gray-200"
          >
            &times;
          </button>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Category */}
            <div className="mb-4">
              <label
                htmlFor="category_id"
                className="block text-sm font-medium text-white mb-1"
              >
                Category
              </label>
              <Select
                options={categories}
                placeholder="Pilih Kategori"
                defaultValue={formData.category_id}
                onChange={handleSelectChange("category_id")}
                id="category_id"
              />
            </div>

            {/* Jenis */}
            <div className="mb-4">
              <label
                htmlFor="type_id"
                className="block text-sm font-medium text-white mb-1"
              >
                Jenis
              </label>
              <Select
                options={jenis}
                placeholder="Pilih Jenis"
                defaultValue={formData.type_id}
                onChange={handleSelectChange("type_id")}
                id="type_id"
              />
            </div>

            {/* Merk */}
            <div className="mb-4">
              <label
                htmlFor="brand_id"
                className="block text-sm font-medium text-white mb-1"
              >
                Merk
              </label>
              <Select
                options={brands}
                placeholder="Pilih Merk"
                defaultValue={formData.brand_id}
                onChange={handleSelectChange("brand_id")}
                id="brand_id"
              />
            </div>

            {/* Nama Produk Field */}
            <div className="mb-4">
              <label
                htmlFor="product_name"
                className="block text-sm font-medium text-white mb-1"
              >
                Nama Produk
              </label>
              <input
                type="text"
                id="product_name"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="Masukan nama produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Price Field */}
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-white mb-1"
              >
                Harga Produk
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Masukan harga produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Stock Field */}
            <div className="mb-4">
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-white mb-1"
              >
                Stock Produk
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Masukan stock produk"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Ratings Field */}
            <div className="mb-4">
              <label
                htmlFor="ratings"
                className="block text-sm font-medium text-white mb-1"
              >
                Ratings Produk
              </label>
              <input
                type="number"
                step={0.1}
                inputMode="decimal"
                id="ratings"
                name="ratings"
                value={formData.ratings}
                onChange={handleChange}
                placeholder="Masukan rating produk, contoh: 4.5"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* spesifikasi Field */}
            <div className="mb-6">
              <label
                htmlFor="spesification_product"
                className="block text-sm font-medium text-white mb-1"
              >
                Spesifikasi Produk
              </label>
              <TextArea
                rows={6}
                value={formData.spesification_product}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    spesification_product: value,
                  }))
                }
                placeholder="Masukan Spesifikasi Produk"
              />
            </div>

            {/* informasi Field */}
            <div className="mb-6">
              <label
                htmlFor="information_product"
                className="block text-sm font-medium text-white mb-1"
              >
                Informasi Produk
              </label>
              <TextArea
                rows={6}
                value={formData.information_product}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    information_product: value,
                  }))
                }
                placeholder="Masukan Informasi Produk"
              />
            </div>

            {/* Tombol Simpan dan Kembali */}
            <div className="flex justify-between">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
              >
                Simpan
              </button>
              <Link
                to="/product"
                className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200"
              >
                Kembali
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
