"use client";

import { useState } from "react";
import { Filter as FilterIcon } from "lucide-react";
import Filter from "./filter";
import PriceFilter from "@/components/price-filter";
import { Size, Color } from "@/types";
import { useTranslations } from "next-intl";

interface DesktopFiltersProps {
  sizes: Size[];
  colors: Color[];
}

const DesktopFilters: React.FC<DesktopFiltersProps> = ({ sizes, colors }) => {
  const [showFilters, setShowFilters] = useState(false);
  const t = useTranslations('filters');

  return (
    <div className="hidden lg:block">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 mb-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <FilterIcon size={20} />
        <span className="font-medium">{t('button')}
        </span>
      </button>

      {showFilters && (
        <div className="space-y-4">
          <PriceFilter />
          {sizes.length > 0 && <Filter valueKey="sizeId" name={t('sizes')} data={sizes} />}
          {colors.length > 0 && <Filter valueKey="colorId" name={t('colors')} data={colors} />}
          </div>
      )}
    </div>
  );
};

export default DesktopFilters;
