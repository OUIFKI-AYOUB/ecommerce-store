"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog, DialogPanel } from "@headlessui/react";

import IconButton from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Color, Size } from "@/types";
import { useTranslations } from "next-intl";

import Filter from "./filter";
import PriceFilter from "@/components/price-filter";
import { Filter as FilterIcon } from "lucide-react";

interface MobileFiltersProps {
  sizes: Size[];
  colors: Color[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
  const [open, setOpen] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const t = useTranslations('filters');

  return (
    <>
    <Button 
  onClick={onOpen} 
  className="flex items-center gap-x-2 lg:hidden bg-white dark:bg-gray-800 text-black dark:text-white border dark:border-gray-700 hover:text-current
 "
>
{t('button')}
  <FilterIcon size={20} />
</Button>

      <Dialog
        open={open}
        as="div"
        className="relative z-50 lg:hidden"
        onClose={onClose}
      >
        {/* Background color and opacity */}
        <div className="fixed inset-0 bg-black dark:bg-gray-900 bg-opacity-25 dark:bg-opacity-50" />

        {/* Dialog position */}
        <div className="fixed inset-0 z-50 flex">
        <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-900 py-4 pb-6 shadow-xl">
        {/* Close button */}
            <div className="flex items-center justify-end px-4">
            <IconButton 
          icon={<X size={15} className="dark:text-gray-500" />} 
          onClick={onClose} 
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        />
            </div>

            <div className="p-4">
              <Filter valueKey="sizeId" name={t('sizes')} data={sizes} />
              <Filter valueKey="colorId" name={t('colors')} data={colors} />
              <PriceFilter />

            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default MobileFilters;