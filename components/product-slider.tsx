"use client";

import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, TouchEvent, useEffect } from "react";
import ProductCard from "./ui/product-card";

interface ProductSliderProps {
  title?: string;
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imagesPerView, setImagesPerView] = useState(4);
  const sliderRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    const updateImagesPerView = () => {
      if (window.innerWidth >= 1024) setImagesPerView(4);
      else if (window.innerWidth >= 768) setImagesPerView(3);
      else setImagesPerView(2);
    };

    updateImagesPerView();
    window.addEventListener('resize', updateImagesPerView);
    return () => window.removeEventListener('resize', updateImagesPerView);
  }, []);

  const totalSlides = Math.max(0, Math.ceil((products.length - imagesPerView) / 1));

  const handleTouchStart = (e: TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < totalSlides) {
      setCurrentIndex(prev => prev + 1);
    }
    
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextSlide = () => {
    if (currentIndex < totalSlides) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">{title}</h2>
      <div 
        className="overflow-hidden touch-pan-x"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)` }}
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
        className="absolute left-2 top-1/2 -translate-y-1/2 shadow-lg dark:shadow-gray-900 rounded-full p-3 z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        disabled={currentIndex === 0}
      >
        <ChevronLeft size={24} className="text-pink-600 dark:text-pink-600" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 shadow-lg dark:shadow-gray-900 rounded-full p-3 z-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        disabled={currentIndex === totalSlides}
      >
        <ChevronRight size={24} className="text-pink-600 dark:text-pink-600" />
      </button>

      <div className="flex justify-center mt-4 space-x-1.5">
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
