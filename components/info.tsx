

"use client"
import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { Product, Size, Color } from "@/types";
import { Alert, AlertDescription } from '@/components/ui/alert';
import useCart from "@/hooks/use-cart";
import { useTranslations } from 'next-intl';

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState<string | null>(null);
    const cart = useCart();
    const t = useTranslations('product');

    const hasSizes = data.sizes.length > 0;
    const hasColors = data.colors.length > 0;


    const [showCashOrderModal, setShowCashOrderModal] = useState(false);


    // Get total available quantity across all variants
    const getTotalQuantity = (): number => {
        if (!hasSizes && !hasColors) {
            return data.quantity || 0;
        }

        return data.colorSizeQuantities.reduce((total, csq) => total + csq.quantity, 0);
    };

    // Get available quantity for current selection
    const getAvailableQuantity = (): number => {
        // Scenario 1: No colors, no sizes - just product quantity
        if (!hasSizes && !hasColors) {
            return data.quantity || 0;
        }

        // Scenario 2: Only colors
        if (!hasSizes && hasColors) {
            if (selectedColor) {
                const colorQuantity = data.colorSizeQuantities.find(
                    csq => csq.colorId === selectedColor.id && !csq.sizeId
                );
                return colorQuantity?.quantity || 0;
            }
            return data.colorSizeQuantities.reduce((total, csq) =>
                !csq.sizeId ? total + csq.quantity : total, 0);
        }

        // Scenario 3: Only sizes
        if (hasSizes && !hasColors) {
            if (selectedSize) {
                const sizeQuantity = data.colorSizeQuantities.find(
                    csq => csq.sizeId === selectedSize.id && !csq.colorId
                );
                return sizeQuantity?.quantity || 0;
            }
            return data.colorSizeQuantities.reduce((total, csq) =>
                !csq.colorId ? total + csq.quantity : total, 0);
        }

        // Scenario 4: Both colors and sizes
        if (selectedSize && selectedColor) {
            const colorSizeQuantity = data.colorSizeQuantities.find(
                csq => csq.colorId === selectedColor.id && csq.sizeId === selectedSize.id
            );
            return colorSizeQuantity?.quantity || 0;
        }

        return getTotalQuantity();
    };

    const handleAddToCart = () => {
        setMessage(null);
    
        if (hasSizes && !selectedSize) {
            setMessage(t('alerts.selectSize'));
            return;
        }
    
        if (hasColors && !selectedColor) {
            setMessage(t('alerts.selectColor'));
            return;
        }
    
        const availableQuantity = getAvailableQuantity();
        if (quantity > availableQuantity) {
            setMessage(t('alerts.limitedStock', { count: availableQuantity }));
            return;
        }
    
        cart.addItem(data, quantity, selectedSize || undefined, selectedColor || undefined);
        setMessage(t('alerts.addedToCart'));
    };
    


    // Helper function to check if product is completely out of stock
    const isCompletelyOutOfStock = (): boolean => {
        return getTotalQuantity() === 0;
    };

    // Rest of the component remains the same...
    const renderOptions = (options: Size[] | Color[], selectedOption: Size | Color | null, setOption: React.Dispatch<React.SetStateAction<Size | null>> | React.Dispatch<React.SetStateAction<Color | null>>, type: 'size' | 'color') => {
        if (options.length === 0) return null;

        return (
            <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2 dark:text-gray-200">
                    {type === 'size' ? t('chooseSize') : t('chooseColor')}
                </h3>
                <div className={`flex ${type === 'size' ? 'flex-wrap gap-2' : 'space-x-2'}`}>
                    {options.map((option) => {
                        const isAvailable = type === 'size'
                            ? !option.isOutOfStock && getQuantityForOption(option, type) > 0
                            : !option.isOutOfStock && getQuantityForOption(option, type) > 0;


                        return (
                            <button
                                key={option.id}
                                className={`transition-all duration-200 ease-in-out
                                    ${type === 'size'
                                        ? 'px-3 py-1 text-sm rounded-md'
                                        : 'w-8 h-8 rounded-full border-2'}
                                    ${selectedOption?.id === option.id
                                        ? (type === 'size' ? 'bg-pink-500 text-white' : 'border-black dark:border-white scale-110 shadow-md shadow-pink-500/50')
                                        : (type === 'size' ? 'bg-white dark:bg-gray-800 text-pink-500 dark:text-pink-400 border border-pink-500 dark:border-pink-400' : 'border-gray-300 dark:border-gray-600')}
                                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                `}
                                style={type === 'color' ? { backgroundColor: (option as Color).value } : {}}
                                onClick={() => {
                                    if (isAvailable) {
                                        setOption(option as any);
                                        setQuantity(1);
                                        setMessage(null);
                                    }
                                }}
                                disabled={!isAvailable}
                            >
                                {type === 'size' ? (option as Size).name : null}
                                {!isAvailable && type === 'color' && (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <div className="absolute w-[150%] h-0.5 bg-red-700 dark:bg-red-400 rotate-45"></div>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    const getQuantityForOption = (option: Size | Color, type: 'size' | 'color'): number => {
        if (type === 'size') {
            if (hasColors && selectedColor) {
                return data.colorSizeQuantities.find(
                    csq => csq.sizeId === option.id && csq.colorId === selectedColor.id
                )?.quantity || 0;
            }
            return data.colorSizeQuantities.filter(csq => csq.sizeId === option.id)
                .reduce((total, csq) => total + csq.quantity, 0);
        } else {
            if (hasSizes && selectedSize) {
                return data.colorSizeQuantities.find(
                    csq => csq.colorId === option.id && csq.sizeId === selectedSize.id
                )?.quantity || 0;
            }
            return data.colorSizeQuantities.filter(csq => csq.colorId === option.id)
                .reduce((total, csq) => total + csq.quantity, 0);
        }
    };

    const renderQuantityControl = () => {
        const availableQuantity = getAvailableQuantity();

        return (
            <div className="flex items-center space-x-2 mb-4">
                <h3 className="text-sm font-semibold dark:text-gray-200">
                    {t('quantity')}
                </h3>
                <div className="flex items-center space-x-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="focus:bg-pink-500 focus:text-white dark:border-gray-600 dark:text-gray-200"
                    >
                        <Minus size={16} />
                    </Button>
                    <span className="text-sm font-semibold mx-2 dark:text-gray-200">{quantity}</span>
                    <Button
                        className="focus:bg-pink-500 focus:text-white dark:border-gray-600 dark:text-gray-200"
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
                        disabled={quantity >= availableQuantity}
                    >
                        <Plus size={16} />
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-primary dark:text-gray-100">{data.name}</h1>
                <div className="mt-2">
                    <p className="text-xl text-gray-900 dark:text-gray-100">
                        <Currency value={data?.price} />
                    </p>
                </div>
            </div>

            <hr className="border-gray-300 dark:border-gray-700" />

            {renderOptions(data.colors, selectedColor, setSelectedColor, 'color')}
            {renderOptions(data.sizes, selectedSize, setSelectedSize, 'size')}
            {renderQuantityControl()}

            <div className="space-y-4">
                <div className="relative inline-block">
                    <Button
                        size="sm"
                        className="px-6 py-4 text-sm font-semibold text-white bg-pink-600 
    hover:bg-white hover:text-black 
    dark:hover:bg-gray-800 dark:hover:text-white 
    border border-pink-600 hover:border-black dark:hover:border-gray-600 
    dark:bg-pink-700 dark:border-pink-700
    transition-colors"
                        onClick={handleAddToCart}
                        disabled={isCompletelyOutOfStock()}
                    >
                        {t('addToCart')}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </Button>
                </div>

                {message && (
    <Alert 
        variant={message.includes(t('alerts.addedToCart')) ? "default" : "destructive"}
        className="dark:bg-gray-800 dark:border-gray-700"
    >
        <AlertDescription className="dark:text-gray-200">
            {message}
        </AlertDescription>
    </Alert>
)}


                <div className="text-xs text-gray-600 dark:text-gray-400">
                    {hasSizes && (
                        <p>{t('selectedSize')} {selectedSize?.name || t('none')}</p>
                    )}
                    {hasColors && (
                        <p>{t('selectedColor')} {selectedColor?.name || t('none')}</p>
                    )}
                    <p>{t('availableQuantity')} {getAvailableQuantity()}</p>
                </div>


                {data.description && (
                    <div className="mt-4">
                        <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">
                            {t('productDescription')}
                        </h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{data.description}</p>
                    </div>
                )}
            </div>


        </div>
    );
};

export default Info;