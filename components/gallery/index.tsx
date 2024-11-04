"use client"

import React, { useState } from 'react';
import { Image as ImageType } from "@/types";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from "@/lib/utils";

interface GalleryProps {
    images: ImageType[]
}

const GalleryTab: React.FC<{ image: ImageType }> = ({ image }) => {
    return (
        <Tab className="relative flex aspect-square cursor-pointer items-center justify-center rounded-md bg-white">
            {({ selected }) => (
                <div className="aspect-square h-full w-full relative">
                    <Image
                        fill
                        src={image.url}
                        alt=""
                        className="object-cover object-center"
                    />
                    <span className={cn(
                        "absolute inset-0 rounded-md ring-2 ring-offset-2",
                        selected ? "ring-black" : "ring-transparent"
                    )} />
                </div>
            )}
        </Tab>
    );
};

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const nextImage = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <TabGroup as="div" className="flex flex-col" selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <div className="relative overflow-hidden">
                <TabPanels className="aspect-square w-full">
                    {images.map((image) => (
                        <TabPanel key={image.id} className="absolute top-0 left-0 h-full w-full">
                            <div className="aspect-square relative h-[95%] w-[95%] mx-auto sm:rounded-lg overflow-hidden">
                                <Image
                                    fill
                                    src={image.url}
                                    alt=""
                                    className="object-cover object-center"
                                />
                            </div>
                        </TabPanel>
                    ))}
                </TabPanels>
                <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button
                        onClick={prevImage}
                        className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={nextImage}
                        className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white focus:outline-none"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
            <TabList className="mx-auto mt-6 h-[95%] w-[95%] max-w-2xl lg:max-w-none">
                <div className="grid grid-cols-4 gap-6">
                    {images.map((image) => (
                        <GalleryTab key={image.id} image={image} />
                    ))}
                </div>
            </TabList>
        </TabGroup>
    );
}

export default Gallery;