"use client"

import axios from "axios";
import { useEffect } from "react";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";

const Summary = () => {
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);

    useEffect(() => {
        const success = searchParams.get("success");
        const canceled = searchParams.get("canceled");
        
        let timeoutId: NodeJS.Timeout;
    
        if (success) {
            timeoutId = setTimeout(() => {
                toast.success("Payment completed successfully");
                removeAll();
            }, 0);
        }
    
        if (canceled) {
            timeoutId = setTimeout(() => {
                toast.error("Payment canceled");
            }, 0);
        }
    
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [searchParams, removeAll]);

    const sortedItems = [...items].sort((a, b) => a.name.localeCompare(b.name));

    const totalPrice = sortedItems.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0);

    const totalItems = sortedItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    const onCheckout = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds: sortedItems.map((item) => item.id),
                quantities: sortedItems.map((item) => item.quantity),
                prices: sortedItems.map((item) => item.price),
                colors: sortedItems.map((item) => item.selectedColor?.id),
                sizes: sortedItems.map((item) => item.selectedSize?.id)
            });
            window.location = response.data.url;
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
            <h2 className="text-lg font-medium text-gray-900">
                Order Summary
            </h2>
            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Number of items
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </div>
                </div>
                
                {sortedItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="text-gray-600">
                            {item.name}
                            {item.selectedColor && ` - ${item.selectedColor.name}`}
                            {item.selectedSize && ` - ${item.selectedSize.name}`}
                            {` (x${item.quantity})`}
                        </div>
                        <div className="text-gray-900">
                            <Currency value={Number(item.price) * item.quantity} />
                        </div>
                    </div>
                ))}

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className="text-base font-medium text-gray-900">
                        Order Total
                    </div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            
            <Button 
                onClick={onCheckout} 
                disabled={items.length === 0}
                className="w-full mt-6"
            >
                {items.length === 0 ? 'No items in cart' : 'Checkout'}
            </Button>
        </div>
    );
};

export default Summary;
