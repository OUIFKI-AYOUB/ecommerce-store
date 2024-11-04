

"use client"
import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { Product, Size, Color } from "@/types";
import { Alert, AlertDescription } from '@/components/ui/alert';
import useCart from "@/hooks/use-cart";

interface InfoProps {
    data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [selectedColor, setSelectedColor] = useState<Color | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [message, setMessage] = useState<string | null>(null);
    const cart = useCart();

    const hasSizes = data.sizes.length > 0;
    const hasColors = data.colors.length > 0;

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
        // Clear any existing messages
        setMessage(null);

        // Check if product requires size selection
        if (hasSizes && !selectedSize) {
            setMessage("Please select a size before adding to cart");
            return;
        }

        // Check if product requires color selection
        if (hasColors && !selectedColor) {
            setMessage("Please select a color before adding to cart");
            return;
        }

        // Check if selected quantity is available
        const availableQuantity = getAvailableQuantity();
        if (quantity > availableQuantity) {
            setMessage(`Only ${availableQuantity} items available`);
            return;
        }

        // Add to cart if all checks pass
        cart.addItem(data, quantity, selectedSize || undefined, selectedColor || undefined);
        setMessage("Item added to cart successfully!");
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
                <h3 className="text-sm font-semibold mb-2">Choose a {type === 'size' ? 'Size' : 'Color'}</h3>
                <div className={`flex ${type === 'size' ? 'flex-wrap gap-2' : 'space-x-2'}`}>
                    {options.map((option) => {
                        const isAvailable = type === 'size'
                            ? !option.isOutOfStock && getQuantityForOption(option, type) > 0
                            : !option.isOutOfStock && getQuantityForOption(option, type) > 0;

                        return (
                            <button
                                key={option.id}
                                className={`
                                    ${type === 'size'
                                        ? 'px-3 py-1 text-sm rounded-md'
                                        : 'w-8 h-8 rounded-full border-2'}
                                    ${selectedOption?.id === option.id
                                        ? (type === 'size' ? 'bg-pink-500 text-white' : 'border-black')
                                        : (type === 'size' ? 'bg-white text-pink-500 border border-pink-500' : 'border-gray-300')}
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
                                        <div className="absolute w-[150%] h-0.5 bg-red-700 rotate-45"></div>
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
                <h3 className="text-sm font-semibold">Quantity:</h3>
                <div className="flex items-center space-x-1">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="focus:bg-pink-500 focus:text-white"
                    >
                        <Minus size={16} />
                    </Button>
                    <span className="text-sm font-semibold mx-2">{quantity}</span>
                    <Button
                        className="focus:bg-pink-500 focus:text-white"
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
                <h1 className="text-2xl font-bold text-primary">{data.name}</h1>
                <div className="mt-2">
                    <p className="text-xl text-gray-900">
                        <Currency value={data?.price} />
                    </p>
                </div>
            </div>

            <hr className="border-gray-300" />

            {renderOptions(data.colors, selectedColor, setSelectedColor, 'color')}
            {renderOptions(data.sizes, selectedSize, setSelectedSize, 'size')}
            {renderQuantityControl()}

            <div className="space-y-4">
                <div className="relative inline-block">
                    <Button
                        size="sm"
                        className="px-6 py-4 text-sm font-semibold text-white bg-black hover:bg-gray-800"
                        onClick={handleAddToCart}
                        disabled={isCompletelyOutOfStock()}
                    >
                        Add To Cart
                        <ShoppingCart size={16} className="ml-2" />
                    </Button>
                    <span className="absolute -top-2 -right-2 h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500"></span>
                    </span>
                </div>

                {message && (
                    <Alert variant={message.includes("successfully") ? "default" : "destructive"}>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                <div className="text-xs text-gray-600">
                    {hasSizes && <p>Selected Size: {selectedSize?.name || 'None'}</p>}
                    {hasColors && <p>Selected Color: {selectedColor?.name || 'None'}</p>}
                    <p>Available Quantity: {getAvailableQuantity()}</p>
                </div>

                <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">Product Description</h2>
                    <p className="text-sm text-gray-700 leading-relaxed">{data.description}</p>
                </div>
            </div>
        </div>
    );
};

export default Info;