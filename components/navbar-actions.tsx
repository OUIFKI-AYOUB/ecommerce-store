"use client";

import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NavbarActions = () => {

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const router = useRouter()
  const cart =useCart()

  if (!isMounted) {
    return null
  }

    return ( 
        <div className="mx-auto flex items-center gap-x-4">
            <Button onClick ={ ()=> router.push('/cart')} className="ml-auto flex items-center rounded-full bg-black px-4 py-2 text-white absolute inset-y-0 right-0 w-16">
                <ShoppingBag 
                size={25}
                color="white"/>
                <span className="ml-2 text-sm font-medium text-white">
                  {cart.items.length}

                </span>

            </Button>
        </div>
     );
}
 
export default NavbarActions;