"use client";

import React, { useEffect, useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useLocale } from 'next-intl';
import { Color } from '@/types';
const MediaType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO"
} as const;

type MediaType = typeof MediaType[keyof typeof MediaType];

interface MediaItem {
  id: string | number;
  type: MediaType;
  url: string;
  colorId?: string | number;
}

interface GalleryTabProps {
  mediaItem: MediaItem;
  isHighlighted?: boolean;

}

interface GalleryProps {
  media: MediaItem[];
  selectedColor?: Color | null;

}

const GalleryTab = ({ mediaItem }: GalleryTabProps) => {
  return (
    <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white">
      {({ selected }) => (
        <div>
          <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
            {mediaItem.type === MediaType.IMAGE ? (
              <Image
                fill
                src={mediaItem.url}
                alt=""
                className="object-cover object-center"
              />
            ) : (
              <video
                className="object-contain w-full h-full"
                src={mediaItem.url}
                controls={false}
                muted
                playsInline
              />
            )}
          </span>
          <span className={cn(
            "absolute inset-0 rounded-md ring-2 ring-offset-2",
            selected ? "ring-black dark:ring-pink-600" : "ring-transparent"
          )} />
        </div>
      )}
    </Tab>
  );
};

const Gallery = ({ media, selectedColor }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
    const locale = useLocale();
    const isRTL = locale === 'ar';

/*
    const handleTabChange = (index: number) => {
      // Only allow selection if no color is selected or if the media matches the selected color
      const targetMedia = media[index];
      if (!selectedColor || targetMedia.colorId === selectedColor.id) {
        setSelectedIndex(index);
      }
    };
    const displayMedia = selectedColor 
    ? media.find(item => item.colorId === selectedColor.id)?.url 
    : media[selectedIndex].url;*/
  
    // Find the first media matching selected color
    useEffect(() => {
      if (selectedColor) {
        const colorMediaIndex = media.findIndex(item => item.colorId === selectedColor.id);
        if (colorMediaIndex >= 0) {
          setSelectedIndex(colorMediaIndex);
        }
      }
    }, [selectedColor, media]);


  const nextMedia = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevMedia = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  const handleZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when zoomed
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage(null);
    document.body.style.overflow = 'unset'; // Re-enable scrolling
  };


  return (
    <>
      <TabGroup as="div" className="flex flex-col" selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <div className="relative overflow-hidden">
          <TabPanels className="aspect-square w-full">
            {media.map((item) => (
              <TabPanel key={item.id} className="absolute top-0 left-0 h-full w-full">
                <div className="aspect-square relative h-[95%] w-[95%] mx-auto sm:rounded-lg overflow-hidden group">
                  {item.type === MediaType.IMAGE ? (
                    <>
                      <Image
                        fill
                        src={item.url}
                        alt=""
                        className="object-cover object-center"
                        priority
                      />
                      <button
                        onClick={() => handleZoom(item.url)}
                        className="absolute right-4 top-4 p-2 rounded-full bg-white/80 
                          sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <ZoomIn size={20} className="text-black" />
                      </button>
                    </>
                  ) : (
                    <video
                      className="object-contain w-full h-full"
                      src={item.url}
                      controls
                      playsInline
                      key={item.id}
                    />
                  )}
                </div>
              </TabPanel>
            ))}
          </TabPanels>
          
          <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
            <button
              onClick={prevMedia}
              className="p-2 -m-[10px] rounded-full shadow  text-gray-800 hover:bg-white dark:hover:bg-gray-800 focus:outline-none pointer-events-auto"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
    <ChevronLeft size={24} className={`text-pink-600 dark:text-pink-600 ${isRTL ? 'rotate-180' : ''}`} />
    </button>
            <button
              onClick={nextMedia}
              className="p-2 -m-[10px]  shadow  rounded-full  text-gray-800 hover:bg-white dark:hover:bg-gray-800 focus:outline-none pointer-events-auto"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
    <ChevronRight size={24} className={`text-pink-600 dark:text-pink-600 ${isRTL ? 'rotate-180' : ''}`} />
    </button>
          </div>
        </div>
        <TabList className="grid grid-cols-4 gap-6 mt-4">
        {media.map((item) => (
          <GalleryTab 
            key={item.id}
            mediaItem={item}
            isHighlighted={selectedColor?.id === item.colorId}
          />
        ))}
      </TabList>
      </TabGroup>

      {isZoomed && zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeZoom}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeZoom();
            }}
            className="fixed top-4 right-4 text-white p-4 hover:bg-white/10 rounded-full z-[60]"
          >
            <X size={26} className='m-[30px] md:m-[10px] bg-slate-50 text-black' />
          </button>
          <div 
            className="relative w-[90vw] h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={zoomedImage}
              alt="Zoomed Image"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;

