import React, { useState, useEffect } from "react";
import { FaChevronCircleRight, FaChevronLeft, FaStar } from "react-icons/fa";
import { MdFormatQuote } from "react-icons/md";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  product: string;
  date: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Rizky Pratama",
      location: "Jakarta",
      avatar: "RP",
      rating: 5,
      review:
        "Kualitas bahan premium banget! Sablon juga rapi dan ga mudah pecah. Sudah beli 3x dan selalu puas. Recommended buat yang cari distro lokal berkualitas.",
      product: "Urban Street Tee",
      date: "2 minggu lalu",
    },
    {
      id: 2,
      name: "Ayu Lestari",
      location: "Bandung",
      avatar: "AL",
      rating: 5,
      review:
        "Packaging-nya aesthetic banget, cocok buat kado! Pengiriman juga cepat, pesen hari ini besok udah sampe. Harga affordable untuk kualitas sekelas ini.",
      product: "Oversized Hoodie",
      date: "1 minggu lalu",
    },
    {
      id: 3,
      name: "Dimas Anggara",
      location: "Surabaya",
      avatar: "DA",
      rating: 5,
      review:
        "Desainnya unik dan ga pasaran. Suka banget sama konsepnya yang support desainer lokal. Bahan nyaman dan cutting-nya pas di badan.",
      product: "Classic Logo Tee",
      date: "3 hari lalu",
    },
    {
      id: 4,
      name: "Sari Wulandari",
      location: "Yogyakarta",
      avatar: "SW",
      rating: 5,
      review:
        "CS-nya fast respon dan helpful banget! Bantu milih size yang pas. Produknya sesuai ekspektasi, malah lebih bagus dari foto. Pasti bakal repeat order!",
      product: "Vintage Jacket",
      date: "5 hari lalu",
    },
    {
      id: 5,
      name: "Fajar Setiawan",
      location: "Medan",
      avatar: "FS",
      rating: 5,
      review:
        "Pertama kali beli di sini dan langsung jatuh cinta! Kualitas setara brand internasional tapi harga lebih reasonable. Support lokal emang the best!",
      product: "Graphic Tee Vol.2",
      date: "1 minggu lalu",
    },
    {
      id: 6,
      name: "Nina Amelia",
      location: "Semarang",
      avatar: "NA",
      rating: 5,
      review:
        "Hoodie-nya tebal dan hangat, perfect untuk AC kantor. Desainnya minimalis tapi tetep keren. Udah rekomendasiin ke temen-temen dan mereka juga suka!",
      product: "Zipper Hoodie",
      date: "4 hari lalu",
    },
  ];

  const itemsPerPage = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const [itemsToShow, setItemsToShow] = useState(itemsPerPage.desktop);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(itemsPerPage.mobile);
      } else if (window.innerWidth < 1024) {
        setItemsToShow(itemsPerPage.tablet);
      } else {
        setItemsToShow(itemsPerPage.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, itemsToShow]);

  const maxIndex = Math.max(0, testimonials.length - itemsToShow);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <FaStar
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "fill-orange-500 text-orange-500"
            : "fill-gray-700 text-gray-700"
        }`}
      />
    ));
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-orange-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-cyan-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <section className="relative py-20 md:py-32 bg-zinc-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500" />
              <span className="text-orange-500 font-bold text-sm tracking-wider uppercase">
                Customer Reviews
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
              APA KATA MEREKA?
            </h2>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Cerita dari customer yang sudah belanja di Distrozone
            </p>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="mb-12"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="relative">
            {/* Testimonials Container */}
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${
                    currentIndex * (100 / itemsToShow)
                  }%)`,
                }}
              >
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex-shrink-0 px-3"
                    style={{ width: `${100 / itemsToShow}%` }}
                  >
                    <div className="group relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-orange-500/50 transition-all duration-300 h-full flex flex-col">
                      {/* Quote Icon */}
                      <div className="absolute top-6 right-6 text-orange-500/20 group-hover:text-orange-500/30 transition-colors">
                        <MdFormatQuote className="w-12 h-12" />
                      </div>

                      {/* Avatar & Info */}
                      <div className="flex items-center space-x-4 mb-4 relative z-10">
                        <div
                          className={`flex-shrink-0 w-14 h-14 ${getAvatarColor(
                            testimonial.name
                          )} rounded-full flex items-center justify-center text-white font-bold text-lg`}
                        >
                          {testimonial.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base truncate">
                            {testimonial.name}
                          </h3>
                          <p className="text-gray-500 text-sm truncate">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-4">
                        {renderStars(testimonial.rating)}
                      </div>

                      {/* Review Text */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                        "{testimonial.review}"
                      </p>

                      {/* Product & Date */}
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                        <span className="font-medium">
                          {testimonial.product}
                        </span>
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows - Desktop */}
            {testimonials.length > itemsToShow && (
              <>
                <button
                  onClick={handlePrev}
                  className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 xl:-translate-x-12 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl z-10"
                  aria-label="Previous testimonials"
                >
                  <FaChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 xl:translate-x-12 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full items-center justify-center transition-all duration-300 hover:scale-110 shadow-xl z-10"
                  aria-label="Next testimonials"
                >
                  <FaChevronCircleRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Dots */}
        {testimonials.length > itemsToShow && (
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-8 h-2 bg-orange-500"
                    : "w-2 h-2 bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-20 pt-12 border-t border-white/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                4.9<span className="text-orange-500">/5</span>
              </div>
              <div className="text-sm text-gray-500">Average Rating</div>
              <div className="flex items-center justify-center space-x-1 mt-2">
                {renderStars(5)}
              </div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                5,000<span className="text-orange-500">+</span>
              </div>
              <div className="text-sm text-gray-500">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                98<span className="text-orange-500">%</span>
              </div>
              <div className="text-sm text-gray-500">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-white mb-2">
                1,200<span className="text-orange-500">+</span>
              </div>
              <div className="text-sm text-gray-500">5-Star Reviews</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6">
            Mau jadi bagian dari customer yang puas?
          </p>
          <button className="group inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50">
            <span>Belanja Sekarang</span>
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

export default TestimonialsSection;
