import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";
import useCart from "@/hooks/use-cart";
import { Product, Size, Color, MediaType } from "@/types";
import Currency from "@/components/ui/currency";
import IconButton from "@/components/ui/icon-button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTranslations } from 'next-intl';

interface CartItemProps {
    data: Product & {
        quantity: number;
        selectedSize?: Size;
        selectedColor?: Color;
    }
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
    const cart = useCart();
    const [quantity, setQuantity] = useState(data.quantity);
    const [message, setMessage] = useState<string | null>(null);
    const t = useTranslations('cart');

    useEffect(() => {
        setQuantity(data.quantity);
    }, [data.quantity]);

    const hasNoVariants = data.sizes.length === 0 && data.colors.length === 0;

    const getAvailableQuantity = () => {
        if (!data.selectedSize && !data.selectedColor) {
            const hasVariants = data.sizes.length > 0 || data.colors.length > 0;

            if (!hasVariants) {
                return data.quantity;
            }

            const baseQuantity = data.colorSizeQuantities.find(
                csq => !csq.colorId && !csq.sizeId
            );
            return baseQuantity?.quantity ?? data.quantity;
        }

        if (data.selectedSize && data.selectedColor) {
            const colorSizeQuantity = data.colorSizeQuantities.find(
                csq => csq.colorId === data.selectedColor?.id && csq.sizeId === data.selectedSize?.id
            );
            return colorSizeQuantity?.quantity || 0;
        } else if (data.selectedSize) {
            const sizeQuantity = data.colorSizeQuantities.find(
                csq => csq.sizeId === data.selectedSize?.id && !csq.colorId
            );
            return sizeQuantity?.quantity || 0;
        } else if (data.selectedColor) {
            const colorQuantity = data.colorSizeQuantities.find(
                csq => csq.colorId === data.selectedColor?.id && !csq.sizeId
            );
            return colorQuantity?.quantity || 0;
        }
        return 0;
    };










    const increaseQuantity = () => {
        if (hasNoVariants) return;

        const maxQuantity = getAvailableQuantity();
        const newQuantity = quantity + 1;

        if (newQuantity <= maxQuantity) {
            setQuantity(newQuantity);
            cart.updateQuantity(data.id, newQuantity, data.selectedSize, data.selectedColor);
            setMessage(null);
        } else {
            setMessage(t('stockLimit', { count: maxQuantity }));
        }
    };

    const decreaseQuantity = () => {
        if (hasNoVariants) return;

        if (quantity > 1) {
            const newQuantity = quantity - 1;
            setQuantity(newQuantity);
            cart.updateQuantity(data.id, newQuantity, data.selectedSize, data.selectedColor);
            setMessage(null);
        }
    };

    const onRemove = () => {
        cart.removeItem(data.id, data.selectedSize, data.selectedColor);
    };

    // Find the first image from media array with fallback handling
    const primaryImage = data.media && Array.isArray(data.media)
        ? data.media.find(m => m.type === MediaType.IMAGE)
        : null;

    // Fallback to first image from images array if media is not available
    const imageUrl = primaryImage?.url || (data as any).images?.[0]?.url;

    return (
        <li className="flex py-6 border-b dark:border-gray-700">
            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={data.name}
                        className="h-full w-full object-cover object-center"
                        width={100}
                        height={100}
                    />
                ) : (
                    <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-500 text-sm">{t('noImage')}</span>
                    </div>
                )}
            </div>
            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex justify-between text-base font-medium text-gray-900 dark:text-gray-100">
                        <div>
                            <h3>{data.name}</h3>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {data.selectedSize && (
                                    <span className="mr-4">{t('size')}: {data.selectedSize.name}</span>
                                )}
                                {data.selectedColor && (
                                    <span className="flex items-center">
                                        {t('color')}: {data.selectedColor.name}
                                        <div
                                            className="ml-2 w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                                            style={{ backgroundColor: data.selectedColor.value }}
                                        />
                                    </span>
                                )}
                            </div>
                        </div>
                        <p className="ml-4"><Currency value={data.price} /></p>
                    </div>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex items-center">
                        {!hasNoVariants && (
                            <>
                                <IconButton
                                    onClick={decreaseQuantity}
                                    icon={<Minus size={20} className="text-gray-600 dark:text-gray-200" />}
                                    className="h-8 w-8 mr-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                />
                                <span className="mx-2 text-gray-600 dark:text-gray-300 text-lg">{quantity}</span>
                                <IconButton
                                    onClick={increaseQuantity}
                                    icon={<Plus size={20} className="text-gray-600 dark:text-gray-200" />}
                                    className="h-8 w-8 ml-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                                />
                            </>
                        )}
                        {hasNoVariants && (
                            <span className="mx-2 text-gray-600 dark:text-gray-300">{t('quantity')}: {quantity}</span>
                        )}
                        <p className="text-gray-500 dark:text-gray-400 ml-4">
                            {t('total')}: <Currency value={data.price * quantity} />
                        </p>
                    </div>
                    <div className="flex">
                        <IconButton
                            className="ml-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            onClick={onRemove}
                            icon={<Trash2 size={15} className="text-red-500 dark:text-red-400" />}
                        />

                    </div>
                </div>
                {message && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}
            </div>
        </li>
    );
};

export default CartItem;