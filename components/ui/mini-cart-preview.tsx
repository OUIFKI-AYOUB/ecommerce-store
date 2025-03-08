"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Currency from '@/components/ui/currency';
import { Button } from '@/components/ui/button';
import { Product, MediaType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MiniCartPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

const MiniCartPreview = ({ isOpen, onClose, product, quantity }: MiniCartPreviewProps) => {
  const router = useRouter();
  
  // Find media matching the selected color ID, fallback to first media
  const primaryImage = product.media?.find(m => 
    m.type === MediaType.IMAGE && m.colorId === product.selectedColor?.id
  )?.url || product.media?.find(m => m.type === MediaType.IMAGE)?.url;

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-32 max-sm:right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-64"
        >
          <div className="flex items-center gap-4">
            {primaryImage && (
              <div className="relative w-20 h-20 rounded-md overflow-hidden">
                <Image
                  fill
                  src={primaryImage}
                  alt={product.name}
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-sm dark:text-white">{product.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Quantity: {quantity}
              </p>
              <Currency value={product.price * quantity} />
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button 
              onClick={() => router.push('/cart')}
              className="flex-1 bg-white text-black hover:text-white"
              variant="outline"
            >
              View Cart
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniCartPreview;