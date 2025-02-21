"use client"

import Image from "next/image";
import { X } from "lucide-react";
import { MouseEventHandler } from "react";
import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useWishlist from "@/hooks/use-wishlist";
import { Product, MediaType } from "@/types";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

interface CartItemProps {
  data: Product;
}

const WishlistItem: React.FC<CartItemProps> = ({ data }) => {
  const wishlist = useWishlist();
  const router = useRouter();
  const t = useTranslations('wishlist');

  const firstImage = data?.media?.find(item => item.type === MediaType.IMAGE);

  const onRemove = () => {
    wishlist.removeItem(data.id);
  };

  const onNavigateToProduct: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    router.push(`/product/${data?.id}`);
  };

  return (
    <li className="flex py-6 border-b">
      <div className="relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
        {firstImage ? (
          <Image
            fill
            src={firstImage.url}
            alt={data.name}
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
           {t('noImage')}
          </div>
        )}
      </div>
      <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
        <div className="flex justify-between items-start">
          <div className="flex-1 rtl:mr-4">
            <p className="text-lg font-semibold text-primary ">{data.name}</p>
            <Currency value={data.price} />
          </div>
          
          <div className="flex gap-6 ">
            <button 
              onClick={onNavigateToProduct}
              className="rounded-full bg-gray-800 dark:bg-white flex justify-center items-center transition-all duration-500 hover:bg-pink-500 dark:hover:bg-pink-500 hover:scale-110 w-10 h-10"
            >
              <ShoppingCart size={20} className=" text-zinc-100 dark:text-gray-600" />
            </button>
            
            <IconButton
              className="bg-background hover:bg-secondary shadow-sm shadow-secondary"
              onClick={onRemove}
              icon={<X size={15} className="text-primary" />}
            />
          </div>
        </div>
      </div>
    </li>
  );
};

export default WishlistItem;
