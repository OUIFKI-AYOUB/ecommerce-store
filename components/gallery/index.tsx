"use client";

import React, { useState, useRef } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const MediaType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO"
} as const;

type MediaType = typeof MediaType[keyof typeof MediaType];

interface MediaItem {
  id: string | number;
  type: MediaType;
  url: string;
}

interface GalleryTabProps {
  mediaItem: MediaItem;
}

interface GalleryProps {
  media: MediaItem[];
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
            selected ? "ring-black" : "ring-transparent"
          )} />
        </div>
      )}
    </Tab>
  );
};

const Gallery = ({ media }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const nextMedia = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevMedia = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  const handleZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
    setScale(1); // Reset scale when zooming in
    setPosition({ x: 0, y: 0 }); // Reset position
    document.body.style.overflow = 'hidden';
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'unset';
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Pinch-to-zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const newScale = Math.max(1, distance / 100); // Adjust scale based on touch distance
      setScale(newScale);
    } else if (e.touches.length === 1) {
      // Panning
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - (imageRef.current?.clientWidth || 0) / 2,
        y: touch.clientY - (imageRef.current?.clientHeight || 0) / 2,
      });
    }
  };

  const handleDoubleTap = () => {
    if (scale === 1) {
      setScale(2); // Zoom in on double tap
    } else {
      setScale(1); // Reset zoom on double tap
    }
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
              className="p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none pointer-events-auto"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextMedia}
              className="p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none pointer-events-auto"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <TabList className="mx-auto mt-6 h-[95%] w-[95%] max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-4 gap-6">
            {media.map((item) => (
              <GalleryTab key={item.id} mediaItem={item} />
            ))}
          </div>
        </TabList>
      </TabGroup>

      {isZoomed && zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center touch-none"
          onClick={closeZoom}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeZoom();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
              closeZoom();
            }}
            className="fixed top-4 right-4 text-white p-4 hover:bg-white/10 rounded-full z-[60]"
            style={{ touchAction: 'manipulation' }}
          >
            <X size={24} className='m-[30px] md:m-[10px]' />
          </button>
          <div 
            ref={imageRef}
            className="relative w-[90vw] h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            onTouchMove={handleTouchMove}
            onDoubleClick={handleDoubleTap}
            style={{ touchAction: 'none' }}
          >
            <Image
              src={zoomedImage}
              alt="Zoomed Image"
              fill
              className="object-contain"
              priority
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.2s ease',
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;

/*"use client";

import React, { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const MediaType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO"
} as const;

type MediaType = typeof MediaType[keyof typeof MediaType];

interface MediaItem {
  id: string | number;
  type: MediaType;
  url: string;
}

interface GalleryTabProps {
  mediaItem: MediaItem;
}

interface GalleryProps {
  media: MediaItem[];
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
            selected ? "ring-black" : "ring-transparent"
          )} />
        </div>
      )}
    </Tab>
  );
};

const Gallery = ({ media }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const nextMedia = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevMedia = () => {
    setSelectedIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  const handleZoom = (imageUrl: string) => {
    setZoomedImage(imageUrl);
    setIsZoomed(true);
    document.body.style.overflow = 'hidden';
  };

  const closeZoom = () => {
    setIsZoomed(false);
    setZoomedImage(null);
    document.body.style.overflow = 'unset';
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
              className="p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none pointer-events-auto"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextMedia}
              className="p-2 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none pointer-events-auto"
              style={{ touchAction: 'manipulation' }}
              type="button"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <TabList className="mx-auto mt-6 h-[95%] w-[95%] max-w-2xl lg:max-w-none">
          <div className="grid grid-cols-4 gap-6">
            {media.map((item) => (
              <GalleryTab key={item.id} mediaItem={item} />
            ))}
          </div>
        </TabList>
      </TabGroup>

      {isZoomed && zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center touch-none"
          onClick={closeZoom}
        >
<button
  onClick={(e) => {
    e.stopPropagation();
    closeZoom();
  }}
  onTouchEnd={(e) => {
    e.stopPropagation();
    closeZoom();
  }}
  className="fixed top-4 right-4 text-white p-4 hover:bg-white/10 rounded-full z-[60]"
  style={{ touchAction: 'manipulation' }}
>
<X size={24}  className='m-[30px] md:m-[10px] '/>
  
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
*/