"use client";

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
        <div className="aspect-square h-full w-full relative">
          {mediaItem.type === MediaType.IMAGE ? (
            <Image
              fill
              src={mediaItem.url}
              alt=""
              className="object-cover object-center"
            />
          ) : (
            <video
              className="h-full w-full object-cover"
              src={mediaItem.url}
              controls={false}
              muted
              playsInline
            />
          )}
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
  };

  const closeZoom = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setZoomedImage(null);
    setIsZoomed(false);
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
                      />
                      <button
                        onClick={() => handleZoom(item.url)}
                        className="absolute right-4 top-4 p-2 rounded-full bg-white/80 
                          sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
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
              className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none pointer-events-auto"
              type="button"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextMedia}
              className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none pointer-events-auto"
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
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={closeZoom} // Close zoom when clicking outside the image
        >
          <button
            onClick={closeZoom}
            className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full z-60"
          >
            <X size={24} />
          </button>
          <div
            className="relative w-[90vw] h-[90vh]"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
          >
            <Image
              src={zoomedImage}
              alt="Zoomed Image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
