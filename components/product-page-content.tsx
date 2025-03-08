"use client";

import { useState } from "react";
import { Color, Product } from "@/types";
import Gallery from "@/components/gallery";
import Info from "@/components/info";

interface ProductPageContentProps {
  product: Product;
}

const ProductPageContent = ({ product }: ProductPageContentProps) => {
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  const handleColorSelect = (color: Color | null) => {
    setSelectedColor(color);
  };

  return (
    <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
      <div className="w-full">
        <Gallery media={product.media} selectedColor={selectedColor} />
      </div>
      <div className="mt-8 lg:mt-0 w-full">
        <div className="px-2 md:px-4">
          <Info data={product} onColorSelect={handleColorSelect} />
        </div>
      </div>
    </div>
  );
};

export default ProductPageContent;
