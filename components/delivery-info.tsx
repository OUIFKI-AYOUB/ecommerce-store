"use client";

import { motion } from "framer-motion";
import { Truck, CreditCard, Headset, Store } from "lucide-react";
import { useTranslations } from "next-intl";

export function DeliveryInfo() {
  const t = useTranslations('delivery');

  return (
    <motion.div
      className="bg-gray-50 w-full dark:bg-gray-900 py-12"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <Truck className="h-8 w-8 mb-4 text-pink-600" />
            <h3 className="text-lg font-semibold">{t('fastDelivery.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('fastDelivery.description')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard className="h-8 w-8 mb-4 text-pink-600" />
            <h3 className="text-lg font-semibold">{t('payment.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('payment.description')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Headset className="h-8 w-8 mb-4 text-pink-600" />
            <h3 className="text-lg font-semibold">{t('support.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('support.description')}</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <Store className="h-8 w-8 mb-4 text-pink-600" />
            <h3 className="text-lg font-semibold">{t('store.title')}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('store.description')}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
