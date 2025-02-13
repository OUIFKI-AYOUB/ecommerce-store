"use client";

import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { useTranslations } from 'next-intl';



const SortFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('filters');


  const sortOptions = [
    { value: "price-low", label: t('sortOptions.priceLowToHigh') },
    { value: "price-high", label: t('sortOptions.priceHighToLow') },
    { value: "date-old", label: t('sortOptions.dateOldToNew') },
    { value: "date-new", label: t('sortOptions.dateNewToOld') }
  ];
  
  
  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const current = qs.parse(searchParams.toString());
    
    const query = {
      ...current,
      sort: event.target.value,
    };

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true });

    router.replace(url, { scroll: false });
  };

  return (
    <div className="flex items-center">
      <select 
        className="p-2 text-sm md:text-base md:p-2 border rounded-md bg-white dark:bg-gray-800 dark:text-white max-w-[130px] md:max-w-full"
        onChange={onChange}
        defaultValue={searchParams.get("sort") || ""}
      >
        <option value="">{t('sortOptions.default')}</option>
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortFilter;
