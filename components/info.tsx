"use client";
import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Currency from "@/components/ui/currency";
import { Button } from "@/components/ui/button";
import { Product, Size, Color } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import useCart from "@/hooks/use-cart";
import { useTranslations, useLocale } from "next-intl";
import { HtmlContent } from "@/components/ui/html-content";
import MiniCartPreview from '@/components/ui/mini-cart-preview';

interface InfoProps {
  data: Product;
  showDescription?: boolean;
  onColorSelect?: (color: Color | null) => void; // Make it optional

}

const Info: React.FC<InfoProps> = ({ data, showDescription = true, onColorSelect }) => {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const cart = useCart();
  const t = useTranslations("product");
  const locale = useLocale();
  const [showMiniCart, setShowMiniCart] = useState(false);

  

  const hasSizes = data.sizes.length > 0;
  const hasColors = data.colors.length > 0;


  const handleColorSelect = (color: Color | null) => {
    setSelectedColor(color);
    // Only call onColorSelect if it exists
    if (onColorSelect) {
      onColorSelect(color);
    }
  };
  

  const getAvailableQuantity = (): number => {
    if (!hasSizes && !hasColors) return data.quantity || 0;

    if (!hasSizes && hasColors) {
      if (selectedColor) {
        const colorQuantity = data.colorSizeQuantities.find(
          (csq) => csq.colorId === selectedColor.id && !csq.sizeId
        );
        return colorQuantity?.quantity || 0;
      }
      return data.colorSizeQuantities.reduce(
        (total, csq) => (!csq.sizeId ? total + csq.quantity : total),
        0
      );
    }

    if (hasSizes && !hasColors) {
      if (selectedSize) {
        const sizeQuantity = data.colorSizeQuantities.find(
          (csq) => csq.sizeId === selectedSize.id && !csq.colorId
        );
        return sizeQuantity?.quantity || 0;
      }
      return data.colorSizeQuantities.reduce(
        (total, csq) => (!csq.colorId ? total + csq.quantity : total),
        0
      );
    }

    if (selectedSize && selectedColor) {
      const colorSizeQuantity = data.colorSizeQuantities.find(
        (csq) =>
          csq.colorId === selectedColor.id && csq.sizeId === selectedSize.id
      );
      return colorSizeQuantity?.quantity || 0;
    }

    return data.colorSizeQuantities.reduce((total, csq) => total + csq.quantity, 0);
  };

  const handleAddToCart = () => {
    setMessage(null);


    if (hasColors && !selectedColor) {
      setMessage(t("alerts.selectColor"));
      return;
    }

    if (hasSizes && !selectedSize) {
      setMessage(t("alerts.selectSize"));
      return;
    }



    const availableQuantity = getAvailableQuantity();
    if (quantity > availableQuantity) {
      setMessage(t("alerts.limitedStock", { count: availableQuantity }));
      return;
    }

    cart.addItem(data, quantity, selectedSize || undefined, selectedColor || undefined);
    setMessage(t("alerts.addedToCart"));
    setShowMiniCart(true); // Show mini cart preview

  };

  const isCompletelyOutOfStock = (): boolean => {
    return getAvailableQuantity() === 0;
  };

  const renderOptions = (
    options: Size[] | Color[],
    selectedOption: Size | Color | null,
    setOption: React.Dispatch<React.SetStateAction<Size | null>> | React.Dispatch<React.SetStateAction<Color | null>>,
    type: "size" | "color"
  ) => {
    if (options.length === 0) return null;

    return (
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-2 dark:text-gray-200 rtl:text-right">
          {type === "size" ? t("chooseSize") : t("chooseColor")}
        </h3>
        <div
          className={`flex ${
            type === "size"
              ? "flex-wrap gap-2"
              : locale === "ar"
              ? "space-x-2 rtl:space-x-reverse"
              : "space-x-2"
          }`}
        >
          {options.map((option) => {
            const isAvailable =
              type === "size"
                ? !option.isOutOfStock && getQuantityForOption(option, type) > 0
                : !option.isOutOfStock && getQuantityForOption(option, type) > 0;

            return (
              <button
                key={option.id}
                className={`transition-all duration-200 ease-in-out
                  ${
                    type === "size"
                      ? "px-3 py-1 text-sm rounded-md"
                      : "w-8 h-8 rounded-full border-2"
                  }
                  ${
                    selectedOption?.id === option.id
                      ? type === "size"
                        ? "bg-pink-500 text-white"
                        : "border-black dark:border-white scale-110 shadow-md shadow-pink-500/50"
                      : type === "size"
                      ? "bg-white dark:bg-gray-800 text-pink-500 dark:text-pink-400 border border-pink-500 dark:border-pink-400"
                      : "border-gray-300 dark:border-gray-600"
                  }
                  ${!isAvailable ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
                style={type === "color" ? { backgroundColor: (option as Color).value } : {}}
                onClick={() => {
                  if (type === "color") {
                    if (isAvailable) {
                      if (selectedOption?.id === option.id) {
                        handleColorSelect(null);
                      } else {
                        handleColorSelect(option as Color);
                      }
                      setQuantity(1);
                      setMessage(null);
                    }
                  } else {
                    if (isAvailable) {
                      if (selectedOption?.id === option.id) {
                        setOption(null);
                      } else {
                        setOption(option as any);
                      }
                      setQuantity(1);
                      setMessage(null);
                    }
                  }
                }}
                disabled={!isAvailable}
              >
                
                {type === "size" ? (option as Size).name : null}
                {!isAvailable && type === "color" && (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-[150%] h-0.5 bg-red-700 dark:bg-red-400 rotate-45"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const getQuantityForOption = (option: Size | Color, type: "size" | "color"): number => {
    if (type === "size") {
      if (hasColors && selectedColor) {
        return (
          data.colorSizeQuantities.find(
            (csq) => csq.sizeId === option.id && csq.colorId === selectedColor.id
          )?.quantity || 0
        );
      }
      return data.colorSizeQuantities
        .filter((csq) => csq.sizeId === option.id)
        .reduce((total, csq) => total + csq.quantity, 0);
    } else {
      if (hasSizes && selectedSize) {
        return (
          data.colorSizeQuantities.find(
            (csq) => csq.colorId === option.id && csq.sizeId === selectedSize.id
          )?.quantity || 0
        );
      }
      return data.colorSizeQuantities
        .filter((csq) => csq.colorId === option.id)
        .reduce((total, csq) => total + csq.quantity, 0);
    }
  };

  const renderQuantityControl = () => {
    const availableQuantity = getAvailableQuantity();

    return (
      <div className="flex items-center space-x-2 mb-4">
        <h3 className="text-sm font-semibold dark:text-gray-200 mr-2 rtl:ml-2 rtl:mr-0">
          {t("quantity")}
        </h3>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="focus:bg-pink-600 focus:text-white dark:border-gray-600 dark:text-gray-200"
          >
            <Minus size={16} />
          </Button>
          <input
            type="text"
            value={quantity}
            onChange={(e) => {
              const newQuantity = Math.max(
                1,
                Math.min(availableQuantity, Number(e.target.value))
              );
              setQuantity(newQuantity);
            }}
            className="w-8 text-center rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
          />
          <Button
            className="focus:bg-pink-600 focus:text-white dark:border-gray-600 dark:text-gray-200"
            size="sm"
            variant="outline"
            onClick={() => setQuantity(Math.min(availableQuantity, quantity + 1))}
            disabled={quantity >= availableQuantity}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 w-full max-w-full">
      <div>
        <h1 className="text-2xl font-bold text-primary dark:text-gray-100 rtl:text-right">
          {data.name}
        </h1>
        <div className="mt-2">
          <div className="text-xl text-gray-900 dark:text-gray-100 rtl:text-right">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
          {data.originalPrice && (
            <span className="text-base text-rose-400 dark:text-red-300 line-through">
              <Currency value={data.originalPrice} />
            </span>
          )}
          <span><Currency value={data.price} /></span>

        </div>
         
          </div>
        </div>
      </div>

      <hr className="border-gray-300 dark:border-gray-700" />

      <div className="w-full">
        {renderOptions(data.colors, selectedColor, setSelectedColor, "color")}
        {renderOptions(data.sizes, selectedSize, setSelectedSize, "size")}
      </div>

      {renderQuantityControl()}

      <div className="w-full flex justify-start rtl:justflex-row-reverse">
      <div className="relative inline-block">
          <Button
            size="sm"
            className="px-6 py-4 text-sm font-semibold text-white bg-pink-600 hover:bg-white hover:text-black dark:hover:bg-gray-800 dark:hover:text-white border border-pink-600 hover:border-black dark:hover:border-gray-600 dark:bg-pink-700 dark:border-pink-700 transition-colors"
            onClick={handleAddToCart}
            disabled={isCompletelyOutOfStock()}
          >
            {t("addToCart")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ${locale === "ar" ? "mr-2" : "ml-2"}`}
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
          </Button>
        </div>
      </div>

      {message && (
        <Alert
          variant={message.includes(t("alerts.addedToCart")) ? "default" : "destructive"}
          className={`dark:bg-gray-800 dark:border-gray-700 ${
            message === t("alerts.selectSize") || message === t("alerts.selectColor")
              ? "dark:text-red-400 rtl:text-right"
              : ""
          }`}
        >
          <AlertDescription
            className={`${
              message === t("alerts.selectSize") || message === t("alerts.selectColor")
                ? "dark:text-red-400 text-red-600 rtl:text-right"
                : "dark:text-gray-200 rtl:text-right"
            }`}
          >
            {message}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-xs text-gray-600 dark:text-gray-400 rtl:text-right">
        {hasSizes && (
          <p>
            {t("selectedSize")} {selectedSize?.name || t("none")}
          </p>
        )}
        {hasColors && (
          <p>
            {t("selectedColor")} {selectedColor?.name || t("none")}
          </p>
        )}
        <p>
          {t("availableQuantity")} {getAvailableQuantity()}
        </p>
      </div>

      {data.description && showDescription && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2 dark:text-gray-200">
            {t("productDescription")}
          </h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <HtmlContent content={data.description} />
          </div>
        </div>
      )}
            <MiniCartPreview 
        isOpen={showMiniCart}
        onClose={() => setShowMiniCart(false)}
        product={data}
        quantity={quantity}
      />
    </div>
  );
};

export default Info;