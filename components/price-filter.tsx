"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { Button } from "@/components/ui/button";
import { useTranslations } from 'next-intl';

const PriceFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const t = useTranslations('filters');

  const onSubmit = () => {
    const current = qs.parse(searchParams.toString());
    
    const query = {
      ...current,
      minPrice: minPrice || null,
      maxPrice: maxPrice || null
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipNull: true });

    router.replace(url, { scroll: false });
  };

  const resetPrice = () => {
    setMinPrice("");
    setMaxPrice("");
    
    const current = qs.parse(searchParams.toString());
    const query = {
      ...current,
      minPrice: null,
      maxPrice: null
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query
    }, { skipNull: true });

    router.replace(url, { scroll: false });
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold">{t('price')} (DH)</h3>
      <hr className="my-4" />
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder={t('priceRange.min')}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-24 p-2 border rounded"
          />
          <input
            type="number"
            placeholder={t('priceRange.max')}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-24 p-2 border rounded"
          />
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1 text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center" 
            onClick={onSubmit}
          >
            {t('priceRange.apply')}
          </Button>
          <Button 
            className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" 
            onClick={resetPrice}
          >
            {t('priceRange.reset')}
            </Button>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
