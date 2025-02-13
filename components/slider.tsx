'use client';

import { Billboard as BillboardType } from '@/types';
import { useEffect, useState } from 'react';
import Billboard from '@/components/billboard';

interface SliderProps {
  billboards: BillboardType[];
}

const Slider: React.FC<SliderProps> = ({ billboards }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev === billboards.length - 1 ? 0 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [billboards.length]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
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
            className={`w-3 h-3 rounded-full ring-1 ring-gray-600 cursor-pointer flex items-center justify-center ${
              current === index ? "scale-150" : ""
            }`}
            key={index}
            onClick={() => setCurrent(index)}
          >
            {current === index && (
              <div className="w-[6px] h-[6px] bg-gray-600 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
