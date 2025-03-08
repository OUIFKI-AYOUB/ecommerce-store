"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import useCart from "@/hooks/use-cart";
import toast from "react-hot-toast";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import FormCod from "./form-cod";
import { useTranslations, useLocale } from 'next-intl';
import { PayPalButtons, PayPalScriptProvider, FUNDING } from "@paypal/react-paypal-js";
import { paypalOptions } from "@/lib/paypal";
import { MediaType } from "@/types";

const Summary = () => {
    const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'COD' | 'PAYPAL' | 'BANK_TRANSFER'>('COD');
    const [showCodForm, setShowCodForm] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(40); // Default 
    const searchParams = useSearchParams();
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);
    const [isProcessing, setIsProcessing] = useState(false);
    const t = useTranslations('cart');
    const locale = useLocale();
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    
    const router = useRouter();
    useEffect(() => {
        const fetchExchangeRate = async () => {
            try {
                const response = await fetch('https://api.exchangerate-api.com/v4/latest/MAD');
                const data = await response.json();
                setExchangeRate(data.rates.USD);
            } catch (error) {
                console.error('Error fetching exchange rate:', error);
            }
        };

        // Fetch the exchange rate immediately when the component mounts
        fetchExchangeRate();

        // Set up an interval to fetch the exchange rate every 5 minutes (300000 milliseconds)
        const intervalId = setInterval(fetchExchangeRate, 300000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    const convertMADtoUSD = (madAmount: number) => {
        if (!exchangeRate) return '0.00';
        return (madAmount * exchangeRate).toFixed(2);
    };

    const handlePayPalApprove = async (data: any, actions: any) => {
        try {
            const order = await actions.order.capture();
            const payer = order.payer;
            const shippingAddress = order.purchase_units[0].shipping?.address;
            const billingAddress = order.purchase_units[0].payments?.captures[0]?.billing_details;

            const userInfo = {
                fullName: payer.name?.given_name + " " + payer.name?.surname,
                phone: payer.phone?.phone_number?.national_number,
                address: shippingAddress?.address_line_1,
                email: payer.email_address,
                city: shippingAddress?.admin_area_2,
                billingAddress: billingAddress?.address_line_1, // Add billing address
                shippingCost: deliveryFee, // Include shipping cost
            };

            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds: items.map((item) => item.id),
                quantities: items.map((item) => item.quantity),
                prices: items.map((item) => item.price),
                colors: items.map((item) => item.selectedColor?.id),
                sizes: items.map((item) => item.selectedSize?.id),
                paymentMethod: 'PAYPAL',
                customerInfo: userInfo,
            });

            if (response.data.success) {
                removeAll();
                window.location.href = '/payment-success';
            }
        } catch (error) {
            console.error('Error during PayPal approval:', error);
            toast.error(t('toasts.error'));
        }
    };

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

    const totalPrice = items.reduce((total, item) => {
        return total + Number(item.price) * item.quantity;
    }, 0);

    const totalItems = items.reduce((total, item) => {
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

        if (paymentMethod === 'BANK_TRANSFER') {
            router.push('/checkout');
            setIsProcessing(false);
            return;
        }

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
                productIds: items.map((item) => item.id),
                quantities: items.map((item) => item.quantity),
                prices: items.map((item) => item.price),
                colors: items.map((item) => item.selectedColor?.id),
                sizes: items.map((item) => item.selectedSize?.id),
                paymentMethod,
                customerInfo: {
                    shippingCost: deliveryFee, // Pass the selected shipping cost
                }
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
                    {items.map((item) => {
                        // Find the media item that matches the selected color
                        const primaryImage = item.media && Array.isArray(item.media)
                            ? item.media.find(m => m.type === MediaType.IMAGE && m.colorId === item.selectedColor?.id) || item.media[0]
                            : null;

                        // Fallback to first image from images array if media is not available
                        const imageUrl = primaryImage?.url || (item as any).images?.[0]?.url;

                        return (
                            <div key={item.id} className="flex items-center justify-between text-sm py-2">
                                <div className="flex items-center gap-4">
                                    {imageUrl && (
                                        <div className="relative w-16 h-16 rounded-md overflow-hidden">
                                            <Image
                                                fill
                                                src={imageUrl}
                                                alt={item.name}
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-medium">{item.name}</p>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {item.selectedColor && (
                                                <div>
                                                    {t('color')}: {item.selectedColor.name}
                                                </div>
                                            )}
                                            {item.selectedSize && (
                                                <div>
                                                    {t('size')}: {item.selectedSize.name}
                                                </div>
                                            )}
                                            <div>{t('quantity')}: {item.quantity}</div>
                                        </div>
                                    </div>
                                </div>
                                <Currency value={Number(item.price) * item.quantity} />
                            </div>
                        );
                    })}

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="text-base font-medium text-gray-900 dark:text-white">
                            {t('deliveryCost')}
                        </div>
                        <select
                            value={deliveryFee}
                            onChange={(e) => setDeliveryFee(Number(e.target.value))}
                            className="text-gray-900 dark:text-white font-medium border-collapse border border-gray-400 dark:border-gray-700 p-2 rounded-md"
                        >
                            <option value={40}>{t('allCities')}</option>
                            <option value={20}>Tanger - 20 DH</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="text-base font-medium text-gray-900 dark:text-white">
                            {t('orderTotal')}
                        </div>
                        <Currency value={totalPrice + deliveryFee} />
                    </div>
                </div>
                <div className="mt-6">
                    <label className="text-sm font-medium">{t('paymentMethod')}:</label>
                </div>

                <div className="paypal-button-container mt-8 mb-6 relative z-0" style={{ width: '100%', backgroundColor: 'transparent' }}>
                    <div className="text-sm text-gray-600">
                        {/*
                            <Currency value={totalPrice + deliveryFee} /> MAD
                            <span className="mx-2">≈</span>
                            ${convertMADtoUSD(totalPrice + deliveryFee)} USD
                        */}
                    </div>
                    <PayPalScriptProvider options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                        currency: "USD",
                        components: "buttons,hosted-fields"
                    }}>
                        <PayPalButtons
                            fundingSource={FUNDING.PAYPAL}
                            style={{
                                layout: "horizontal",
                                color: "gold", // Options: 'gold', 'blue', 'silver', 'white', 'black'
                                shape: "rect", // Options: 'rect', 'pill'
                                label: "pay",
                            }}
                            createOrder={(data, actions) => {
                                const usdAmount = convertMADtoUSD(totalPrice + deliveryFee);
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{
                                        amount: {
                                            value: usdAmount,
                                            currency_code: "USD"
                                        }
                                    }]
                                });
                            }}
                            onApprove={handlePayPalApprove}
                        />

                        <PayPalButtons
                            fundingSource={FUNDING.CARD}
                            style={{
                                layout: "horizontal",
                                shape: "rect",
                            }}
                            createOrder={(data, actions) => {
                                const usdAmount = convertMADtoUSD(totalPrice + deliveryFee);
                                return actions.order.create({
                                    intent: "CAPTURE",
                                    purchase_units: [{
                                        amount: {
                                            value: usdAmount,
                                            currency_code: "USD"
                                        }
                                    }]
                                });
                            }}
                            onApprove={handlePayPalApprove}
                        />
                    </PayPalScriptProvider>
                </div>

                <div className="mt-6 space-y-4 mb-4">
                    <div className="flex flex-col space-y-2">
                        <div className={`flex-wrap gap-4 ${locale === 'ar' ? 'space-x-reverse' : ''}`}>
                            <label className="flex items-center gap-2 mb-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-500 shadow-sm">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === 'COD'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'CARD' | 'COD' | 'BANK_TRANSFER')}
                                    className={`${locale === 'ar' ? 'ml-2' : 'mr-2'}`}
                                />
                                <img src="/images/buy.png" alt="Cash on Delivery" className="w-7 h-7" />
                                {t('cashOnDelivery')}
                            </label>

                            <label className="flex items-center gap-2 mb-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-500 shadow-sm">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CARD"
                                    checked={paymentMethod === 'CARD'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'CARD' | 'COD')}
                                    className={`${locale === 'ar' ? 'ml-2' : 'mr-2'}`}
                                />
                                <img src="/images/atm-card.png" alt="Cash on Delivery" className="w-7 h-7" />
                                {t('payWithCard')}
                            </label>

                            {/* Bank Transfer */}
                            <label className="flex items-center gap-2 mb-4 w- p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-300 dark:border-gray-500 shadow-sm">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="BANK_TRANSFER"
                                    checked={paymentMethod === 'BANK_TRANSFER'}
                                    onChange={(e) => setPaymentMethod(e.target.value as 'CARD' | 'COD' | 'BANK_TRANSFER')}
                                    className={`${locale === 'ar' ? 'ml-2' : 'mr-2'}`}
                                />
                                <img src="/images/transfer.png" alt="Cash on Delivery" className="w-7 h-7" />
                                {t('virement')}
                            </label>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onCheckout}
                    disabled={items.length === 0 || isProcessing}
                    className="w-full mt-6 hover:bg-black dark:hover:bg-white"
                >
                    {isProcessing
                        ? t('processing')
                        : items.length === 0
                            ? t('emptyCart')
                            : paymentMethod === 'COD'
                                ? t('placeOrder')
                                : paymentMethod === 'BANK_TRANSFER'
                                    ? t('virement')
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