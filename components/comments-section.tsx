"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from 'next-intl';

interface Comment {
  id: string;
  imageUrl: string;
}

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('comment');

  // Update isMobile state based on window width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate slides based on screen size
  const imagesPerView = isMobile ? 3 : 4;  // Show 3 images on mobile
  const totalSlides = Math.max(0, Math.ceil((comments.length - imagesPerView) / 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;

    // Check if the movement is primarily horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
      e.preventDefault(); // Prevent vertical scrolling during horizontal swipe
      if (Math.abs(diffX) > 50) {
        // Reduced threshold for swipe detection
        if (diffX > 0 && currentIndex < totalSlides) {
          setCurrentIndex((prev) => prev + 1);
        } else if (diffX < 0 && currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
        }
        setIsDragging(false);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const moveLeft = () => {
    setCurrentIndex(prev =>
      prev === 0 ? totalSlides : prev - 1
    );
  };

  const moveRight = () => {
    setCurrentIndex(prev =>
      prev >= totalSlides ? 0 : prev + 1
    );
  };

  return (
    <div className="comments-section py-6 md:py-10">
      <h2 className="text-2xl font-semibold text-center mb-6 md:mb-8">{t('comments')}</h2>
      <div className="relative px-2 md:px-4">
        <div
          className="overflow-hidden touch-pan-y"
          ref={sliderRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / imagesPerView)}%)`,
            }}
          >
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="flex-shrink-0 w-1/3 md:w-1/4 px-1 md:px-2"  // Updated to w-1/3 for mobile
              >
                <div className="aspect-square relative">
                  <img
                    src={comment.imageUrl}
                    alt={`Client ${comment.id}`}
                    className="w-full h-full rounded-lg object-cover shadow-lg"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="absolute inset-y-0 left-0 flex items-center">
          <button
            onClick={moveLeft}
            className="bg-white/80 backdrop-blur-sm text-gray-800 p-1.5 md:p-2 rounded-lg shadow-lg 
                     hover:bg-white hover:scale-100 transition-all duration-300 
                     border border-gray-200"
          >
            <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center">
          <button
            onClick={moveRight}
            className="bg-white/80 backdrop-blur-sm text-gray-800 p-1.5 md:p-2 rounded-lg shadow-lg 
                     hover:bg-white hover:scale-100 transition-all duration-300 
                     border border-gray-200"
          >
            <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-3 md:mt-4 space-x-1.5">
          {Array.from({ length: totalSlides + 1 }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? "bg-gray-800 w-3 md:w-4" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;