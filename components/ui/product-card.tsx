"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { Expand, ShoppingCart } from "lucide-react";
import Currency from "@/components/ui/currency";
import { MouseEventHandler } from "react";
import usePreviewModal from "@/hooks/use-preview-modal";
import useCart from "@/hooks/use-cart";

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

  const isOutOfStock = (): boolean => {
    if (data.isCompletelyOutOfStock) return true;

    // Check if the product has any quantity variants
    if (data.colorSizeQuantities.length > 0) {
      // If there are specific quantity variants, check if any are in stock
      return data.colorSizeQuantities.every(variant => variant.quantity === 0);
    }

    // Fall back to the main product quantity
    return data.quantity === 0;
  };

  const handleClick = () => {
    router.push(`/product/${data?.id}`);
  };

  const onPreview: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    previewModal.onOpen(data);
  };

  const onNavigateToProduct: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    router.push(`/product/${data?.id}`);
  };

  return (
    <div onClick={handleClick} className="bg-white group cursor-pointer rounded-xl border p-3 space-y-4">
      {/* Image and actions */}
      <div className="aspect-square rounded-xl bg-gray-100 relative">
        <Image
          src={data?.images?.[0]?.url}
          alt={data.name}
          fill
          className="aspect-square object-cover rounded-md"
        />
        <div className="md:opacity-0 md:group-hover:opacity-100 transition absolute w-full px-6 bottom-5">
          <div className="flex gap-x-6 justify-center">
            <IconButton
              onClick={onNavigateToProduct}
              icon={<ShoppingCart size={20} className="text-gray-600" />}
            />
            <IconButton
              onClick={onPreview}
              icon={<Expand size={20} className="text-gray-600" />}
            />
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <p className="font-semibold text-lg">{data.name}</p>
        <p className="text-sm text-gray-500">{data.categories[0]?.name}</p>
      </div>

      {/* Price & Stock */}
      <div className="flex items-center justify-between">
        <Currency value={data.price} />
        {isOutOfStock() ? (
          <span className="text-red-500 text-sm font-semibold">Out of Stock</span>
        ) : (
          <span className="text-green-500 text-sm font-semibold">In Stock</span>
        )}
      </div>
    </div>
  );
};

export default ProductCard;