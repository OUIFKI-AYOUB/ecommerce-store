import { Product, Size, Color, ColorSizeQuantity, Media, MediaType } from "@/types";
import qs from "query-string";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;

}
const isProductOutOfStock = (product: Product): boolean => {
  const hasSizes = product.sizes.length > 0;
  const hasColors = product.colors.length > 0;

  // Case 1: No sizes or colors - check product quantity
  if (!hasSizes && !hasColors) {
    return product.quantity === 0 || product.quantity === null;
  }

  // Case 2: Only colors
  if (!hasSizes && hasColors) {
    return product.colorSizeQuantities
      .filter(csq => !csq.sizeId)
      .every(csq => csq.quantity === 0);
  }

  // Case 3: Only sizes
  if (hasSizes && !hasColors) {
    return product.colorSizeQuantities
      .filter(csq => !csq.colorId)
      .every(csq => csq.quantity === 0);
  }

  // Case 4: Both sizes and colors
  return product.colorSizeQuantities
    .filter(csq => csq.colorId && csq.sizeId)
    .every(csq => csq.quantity === 0);
};

const processProductStock = (product: Product): Product => {
  const hasSizes = product.sizes.length > 0;
  const hasColors = product.colors.length > 0;

  // Process sizes
  const processedSizes = product.sizes.map(size => ({
    ...size,
    isOutOfStock: hasSizes && !hasColors
      ? product.colorSizeQuantities
          .filter(csq => csq.sizeId === size.id && !csq.colorId)
          .every(csq => csq.quantity === 0)
      : product.colorSizeQuantities
          .filter(csq => csq.sizeId === size.id)
          .every(csq => csq.quantity === 0)
  }));

  // Process colors
  const processedColors = product.colors.map(color => ({
    ...color,
    isOutOfStock: hasColors && !hasSizes
      ? product.colorSizeQuantities
          .filter(csq => csq.colorId === color.id && !csq.sizeId)
          .every(csq => csq.quantity === 0)
      : product.colorSizeQuantities
          .filter(csq => csq.colorId === color.id)
          .every(csq => csq.quantity === 0)
  }));

  // Calculate if the product is completely out of stock
  const isCompletelyOutOfStock = isProductOutOfStock(product);

  return {
    ...product,
    sizes: processedSizes,
    colors: processedColors,
    isCompletelyOutOfStock
  };
};

const getProducts = async (query: Query): Promise<Product[]> => {
  const url = qs.stringifyUrl({
    url: URL,
    query: {
      categoryId: query.categoryId,
      colorId: query.colorId,
      sizeId: query.sizeId,
      isFeatured: query.isFeatured,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
    },
  });
  const res = await fetch(url, {
    cache: 'no-store',
    next: { revalidate: 0 }
  });

  let products: Product[] = await res.json();

// Apply price filter if minPrice or maxPrice is provided
if (query.minPrice || query.maxPrice) {
  products = products.filter((product) => {
    const price = product.price;
    const minPrice = query.minPrice ? parseFloat(query.minPrice) : 0;
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : Infinity;
    
    return price >= minPrice && price <= maxPrice;
  });
}

// Apply sorting
if (query.sort) {
  switch (query.sort) {
    case 'price-low':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'date-old':
      products.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'date-new':
      products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }
}

  // Process each product to determine stock status at all levels
  products = products.map(processProductStock);

  return products;
};

export default getProducts;