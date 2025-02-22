"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { ShoppingBag, Heart } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ModeToggle } from "./theme-toggle";
import useWishlist from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setIsMounted(true)
  }, []);

  const router = useRouter()
  const cart = useCart()
  const wishlist = useWishlist();

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex items-center justify-end gap-x-4 ml-auto">
      <div 
        onClick={() => router.push("/wishlist")} 
        className={cn(
          "relative cursor-pointer transition-colors duration-200 lg:flex hidden",
          pathname.includes('/wishlist') 
            ? "text-pink-600 dark:text-pink-500" 
            : "text-black dark:text-white hover:text-pink-600 dark:hover:text-pink-500"
        )}
      >
        <Heart />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {wishlist.items.length}
        </span>
      </div>

      <div 
        onClick={() => router.push('/cart')} 
        className={cn(
          "relative cursor-pointer transition-colors duration-200",
          pathname.includes('/cart') 
            ? "text-pink-600 dark:text-pink-500" 
            : "text-black dark:text-white hover:text-pink-600 dark:hover:text-pink-500"
        )}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
          />
        </svg>
        <span className="absolute -top-2 -right-2 bg-black dark:bg-gray-100 text-white dark:text-gray-900 rounded-full w-4 h-4 flex items-center justify-center text-xs">
          {cart.items.length}
        </span>
      </div>

      <ModeToggle />
    </div>
  );
}

export default NavbarActions;
