"use client";

import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, TouchEvent, useEffect } from "react";
import ProductCard from "./ui/product-card";
import { useLocale } from "next-intl";

interface ProductSliderProps {
  title?: string;
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  useEffect(() => {
    const updateImagesPerView = () => {
      if (window.innerWidth >= 1024) setImagesPerView(4); // lg
      else if (window.innerWidth >= 768) setImagesPerView(3); // md
      else setImagesPerView(2); // mobile
    };

    updateImagesPerView();
    window.addEventListener("resize", updateImagesPerView);

    return () => window.removeEventListener("resize", updateImagesPerView);
  }, []);

  const totalSlides = Math.max(0, Math.ceil((products.length - imagesPerView) / 1));

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;

    const adjustedDiffX = isRTL ? -diffX : diffX;


    // Check if the movement is primarily horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault(); // Prevent vertical scrolling during horizontal swipe
      if (Math.abs(diffX) > 50) {
        // Reduced threshold for swipe detection
        if (adjustedDiffX > 0 && currentIndex < totalSlides) {
          setCurrentIndex((prev) => prev + 1);
        } else if (adjustedDiffX < 0 && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const nextSlide = () => {
    if (currentIndex < totalSlides) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative" dir={isRTL ? 'rtl' : 'ltr'}>
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">{title}</h2>
      <div
        className="overflow-hidden touch-pan-y"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ 
            transform: `translateX(${isRTL ? '' : '-'}${currentIndex * (100 / imagesPerView)}%)`,
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] p-2 transition-transform duration-300"
            >
              <ProductCard data={product} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1/2 -translate-y-1/2 shadow-lg dark:shadow-gray-900 rounded-full p-3 z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        disabled={currentIndex === 0}
      >
        {isRTL ? (
          <ChevronRight size={24} className="text-pink-600 dark:text-pink-600" />
        ) : (
          <ChevronLeft size={24} className="text-pink-600 dark:text-pink-600" />
        )}
      </button>

      <button
        onClick={nextSlide}
        className={`absolute ${isRTL ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 shadow-lg dark:shadow-gray-900 rounded-full p-3 z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
        disabled={currentIndex === totalSlides}
      >
        {isRTL ? (
          <ChevronLeft size={24} className="text-pink-600 dark:text-pink-600" />
        ) : (
          <ChevronRight size={24} className="text-pink-600 dark:text-pink-600" />
        )}
      </button>

      {/* Dots Navigation */}
      <div className="flex justify-center mt-4 space-x-1.5 rtl:space-x-reverse">
        {Array.from({ length: totalSlides + 1 }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
              currentIndex === idx ? "bg-pink-600 w-3 md:w-4" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;