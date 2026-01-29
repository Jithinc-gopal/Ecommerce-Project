import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaEye, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const images = [
  {
    url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Premium Eyewear",
    subtitle: "Experience unmatched clarity",
    cta: "Explore Collection"
  },
  {
    url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Summer Collection",
    subtitle: "Protect your eyes in style",
    cta: "Shop Sunglasses"
  },
  {
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    title: "Digital Eye Care",
    subtitle: "Designed for screen time",
    cta: "View Computer Glasses"
  }
];

export const Banner = () => {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setIsAnimating(false), 700);
  }, [isAnimating]);

  const goToSlide = (slideIndex) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIndex(slideIndex);
    setTimeout(() => setIsAnimating(false), 700);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] md:h-[90vh] lg:h-[95vh] overflow-hidden group">
      
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 via-purple-900/10 to-black/5 z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/30 z-10"></div>
      
      {/* Slider Container */}
      <div
        className={`flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${isAnimating ? '' : ''}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="w-full h-full flex-shrink-0 relative">
            {/* Main Image with Parallax Effect */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-7000"
              />
            </div>
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black/60 z-0"></div>
            
            {/* Content Container */}
            <div className="relative z-20 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl ml-0 lg:ml-12">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 animate-fadeInUp">
                    <FaEye className="w-4 h-4 text-amber-300" />
                    <span className="text-sm font-semibold text-white">New Collection</span>
                  </div>
                  
                  {/* Main Title */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 leading-tight animate-fadeInUp animation-delay-100">
                    <span className="block bg-gradient-to-r from-white via-gray-100 to-amber-100 bg-clip-text text-transparent">
                      {img.title}
                    </span>
                    <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-amber-100 mt-2">
                      {img.subtitle}
                    </span>
                  </h1>
                  
                  {/* Description */}
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl animate-fadeInUp animation-delay-200">
                    Discover eyewear that combines cutting-edge technology with timeless design for optimal comfort and style.
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 animate-fadeInUp animation-delay-300">
                    <Link
                      to="/home"
                      className="group/btn inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FaShoppingBag className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                      {img.cta}
                      <FaArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    
                    <Link
                      to="/about"
                      className="group/btn2 inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 hover:border-white/30 transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Learn More
                    </Link>
                  </div>
                  
                  {/* Features */}
                  <div className="mt-12 flex flex-wrap gap-6 animate-fadeInUp animation-delay-400">
                    {['100% UV Protection', 'Premium Materials', 'Free Returns', '2-Year Warranty'].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-200">{feature}</span>
                      </div>
                    ))}
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
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <FaChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 hover:scale-110 active:scale-95 transition-all duration-300 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <FaChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            className={`transition-all duration-300 rounded-full ${
              i === index 
                ? 'w-10 h-3 bg-gradient-to-r from-amber-400 to-orange-500' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 md:bottom-10 right-4 md:right-8 z-30 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
        <span className="text-sm font-medium text-white">
          {index + 1} / {images.length}
        </span>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-full blur-3xl -z-0"></div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your CSS or Tailwind config
const styles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.8s ease-out forwards;
  opacity: 0;
}

.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-300 {
  animation-delay: 0.3s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}
`;

// Add the styles to the document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}