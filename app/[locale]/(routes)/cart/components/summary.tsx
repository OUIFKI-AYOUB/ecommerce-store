"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import FormCod from "./form-cod";
import { useTranslations } from 'next-intl';

const Summary = () => {
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'COD'>('COD');
    const [showCodForm, setShowCodForm] = useState(false);
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);
    const [isProcessing, setIsProcessing] = useState(false);
    const t = useTranslations('cart');

    useEffect(() => {
        const success = searchParams.get("success");
        const canceled = searchParams.get("canceled");
        let timeoutId: NodeJS.Timeout;

        if (success) {
            removeAll();
            window.location.href = '/payment-success';
        }

        if (canceled) {
            timeoutId = setTimeout(() => {
                toast.error(t('toasts.paymentCanceled'));
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
        if (isProcessing) return;
        setIsProcessing(true);

        if (paymentMethod === 'COD') {
            setShowCodForm(true);
            setIsProcessing(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds: sortedItems.map((item) => item.id),
                quantities: sortedItems.map((item) => item.quantity),
                prices: sortedItems.map((item) => item.price),
                colors: sortedItems.map((item) => item.selectedColor?.id),
                sizes: sortedItems.map((item) => item.selectedSize?.id),
                paymentMethod
            });
            window.location = response.data.url;
        } catch (error) {
            toast.error(t('toasts.error'));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            <div className="mt-16 rounded-lg bg-gray-50 dark:bg-gray-800 px-4 py-6 sm:p-6 lg:p-8 lg:mt-0 lg:col-span-5">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('orderSummary')}

                </h2>
                <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {t('numberOfItems')}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {totalItems} {totalItems === 1 ? t('item') : t('items')}
                        </div>
                    </div>

                    {sortedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-sm py-2">
                            <div className="flex items-center gap-4">
                                {item.media && item.media[0] && (
                                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                        <Image
                                            fill
                                            src={item.media[0].url}
                                            alt={item.name}
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex flex-col">
                                    <span className="text-gray-900 dark:text-white font-medium">{item.name}</span>
                                    <div className="text-gray-600 dark:text-gray-300 text-xs">
                                        {item.selectedColor && `${t('color')}: ${item.selectedColor.name}`}
                                        {item.selectedSize && ` • ${t('size')}: ${item.selectedSize.name}`}
                                        <div>{t('quantity')}: {item.quantity}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-gray-900 dark:text-white font-medium">
                                <Currency value={Number(item.price) * item.quantity} />
                            </div>
                        </div>
                    ))}

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="text-base font-medium text-gray-900 dark:text-white">
                            {t('orderTotal')}
                        </div>
                        <Currency value={totalPrice} />
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex flex-col space-y-2">
                        <label className="text-sm font-medium">{t('paymentMethod')}:</label>
                        <div className="flex space-x-4">

                        <label className="flex items-center gap-2 mb-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'CARD' | 'COD')}
                                    className="mr-2"
                                />
                                {t('cashOnDelivery')}
                            </label>

                            <label className="flex items-center gap-2 mb-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CARD"
                                    checked={paymentMethod === 'CARD'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'CARD' | 'COD')}
                                    className="mr-2"
                                />
                                {t('payWithCard')}
                            </label>


                        </div>
                    </div>
                </div>

                <Button
                    onClick={onCheckout}
                    disabled={items.length === 0 || isProcessing}
                    className="w-full mt-6"
                >
                    {isProcessing
                        ? t('processing')
                        : items.length === 0
                            ? t('emptyCart')
                            : paymentMethod === 'COD'
                                ? t('placeOrder')
                                : t('checkoutCard')}
                </Button>
            </div>

            {showCodForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <FormCod onClose={() => setShowCodForm(false)} items={items} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Summary;
