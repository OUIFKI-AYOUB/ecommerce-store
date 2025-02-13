'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Billboard as BillboardType } from '@/types';

interface BillboardSliderProps {
  items: BillboardType[];
}

const BillboardSlider: React.FC<BillboardSliderProps> = ({ items }) => {
  if (!items.length) return null;

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="w-full [&_.swiper-button-next]:text-white [&_.swiper-button-next]:bg-black/50 [&_.swiper-button-next]:p-5 [&_.swiper-button-next]:rounded-full
        [&_.swiper-button-prev]:text-white [&_.swiper-button-prev]:bg-black/50 [&_.swiper-button-prev]:p-5 [&_.swiper-button-prev]:rounded-full
        [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet-active]:bg-white"
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className='p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden'>
              <div
                className='rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover'
                style={{ backgroundImage: `url('${item?.imageUrl}')` }}
              >
                <div className='h-full w-full flex flex-col justify-center items-center text-center gap-y-8'>
                  <div className='font-bold text-3xl sm:text-5xl lg:text-6xl sm:max-w-xl max-w-xs'>
                    {item.label}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BillboardSlider;
