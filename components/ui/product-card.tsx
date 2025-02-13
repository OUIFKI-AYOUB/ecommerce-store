"use client";

import { FavoriteBorderOutlined, Favorite, ShoppingCartOutlined } from '@mui/icons-material';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product, MediaType } from "@/types";
import { Expand, ShoppingCart } from "lucide-react";
import Currency from "@/components/ui/currency";
import { MouseEventHandler } from "react";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";
import useWishlist from "@/hooks/use-wishlist";
import { useTranslations } from 'next-intl';

interface ProductCardProps {
  data: Product;
}

interface IconButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon: React.ReactElement;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon }) => (
  <button
    onClick={onClick}
    className="rounded-full flex items-center justify-center bg-white p-2 hover:scale-110 transition"
  >
    {icon}
  </button>
);

const ProductCard: React.FC<ProductCardProps> = ({ data }) => {
  const cart = useCart();
  const previewModal = usePreviewModal();
  const router = useRouter();
  const wishlist = useWishlist();
  const t = useTranslations('product-card');

  // Get the first media item that's an image
  const firstImage = data?.media?.find(item => item.type === MediaType.IMAGE);

  const isOutOfStock = (): boolean => {
    // For products with both colors and sizes or single variants
    // Return false to always show in frontend
    return false;
  };
  
  
  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    previewModal.onOpen(data);
  };



  const isInWishlist = wishlist.items.some((item) => item.id === data.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist) {
      wishlist.removeItem(data.id);
    } else {
      wishlist.addItem(data);
    }
  };

  return (
<div 
  onClick={handleClick} 
  className="bg-white dark:bg-gray-800 group cursor-pointer rounded-xl border dark:border-gray-700 p-3 space-y-4 transition-colors duration-300 hover:bg-pink-300 dark:hover:bg-indigo-500"
>      
  <div className="aspect-square rounded-xl bg-gray-100 dark:bg-gray-900 relative">
    {/* Wishlist button - Moved to top level of image container */}
    <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition   ">
    <div className='absolute top-0 left-0 z-10'>
      <button
        onClick={toggleWishlist}
        className="rounded-full bg-white dark:bg-gray-800 flex justify-center items-center m-[4px] md:m-[6px] transition-all duration-500 hover:bg-pink-300 hover:scale-110 w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
      >
        {isInWishlist ? (
          <Favorite className="text-red-500 text-[14px] md:text-[18px]" />
        ) : (
          <FavoriteBorderOutlined className="text-gray-600 dark:text-gray-300 text-[16px] md:text-[20px]" />
        )}
      </button>
    </div>
    </div>
       
       
        {firstImage ? (
          <Image
            src={firstImage.url}
            alt={data.name}
            fill
            className="aspect-square object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {t('noImage')}
          </div>
        )}
        <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition absolute w-full px-2 md:px-6 bottom-2 md:bottom-5">
          <div className="flex gap-x-2 md:gap-x-6 justify-center">


            <button
              onClick={onPreview}
              className="rounded-full bg-white dark:bg-gray-800 flex justify-center items-center m-[4px] md:m-[6px] transition-all duration-500 hover:bg-pink-300 hover:scale-110 w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
            >
              <Expand size={16} className="text-gray-600 dark:text-gray-300 md:text-[20px]" />
            </button>


        
          </div>
        </div>

      </div>
      {/* Description */}
      <div>
        <p className="font-semibold text-lg dark:text-gray-100">{data.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-300">{data.categories[0]?.name}</p>
      </div>

      {/* Price & Stock */}
      <div className="flex items-center justify-between">
  <Currency value={data.price} />
  {data.colors.length > 0 || data.sizes.length > 0 ? (
    <span className={`text-sm font-semibold ${
      data.colorSizeQuantities?.some(variant => variant.quantity > 0)
        ? 'text-green-500'
        : 'text-red-500'
    }`}>
      {data.colorSizeQuantities?.some(variant => variant.quantity > 0)
        ?  t('inStock')
        :  t('outOfStock')}
    </span>
  ) : (
    <span className={`text-sm font-semibold ${
      (data.quantity ?? 0) > 0 ? 'text-green-500' : 'text-red-500'
    }`}>
      {(data.quantity ?? 0) > 0 ? t('inStock') : t('outOfStock')}
    </span>
  )}
</div>

    </div>
  );
};


export default ProductCard;