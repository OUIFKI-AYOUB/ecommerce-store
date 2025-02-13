'use client';

import { Billboard } from "@/types";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AutoSliderProps {
    billboards: Billboard[];
}

const AutoSlider: React.FC<AutoSliderProps> = ({ billboards }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => 
                prev === billboards.length - 1 ? 0 : prev + 1
            );
        }, 5000);

        return () => clearInterval(timer);
    }, [billboards.length]);

    return (
        <div className="relative w-full h-[500px] overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={billboards[currentIndex].imageUrl}
                        alt={billboards[currentIndex].label}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white font-bold text-4xl md:text-6xl max-w-[80%] text-center">
                            {billboards[currentIndex].label}
                        </h1>
                    </div>
                </motion.div>
            </AnimatePresence>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {billboards.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex ? 'bg-white w-4' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default AutoSlider;
