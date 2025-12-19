import React from "react";
import { FaArrowRight } from "react-icons/fa";
import Navbar from "./Navigation";
import Footer from "./Footer";

interface Category {
  id: number;
  name: string;
  slug: string;
  itemCount: number;
  image: string;
  description: string;
  color: string;
}

const CategoriesSection: React.FC = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: "T-SHIRT",
      slug: "tshirt",
      itemCount: 45,
      image: "tshirt-category",
      description: "Koleksi kaos dengan desain original",
      color: "from-orange-600/80 to-orange-900/80",
    },
    {
      id: 2,
      name: "HOODIE",
      slug: "hoodie",
      itemCount: 32,
      image: "hoodie-category",
      description: "Hoodie premium untuk gaya streetwear",
      color: "from-blue-600/80 to-blue-900/80",
    },
    {
      id: 3,
      name: "JAKET",
      slug: "jacket",
      itemCount: 18,
      image: "jacket-category",
      description: "Jaket stylish untuk berbagai occasion",
      color: "from-purple-600/80 to-purple-900/80",
    },
    {
      id: 4,
      name: "AKSESORIS",
      slug: "accessories",
      itemCount: 25,
      image: "accessories-category",
      description: "Lengkapi style dengan aksesoris keren",
      color: "from-green-600/80 to-green-900/80",
    },
    {
      id: 5,
      name: "SWEATER",
      slug: "sweater",
      itemCount: 28,
      image: "sweater-category",
      description: "Sweater nyaman untuk daily wear",
      color: "from-red-600/80 to-red-900/80",
    },
    {
      id: 6,
      name: "CELANA",
      slug: "pants",
      itemCount: 22,
      image: "pants-category",
      description: "Celana casual dan streetwear",
      color: "from-cyan-600/80 to-cyan-900/80",
    },
  ];

  const handleCategoryClick = (slug: string) => {
    console.log(`Navigate to category: ${slug}`);
    // Router navigation: navigate(`/kategori/${slug}`)
  };

  return (
    <>
      {/* navbar */}
      <Navbar />
      <section className="relative py-20 md:py-32 bg-black overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                KATEGORI PRODUK
              </h2>
              <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
                Temukan style yang kamu cari dalam berbagai kategori pilihan
              </p>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="group relative aspect-4/5 rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-500"
              >
                {/* Background Image Placeholder */}
                <div className="absolute inset-0 bg-linear-to-br from-zinc-800 to-zinc-900">
                  {/* Pattern Background */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                      repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255, 107, 0, 0.1) 10px,
                        rgba(255, 107, 0, 0.1) 20px
                      )
                    `,
                    }}
                  />

                  {/* Category Name Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl md:text-7xl font-black text-white/5 transform rotate-12">
                      {category.name}
                    </div>
                  </div>

                  {/* Image Zoom Effect Container */}
                  <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-700" />
                </div>

                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-linear-to-t ${category.color} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}
                />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                    {/* Category Name */}
                    <h3 className="text-3xl md:text-4xl font-black text-white mb-2">
                      {category.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-white/80 mb-3 opacity-90">
                      {category.description}
                    </p>

                    {/* Item Count */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-white/90 font-semibold">
                        {category.itemCount}+ Item
                      </span>
                      <div className="flex items-center space-x-1 text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-semibold">
                          Lihat Koleksi
                        </span>
                        <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Progress Bar (visual interest) */}
                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Hover Border Glow */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-orange-500/0 group-hover:ring-orange-500/50 transition-all duration-500" />
              </button>
            ))}
          </div>
        </div>
      </section>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default CategoriesSection;
