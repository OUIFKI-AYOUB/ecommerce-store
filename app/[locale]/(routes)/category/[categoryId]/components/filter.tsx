"use client";

import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Color, Size } from "@/types";
import { useTranslations } from "next-intl";

interface FilterProps {
  data: (Size | Color)[];
  name: string;
  valueKey: string;
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations('filters');

  const selectedValue = searchParams.get(valueKey);

  const onClick = (id: string) => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: id,
    };

    if (current[valueKey] === id) {
      query[valueKey] = null;
    }

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.replace(url, { scroll: false });
  };

  const resetFilter = () => {
    const current = qs.parse(searchParams.toString());

    const query = {
      ...current,
      [valueKey]: null,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipNull: true }
    );

    router.replace(url, { scroll: false });
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{name}</h3>
        {selectedValue && (
          <Button
            className="text-sm text-gray-600 bg-slate-50 hover:text-gray-900 border-spacing-1 hover:bg-slate-100"
            onClick={resetFilter}
          >
            {t('priceRange.reset')}
          </Button>
        )}
      </div>
      <hr className="my-4" />
      <div className="flex flex-wrap gap-2">
        {data.map((filter) => (
          <div key={filter.id} className="flex items-center">
            <Button
              className={cn(
                "rounded-md text-sm text-primary p-2 bg-background border border-gray-700 hover:bg-background hover:text-primary",
                selectedValue === filter.id && "bg-pink-500 text-white hover:bg-pink-500 hover:text-white"
              )}
              onClick={() => onClick(filter.id)}
            >
              {filter.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;