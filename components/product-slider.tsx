"use client";

import { Product } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, TouchEvent } from "react";
import ProductCard from "./ui/product-card";

interface ProductSliderProps {
  title?: string;
  products: Product[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    setTranslateX(-currentIndex * 100 + (diff / sliderRef.current.offsetWidth) * 100);
  };

  const handleTouchEnd = () => {
    if (!sliderRef.current) return;

    const threshold = 0.2; // 20% of the slider width
    const direction = translateX > 0 ? -1 : 1;

    if (Math.abs(translateX) > threshold * 100) {
      if (direction === 1 && currentIndex < products.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (direction === -1 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }

    setTranslateX(-currentIndex * 100);
    setIsDragging(false);
  };

  const nextSlide = () => {
    if (currentIndex < products.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTranslateX(-(currentIndex + 1) * 100);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setTranslateX(-(currentIndex - 1) * 100);
    }
  };

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">{title}</h2>
      <div
        className="overflow-hidden touch-pan-y"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] p-2"
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
        disabled={currentIndex === products.length - 1}
      >
        <ChevronRight size={24} className="text-pink-600 dark:text-pink-600" />
      </button>
    </div>
  );
};

export default ProductSlider;