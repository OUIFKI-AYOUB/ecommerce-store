"use client"

import { cn } from "@/lib/utils";
import { Media, MediaType } from "@/types";
import { Tab } from "@headlessui/react";
import Image from "next/image";

interface GalleryTabProps {
    mediaItem: Media
}

const GalleryTab: React.FC<GalleryTabProps> = ({
    mediaItem
}) => {
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
}

export default GalleryTab;
