import React from "react";
import { FaAward, FaHeart, FaShieldAlt } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import Footer from "./Footer";

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const AboutSection: React.FC = () => {
  const values: ValueItem[] = [
    {
      icon: <IoSparkles className="w-6 h-6" />,
      title: "Desain Lokal Original",
      description:
        "Setiap desain dibuat in-house oleh tim kreatif lokal dengan identitas khas streetwear Indonesia.",
    },
    {
      icon: <FaAward className="w-6 h-6" />,
      title: "Kualitas Premium",
      description:
        "Material pilihan dengan sablon berkualitas tinggi yang awet dan nyaman dipakai daily.",
    },
    {
      icon: <FaShieldAlt className="w-6 h-6" />,
      title: "100% Original",
      description:
        "Semua produk adalah karya original kami. No plagiat, no bootleg. Pure authenticity.",
    },
    {
      icon: <FaHeart className="w-6 h-6" />,
      title: "Community Driven",
      description:
        "Dibangun bersama komunitas streetwear lokal yang passionate dan supportive.",
    },
  ];

  return (
    <>
      <section
        id="about"
        className="relative py-20 md:py-32 bg-zinc-900 overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4">
                TENTANG DISTROZONE
              </h2>
              <div className="h-1 w-20 bg-orange-500 mx-auto rounded-full" />
            </div>
          </div>

          {/* Main Content - 2 Column Layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
            {/* Left Column - Image/Visual */}
            <div className="relative group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-zinc-800 to-zinc-900 border border-white/10">
                {/* Image Placeholder with Pattern */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute inset-0 opacity-30" />
                  <img
                    src="/images/distro-zone.png"
                    alt="DistroZone"
                    className="w-full h-48"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-linear-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-orange-500 text-white px-6 py-4 rounded-xl shadow-xl rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <div className="text-3xl font-black">2025</div>
                <div className="text-xs font-medium opacity-90">EST.</div>
              </div>
            </div>

            {/* Right Column - Text Content */}
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  <span className="text-orange-500 font-bold">Distrozone</span>{" "}
                  lahir dari passion kami terhadap streetwear dan keinginan
                  untuk menghadirkan fashion lokal berkualitas tinggi yang
                  authentic dan affordable.
                </p>

                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                  Dimulai dari garasi kecil di 2025, kami percaya bahwa fashion
                  bukan hanya soal pakaian—tapi tentang{" "}
                  <span className="text-white font-semibold">
                    identitas, ekspresi diri, dan komunitas
                  </span>
                  . Setiap produk yang kami buat adalah hasil kolaborasi tim
                  kreatif lokal yang memahami culture dan style anak muda
                  Indonesia.
                </p>

                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                  Kami tidak hanya menjual produk, tapi membangun movement untuk
                  mendukung karya lokal dan memberikan platform bagi
                  desainer-desainer muda Indonesia untuk berkarya.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-orange-500 mb-1">
                    5K+
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    Happy Customers
                  </div>
                </div>
                <div className="text-center border-x border-white/10">
                  <div className="text-3xl md:text-4xl font-black text-orange-500 mb-1">
                    150+
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    Unique Designs
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-orange-500 mb-1">
                    4.9
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium">
                    Rating Score
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-zinc-800/50 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-14 h-14 bg-orange-500/10 text-orange-500 rounded-xl mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 group-hover:scale-110">
                  {value.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {value.description}
                </p>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-linear-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-transparent rounded-xl transition-all duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default AboutSection;
