"use client";

import { useTranslations } from "next-intl";
import ProductList from "@/components/ui/product-list";

interface ProductPageClientProps {
  filteredSuggestedProducts: any[];
  isRTL: boolean;
}

const ProductPageClient: React.FC<ProductPageClientProps> = ({
  filteredSuggestedProducts,
  isRTL,
}) => {
  const t = useTranslations("product");

  return (
    <ProductList
      title={t("RELATED_PRODUCTS")}
      items={filteredSuggestedProducts}
      isRTL={isRTL}
    />
  );
};

export default ProductPageClient;
