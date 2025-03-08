'use client';

import { Billboard as BillboardType } from '@/types';
import { useEffect, useState, TouchEvent } from 'react';
import Billboard from '@/components/billboard';

interface SliderProps {
  billboards: BillboardType[];
}

const Slider: React.FC<SliderProps> = ({ billboards }) => {
  const [current, setCurrent] = useState(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const isRTL = typeof document !== 'undefined' ? document.dir === 'rtl' : false;

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRTL) {
      if (isLeftSwipe && current > 0) {
        setCurrent(current - 1);
      }
      if (isRightSwipe && current < billboards.length - 1) {
        setCurrent(current + 1);
      }
    } else {
      if (isLeftSwipe && current < billboards.length - 1) {
        setCurrent(current + 1);
      }
      if (isRightSwipe && current > 0) {
        setCurrent(current - 1);
      }
    }

    setTouchEnd(0);
    setTouchStart(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === billboards.length - 1 ? 0 : prev + 1));
    }, 9000);
    return () => clearInterval(interval);
  }, [billboards.length]);

  return (
    <div className="relative overflow-hidden w-full">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: isRTL 
            ? `translateX(${current * 100}%)` 
            : `translateX(-${current * 100}%)`
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {billboards.map((billboard) => (
          <div
            className="min-w-full"
            key={billboard.id}
          >
            <Billboard data={billboard} />
          </div>
        ))}
      </div>

      <div className="absolute m-auto left-1/2 bottom-8 flex gap-4 transform -translate-x-1/2">
        {billboards.map((_, index) => (
          <div
            className={`w-3 h-3 rounded-full ring-1 ring-gray-400 cursor-pointer flex items-center justify-center ${
              current === index ? "scale-150" : ""
            }`}
            key={index}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-400 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
