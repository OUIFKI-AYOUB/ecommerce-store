"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

const SortFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('filters');
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: "price-low", label: t('sortOptions.priceLowToHigh') },
    { value: "price-high", label: t('sortOptions.priceHighToLow') },
    { value: "date-old", label: t('sortOptions.dateOldToNew') },
    { value: "date-new", label: t('sortOptions.dateNewToOld') }
  ];

  const handleSort = (value: string) => {
    const current = qs.parse(searchParams.toString());
    
    const query = {
      ...current,
      sort: value,
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.replace(url, { scroll: false });
    setIsOpen(false);
  };

  const currentSort = searchParams.get("sort") || "";
  const currentLabel = sortOptions.find(option => option.value === currentSort)?.label || t('sortOptions.default');

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-sm md:text-base border rounded-md bg-white dark:bg-gray-800 dark:text-white min-w-[130px] md:min-w-[200px] flex justify-between items-center"
      >
        <span>{currentLabel}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <button
            onClick={() => handleSort("")}
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {t('sortOptions.default')}
          </button>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSort(option.value)}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortFilter;
