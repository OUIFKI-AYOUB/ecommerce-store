"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Category } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import MobileSearch from "./mobile-search";
import useWishlist from "@/hooks/use-wishlist";
import { Heart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface MobileNavProps {
  data: Category[];
}

const MobileNav: React.FC<MobileNavProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations('mobile-nav');
  const wishlist = useWishlist();
  const pathname = usePathname();


  const mainRoutes = [
    {
      id: 'home',
      name: t('Home'),
      path: '/'
    },
    {
      id: 'all-products',
      name: t('AllProducts'),
      path: '/all-products'
    },
    {
      id: 'new-arrivals',
      name: t('NewArrivals'),
      path: '/new-arrivals'
    },
  
  ];
  

  const onNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div 
       className={cn(
        "fixed top-0 h-full w-[280px] bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-300 ease-in-out z-50 overflow-auto",
        isOpen ? "translate-x-0" : "translate-x-full",
        "rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto", // Dynamic positioning for RTL and LTR
        !isOpen && "rtl:translate-x-full ltr:-translate-x-full" // Dynamic transform for RTL and LTR
      )}
      >
        <div className="flex flex-col p-4">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-4">
          <MobileSearch onSearch={() => setIsOpen(false)} />
          </div>
          <div 
            onClick={() => {
              router.push("/wishlist");
              setIsOpen(false); 
            }}   
            
            className={cn(
          "relative cursor-pointer transition-colors duration-200",
          pathname.includes('/wishlist') 
            ? "text-pink-600 dark:text-pink-500" 
            : "text-black dark:text-white hover:text-pink-600 dark:hover:text-pink-500"
        )}
      >
        <Heart className="ml-4 rtl:mr-4"/>
        <span className="absolute -top-2 left-[30px] rtl:-top-2 rtl:right-[9px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {wishlist.items.length}
        </span>
      </div>
          {/* Main Routes */}
          {mainRoutes.map((route) => (
            <div
              key={route.id}
              className="py-3 px-4 text-sm font-medium hover:bg-pink-600 dark:hover:bg-pink-600 rounded-lg cursor-pointer transition-colors"
              onClick={() => onNavigate(route.path)}
            >
              {route.name}
            </div>
          ))}

          {/* Divider */}
          <div className="my-4 border-t dark:border-gray-700" />

          {/* Categories */}
          {data.map((category) => (
            <div
              key={category.id}
              className="py-3 px-4 text-sm font-medium hover:bg-pink-600 dark:hover:bg-pink-600 rounded-lg cursor-pointer transition-colors"
              onClick={() => onNavigate(`/category/${category.id}`)}
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
