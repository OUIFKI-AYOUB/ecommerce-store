"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Currency from "@/components/ui/currency";
import { CartItem } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { TriangleAlert } from 'lucide-react';
import Image from "next/image";
import {  MediaType } from "@/types";

import { Copy } from 'lucide-react'; // Import the Copy icon
import copy from 'clipboard-copy'; // Import the clipboard-copy function

const BankTransferPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('codForm');
  const locale = useLocale();
  const router = useRouter();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    cityship: 'other',
    NumNom: '',
    Nomsentmoney: '',
    batiment: '',
    email: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    city: false,
    NumNom: false,
    Nomsentmoney: false,
  });

  const [shippingCost, setShippingCost] = useState(40);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0) + shippingCost;

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cityship = e.target.value;
    const cost = cityship === 'tanger' ? 20 : 40;
    setShippingCost(cost);
    setFormData(prev => ({ ...prev, cityship }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    // Check for required fields
    const errors = {
      fullName: !formData.fullName,
      phone: !formData.phone,
      address: !formData.address,
      city: !formData.city,
      NumNom: !formData.NumNom,
      Nomsentmoney: !formData.Nomsentmoney,
    };

    setValidationErrors(errors);

    if (Object.values(errors).some(error => error)) {
      toast.error(t('fillFields'));
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        productIds: items.map((item) => item.id),
        quantities: items.map((item) => item.quantity),
        prices: items.map((item) => item.price),
        colors: items.map((item) => item.selectedColor?.id),
        sizes: items.map((item) => item.selectedSize?.id),
        paymentMethod: 'BANK_TRANSFER',
        customerInfo: {
          ...formData,
          shippingCost,
        },
      });

      removeAll();
      router.push('/success-tr');
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, type: 'accountNumber' | 'iban' | 'NameAcc') => {
    copy(text);
    if (type === 'accountNumber') {
      toast.success(t('accountNumberCopied')); // Specific toast for account number
    } else if (type === 'iban') {
      toast.success(t('ibanCopied')); // Specific toast for IBAN
    } else if (type === 'NameAcc') {
      toast.success(t('NameAccCopied')); // Specific toast for NameAcc
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('virement')}</h2>

      <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50  dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Grid Container for Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">{t('fullName')} <span className="text-red-500">*</span></label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder={t('fullNamePlaceholder')}
                className={`w-full p-4 border ${
                  validationErrors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white`}
              />
              {validationErrors.fullName && (
                <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('phone')} <span className="text-red-500">*</span></label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder={t('phonePlaceholder')}
                className={`w-full p-4 border ${
                  validationErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white`}
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('city')} <span className="text-red-500">*</span></label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder={t('cityPlaceholder')}
                className={`w-full p-4 border ${
                  validationErrors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white`}
              />
              {validationErrors.city && (
                <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('deliveryCost')}  <span className="text-red-500">*</span></label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="other"
                    name="cityship"
                    value="other"
                    checked={formData.cityship === 'other'}
                    onChange={handleCityChange}
                    required
                    className="mr-2 rtl:ml-2 cursor-pointer"
                  />
                  <label htmlFor="other">{t('allCities')}</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="tanger"
                    name="cityship"
                    value="tanger"
                    checked={formData.cityship === 'tanger'}
                    onChange={handleCityChange}
                    required
                    className="mr-2 rtl:ml-2 cursor-pointer"
                  />
                  <label htmlFor="tanger">Tanger (20 DH)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block mb-2 font-medium">{t('address')} <span className="text-red-500">*</span></label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder={t('addressPlaceholder')}
                className={`w-full p-4 border ${
                  validationErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white`}
              />
              {validationErrors.address && (
                <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('NumNom')} <span className="text-red-500">*</span></label>
              <Input
                value={formData.NumNom}
                onChange={(e) => setFormData(prev => ({ ...prev, NumNom: e.target.value }))}
                placeholder={t('NumNomPlaceholder')}
                className={`w-full p-4 border ${
                  validationErrors.NumNom ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white`}
              />
              {validationErrors.NumNom && (
                <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('Batiment')}</label>
              <Input
                value={formData.batiment}
                onChange={(e) => setFormData(prev => ({ ...prev, batiment: e.target.value }))}
                placeholder={t('BatimentPlaceholder')}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('Email')}</label>
              <Input
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder={t('EmailPlaceholder')}
                className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">{t('Nomsentmoney')} <span className="text-red-500">*</span></label>
              <Input
                value={formData.Nomsentmoney}
                onChange={(e) => setFormData(prev => ({ ...prev, Nomsentmoney: e.target.value }))}
                placeholder={t('Nomsentmoney')}
                className={`w-full p-4 border ${
                  validationErrors.Nomsentmoney ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-400 dark:bg-gray-700 dark:text-white`}
              />
              {validationErrors.Nomsentmoney && (
                <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
              )}
            </div>
          </div>
        </div>



{/* Product Summary Section */}
<div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md md:max-w-[60%] md:mx-auto">
        <h3 className="text-xl font-semibold mb-4">{t('orderSummary')}</h3>
        {items.map((item) => {
          // Find the media item that matches the selected color
          const primaryImage = item.media && Array.isArray(item.media)
            ? item.media.find(m => m.type === MediaType.IMAGE && m.colorId === item.selectedColor?.id) || item.media[0]
            : null;

          // Fallback to first image from images array if media is not available
          const imageUrl = primaryImage?.url || (item as any).images?.[0]?.url;

          return (
            <div key={item.id} className="flex items-center justify-between py-3 border-b dark:border-gray-700">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
                    {item.selectedColor && `${t('color')}: ${item.selectedColor.name}`}
                    {item.selectedSize && ` • ${t('size')}: ${item.selectedSize.name}`}
                    <div>{t('quantity')}: {item.quantity}</div>
                  </div>
                </div>
              </div>
              <Currency value={Number(item.price) * item.quantity} />
            </div>
          );
        })}
      </div>

{/* Total Price Section */}
<div className="border-t pt-4 md:max-w-[60%] md:mx-auto">
  <div className="flex justify-between mb-2">
    <span>{t('subtotal')}:</span>
    <Currency value={totalPrice - shippingCost} />
  </div>
  <div className="flex justify-between mb-2">
    <span>{t('deliveryCost')}:</span>
    <Currency value={shippingCost} />
  </div>
  <div className="flex justify-between font-bold">
    <span>{t('total')}:</span>
    <Currency value={totalPrice} />
  </div>
</div>

{/* Bank Details Section */}
<div className="mt-6 p-6 bg-slate-200 border dark:bg-slate-700 rounded-lg shadow-md md:max-w-[60%] md:mx-auto">
  <h3 className="text-lg font-bold mb-4">{t('bankDetails')}</h3>
  <div className="mb-2 flex items-center">
  <strong>{t('accountHolder')}:</strong>John Doe
  <div className="relative group">
      <Copy 
        className="ml-2 rtl:mr-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" 
        size={20} 
        onClick={() => handleCopy('John Doe', 'NameAcc')}
      />
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
        Copy
      </span>
    </div>
    </div>


  <div className="mb-2 flex items-center">
    <strong>{t('accountNumber')} : </strong> 1234567890
    <div className="relative group">
      <Copy 
        className="ml-2 rtl:mr-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" 
        size={20} 
        onClick={() => handleCopy('1234567890', 'accountNumber')}
      />
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
        Copy
      </span>
    </div>
  </div>
  <div className="flex flex-wrap items-center">
  <strong>{t('iban')} : </strong> 
  <span className="break-all">MA1234567890123456789012</span>
      <div className="relative group">
      <Copy 
        className="ml-2 rtl:mr-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white" 
        size={20} 
        onClick={() => handleCopy('MA1234567890123456789012', 'iban')}
      />
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
        Copy
      </span>
    </div>
  </div>
  <div className="mt-4 flex items-center justify-center text-base bg-white border-2 dark:bg-gray-800">
    <strong>{t('acceptpay')}</strong>
    <TriangleAlert className="ml-2 rtl:mr-2 text-orange-500" />
  </div>
</div>


<div className="flex justify-center items-center md:max-w-[60%] md:mx-auto">

{/* Submit Button */}
<Button
  type="submit"
  className="w-full bg-black hover:bg-gray-600 dark:bg-white dark:hover:bg-gray-500 text-white dark:text-black font-semibold py-2 rounded-md transition-colors content-center
 md:max-w-[100%] md:mx-auto"
  disabled={isSubmitting}
>
  {isSubmitting ? t('processing') : t('sentorder')}
</Button>
</div>

      </form>
    </div>
  );
};

export default BankTransferPage;