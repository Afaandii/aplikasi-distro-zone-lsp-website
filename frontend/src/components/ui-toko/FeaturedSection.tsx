import React from "react";
import {
  FaAward,
  FaHeadphones,
  FaHeart,
  FaShieldAlt,
  FaStar,
  FaTruck,
} from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
import { TbPackage } from "react-icons/tb";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "100% Original",
      description:
        "Semua produk dijamin original dengan desain eksklusif dari tim kreatif kami. No plagiat, no bootleg.",
      color: "orange",
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      title: "Kualitas Premium",
      description:
        "Material pilihan dengan sablon DTF/DTG berkualitas tinggi yang awet hingga puluhan kali cuci.",
      color: "blue",
    },
    {
      icon: <FaTruck className="w-8 h-8" />,
      title: "Pengiriman Cepat",
      description:
        "Proses packing dalam 24 jam. Pengiriman ke seluruh Indonesia dengan tracking number real-time.",
      color: "green",
    },
    {
      icon: <FaHeart className="w-8 h-8" />,
      title: "Support Lokal",
      description:
        "Setiap pembelian kamu mendukung desainer dan komunitas streetwear lokal Indonesia.",
      color: "red",
    },
    {
      icon: <TbPackage className="w-8 h-8" />,
      title: "Packaging Premium",
      description:
        "Produk dikemas rapi dengan packaging khusus yang aman dan aesthetic untuk unboxing experience.",
      color: "purple",
    },
    {
      icon: <FaHeadphones className="w-8 h-8" />,
      title: "Customer Support",
      description:
        "Tim customer service siap membantu kamu 7 hari seminggu via WhatsApp dan DM Instagram.",
      color: "cyan",
    },
    {
      icon: <LuRefreshCw className="w-8 h-8" />,
      title: "Easy Return",
      description:
        "Garansi return 7 hari jika ada cacat produksi atau salah ukuran. Proses mudah tanpa ribet.",
      color: "yellow",
    },
    {
      icon: <FaStar className="w-8 h-8" />,
      title: "Member Benefits",
      description:
        "Dapatkan poin rewards, early access koleksi baru, dan diskon eksklusif untuk member setia.",
      color: "pink",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> =
      {
        orange: {
          bg: "bg-orange-500/10",
          text: "text-orange-500",
          border: "border-orange-500/20",
        },
        blue: {
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          border: "border-blue-500/20",
        },
        green: {
          bg: "bg-green-500/10",
          text: "text-green-500",
          border: "border-green-500/20",
        },
        red: {
          bg: "bg-red-500/10",
          text: "text-red-500",
          border: "border-red-500/20",
        },
        purple: {
          bg: "bg-purple-500/10",
          text: "text-purple-500",
          border: "border-purple-500/20",
        },
        cyan: {
          bg: "bg-cyan-500/10",
          text: "text-cyan-500",
          border: "border-cyan-500/20",
        },
        yellow: {
          bg: "bg-yellow-500/10",
          text: "text-yellow-500",
          border: "border-yellow-500/20",
        },
        pink: {
          bg: "bg-pink-500/10",
          text: "text-pink-500",
          border: "border-pink-500/20",
        },
      };
    return colors[color] || colors.orange;
  };

  return (
    <section className="relative py-20 md:py-32 bg-zinc-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500" />
              <span className="text-orange-500 font-bold text-sm tracking-wider uppercase">
                Our Advantages
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              KENAPA BELANJA DI DISTROZONE?
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Komitmen kami untuk memberikan pengalaman belanja terbaik
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => {
            const colorClasses = getColorClasses(feature.color);
            return (
              <div
                key={index}
                className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon Container */}
                <div
                  className={`flex items-center justify-center w-16 h-16 ${colorClasses.bg} ${colorClasses.text} rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Border Glow */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border-2 ${colorClasses.border}`}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom Stats/Social Proof */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                5,000<span className="text-orange-500">+</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Happy Customers
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                4.9<span className="text-orange-500">/5</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Average Rating
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                150<span className="text-orange-500">+</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Unique Designs
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                24<span className="text-orange-500">H</span>
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Fast Processing
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button className="group inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50">
            <span>Mulai Belanja Sekarang</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
