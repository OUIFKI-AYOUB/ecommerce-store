"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Currency from "@/components/ui/currency";
import { CartItem } from "@/types";
import axios from "axios";
import toast from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import {  MediaType } from "@/types";

import { X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface FormCodProps {
  onClose: () => void;
  items: CartItem[];
}

const FormCod: React.FC<FormCodProps> = ({ onClose, items }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('codForm');
  const locale = useLocale();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    cityship: 'other',
    NumNom: '',
    batiment: '',
    email: '',
  });

  const [validationErrors, setValidationErrors] = useState({
    fullName: false,
    phone: false,
    address: false,
    city: false,
    NumNom: false,
  });

  const [shippingCost, setShippingCost] = useState(40);
  const removeAll = useCart((state) => state.removeAll);

  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0) + shippingCost;

  const finalTotal = totalPrice + shippingCost;

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
        paymentMethod: 'COD',
        customerInfo: {
          ...formData,
          shippingCost,
        },
      });

      removeAll();
      window.location.href = '/success';
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <button
        onClick={onClose}
        className={`absolute top-2 ${locale === 'ar' ? 'left-4' : 'right-4'} text-gray-900 hover:text-gray-700 dark:text-gray-900  bg-slate-200`}
      >
        <X size={26} />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">{t('title')}</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('fullName')} <span className="text-red-500">*</span></label>
          <Input
            value={formData.fullName}
            onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            placeholder={t('fullNamePlaceholder')}
            className={`w-full p-4 border ${
              validationErrors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white`}
          />
          {validationErrors.fullName && (
            <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('phone')} <span className="text-red-500">*</span></label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder={t('phonePlaceholder')}
            className={`w-full p-4 border ${
              validationErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white`}
          />
          {validationErrors.phone && (
            <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('city')} <span className="text-red-500">*</span></label>
          <Input
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            placeholder={t('cityPlaceholder')}
            className={`w-full p-4 border ${
              validationErrors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white`}
          />
          {validationErrors.city && (
            <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('deliveryCost')} <span className="text-red-500">*</span></label>
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
              <label htmlFor="other" className="text-gray-700 dark:text-gray-300">{t('allCities')}</label>
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
              <label htmlFor="tanger" className="text-gray-700 dark:text-gray-300">Tanger (20 DH)</label>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('address')} <span className="text-red-500">*</span></label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder={t('addressPlaceholder')}
            className={`w-full p-4 border ${
              validationErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white`}
          />
          {validationErrors.address && (
            <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('NumNom')} <span className="text-red-500">*</span></label>
          <Input
            value={formData.NumNom}
            onChange={(e) => setFormData(prev => ({ ...prev, NumNom: e.target.value }))}
            placeholder={t('NumNomPlaceholder')}
            className={`w-full p-4 border ${
              validationErrors.NumNom ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white`}
          />
          {validationErrors.NumNom && (
            <p className="text-red-500 text-sm mt-1">{t('fieldRequired')}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('Batiment')}</label>
          <Input
            value={formData.batiment}
            onChange={(e) => setFormData(prev => ({ ...prev, batiment: e.target.value }))}
            placeholder={t('BatimentPlaceholder')}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">{t('Email')}</label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder={t('EmailPlaceholder')}
            className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          />
        </div>

  {/* Add Product Summary Section */}
  <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
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

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">{t('subtotal')}:</span>
            <Currency value={totalPrice - shippingCost} />
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700 dark:text-gray-300">{t('deliveryCost')}:</span>
            <Currency value={shippingCost} />
          </div>
          <div className="flex justify-between font-bold">
            <span className="text-gray-800 dark:text-white">{t('total')}:</span>
            <Currency value={totalPrice} />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-600 dark:bg-white dark:hover:bg-gray-400 text-white dark:text-black font-semibold py-2 rounded-md transition-colors"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('processing') : t('confirmOrder')}
        </Button>
      </form>
    </div>
  );
};

export default FormCod;