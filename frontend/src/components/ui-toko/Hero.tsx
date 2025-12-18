import React from "react";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";

const HeroSection: React.FC = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Gradient & Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent" />

        {/* Noise Texture for Urban Feel */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Animated Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Brand Badge */}
        <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-in">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-300 tracking-wide">
            EST. 2020 • LOCAL STREETWEAR
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-4 tracking-tighter animate-slide-up">
          <span className="block">DISTROZONE</span>
        </h1>

        {/* Tagline */}
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 mb-6 animate-slide-up delay-100">
          Fashion Lokal. Identitas Asli.
        </div>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 mb-10 leading-relaxed animate-slide-up delay-200">
          Distro streetwear lokal dengan desain original dan kualitas premium.
          Temukan gaya kamu, ekspresikan identitasmu.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up delay-300">
          <button
            onClick={scrollToProducts}
            className="group relative w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50"
          >
            <span className="relative z-10 flex items-center justify-center space-x-2">
              <span>Lihat Produk</span>
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={scrollToAbout}
            className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm border-2 border-white/20 hover:border-orange-500/50 text-white font-bold rounded-lg transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center justify-center space-x-2">
              <span>Tentang Kami</span>
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform opacity-50" />
            </span>
          </button>
        </div>

        {/* Social Proof / Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm text-gray-500 animate-fade-in delay-500">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold">✓</span>
            </div>
            <span>100% Original</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold">✓</span>
            </div>
            <span>Free Shipping</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
              <span className="text-orange-500 font-bold">✓</span>
            </div>
            <span>Garansi Kualitas</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={scrollToAbout}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Scroll down"
          >
            <FaChevronDown className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Demo Sections Below Hero */}
      <div
        id="about"
        className="absolute -bottom-96 left-0 right-0 h-96 bg-zinc-900"
      />
    </section>
  );
};

// Demo Page Wrapper with Navbar
const Demo: React.FC = () => {
  return (
    <div className="bg-zinc-900 min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
        
        .delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default Demo;
