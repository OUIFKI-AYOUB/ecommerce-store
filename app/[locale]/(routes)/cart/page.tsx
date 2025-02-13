"use client"


import Container from "@/components/ui/container";
import useCart from "@/hooks/use-cart";
import { useEffect, useState } from "react";
import CartItem from "./components/cart-item";
import Summary from "./components/summary";
import { useTranslations } from 'next-intl';




const CartPage = () => {


  const [isMounted, setIsMounted] = useState(false)
  const cart = useCart()
  const t = useTranslations('cart');

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null



  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {t('title')}
          </h1>
          <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
            <div className="lg:col-span-7">
              {cart.items.length === 0 && (
                <p className="text-neutral-600 dark:text-neutral-400">
                  {t('noItems')}
                </p>
              )}
              <ul>
                {cart.items.map((item) => (
                  <CartItem
                    key={item.id}
                    data={item}
                  />
                ))}
              </ul>
            </div>
            <Summary />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CartPage;