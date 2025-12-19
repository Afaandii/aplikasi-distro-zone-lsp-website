import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  highlight: string;
  bgColor: string;
  image: string; // URL gambar
}

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides: CarouselSlide[] = [
    {
      id: 1,
      title: "MakinTENANG~",
      subtitle: "Gajian Anti Boros",
      highlight: "Diskon 50% s.d. Rp600rb*",
      bgColor: "from-green-700 via-green-600 to-green-500",
      image: "https://picsum.photos/800/600?random=1",
    },
    {
      id: 2,
      title: "NEW YEAR JOY",
      subtitle: "Belanja Hemat Tahun Baru",
      highlight: "Diskon hingga 74%",
      bgColor: "from-blue-700 via-blue-600 to-blue-500",
      image: "https://picsum.photos/800/600?random=2",
    },
    {
      id: 3,
      title: "FLASH SALE",
      subtitle: "Kejutan Setiap Hari",
      highlight: "Diskon s.d. 80%",
      bgColor: "from-red-700 via-red-600 to-red-500",
      image: "https://picsum.photos/800/600?random=3",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="relative bg-white w-full mx-auto px-4 sm:px-6 pt-6 lg:pt-24">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {/* Slides Container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="min-w-full relative">
              {/* Gradient Background */}
              <div
                className={`bg-linear-to-r ${slide.bgColor} relative overflow-hidden`}
              >
                {/* Decorative Elements (hanya untuk desktop/tablet) */}
                <div className="absolute top-8 left-12 text-4xl opacity-70 hidden sm:block">
                  🌙
                </div>
                <div className="absolute top-16 left-24 text-2xl opacity-60 hidden sm:block">
                  ✨
                </div>
                <div className="absolute top-12 left-32 text-2xl opacity-50 hidden sm:block">
                  ✨
                </div>
                <div className="absolute bottom-20 left-20 text-3xl opacity-40 rotate-12 hidden sm:block">
                  🍃
                </div>
                <div className="absolute top-1/3 right-1/4 text-2xl opacity-30 hidden sm:block">
                  💳
                </div>
                <div className="absolute bottom-32 right-1/3 text-3xl opacity-40 -rotate-12 hidden sm:block">
                  🍃
                </div>

                {/* Glowing Effects (hanya untuk desktop/tablet) */}
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20 hidden sm:block"></div>
                <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-15 hidden sm:block"></div>

                {/* Content */}
                <div className="relative flex items-center justify-between px-4 sm:px-8 md:px-16 py-4 sm:py-6 md:py-8 min-h-62.5 sm:min-h-75">
                  {/* Left Content */}
                  <div className="flex-1 text-white space-y-2 sm:space-y-4">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">
                      {slide.title}
                    </h2>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold drop-shadow-md">
                      {slide.subtitle}
                    </h3>

                    <div className="inline-block">
                      <div className="bg-yellow-300 text-gray-900 px-4 sm:px-6 py-2 sm:py-3 rounded-xl -rotate-1 shadow-xl">
                        <p className="text-xl sm:text-2xl font-bold">
                          {slide.highlight}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm opacity-90 pt-2">
                      *S&K Berlaku
                    </p>
                  </div>

                  {/* Right Content - Image Mockup */}
                  <div className="flex-1 flex justify-center items-center">
                    <div className="relative w-32 sm:w-40 md:w-[18rem] h-40 sm:h-56 md:h-72">
                      {/* Phone Frame */}
                      <div className="w-full h-full bg-white rounded-3xl shadow-2xl transform rotate-6 hover:rotate-3 transition-transform duration-300 overflow-hidden">
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Floating Card */}
                      <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 bg-yellow-300 rounded-2xl p-1 sm:p-2 shadow-lg transform rotate-12 animate-pulse">
                        <div className="text-lg sm:text-xl">💳</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
          aria-label="Slide sebelumnya"
        >
          <FaChevronLeft size={20} className="sm:size-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
          aria-label="Slide berikutnya"
        >
          <FaChevronRight size={20} className="sm:size-6" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 sm:bottom-4 left-4 sm:left-12 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                currentSlide === index
                  ? "w-8 h-2 bg-white"
                  : "w-2 h-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Pergi ke slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
