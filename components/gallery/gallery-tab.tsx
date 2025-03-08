"use client"

import { cn } from "@/lib/utils";
import { Media, MediaType } from "@/types";
import { Tab } from "@headlessui/react";
import Image from "next/image";

interface GalleryTabProps {
    mediaItem: Media,
    isHighlighted?: boolean;

}

interface GalleryTabProps {
    mediaItem: Media;
    isHighlighted?: boolean;
  }
  
  const GalleryTab = ({ mediaItem, isHighlighted }: GalleryTabProps) => {
    return (
      <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white">
        {({ selected }) => (
          <div>
            <span className="absolute h-full w-full aspect-square inset-0 overflow-hidden rounded-md">
              <Image
                fill
                src={mediaItem.url}
                alt=""
                className={cn(
                  "object-cover object-center transition-all duration-200",
                  isHighlighted && "ring-2 ring-pink-500 scale-105"
                )}
              />
            </span>
            <span className={cn(
              "absolute inset-0 rounded-md ring-2 ring-offset-2",
              selected ? "ring-black dark:ring-pink-600" : "ring-transparent",
              "hover:ring-gray-300"
            )} />
          </div>
        )}
      </Tab>
    );
  };
  
export default GalleryTab;
