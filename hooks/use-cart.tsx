import { Product, Size, Color, ColorSizeQuantity } from "@/types";
import toast from "react-hot-toast";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem extends Product {
  quantity: number;
  selectedSize?: Size;
  selectedColor?: Color;
}

interface CartStore {
  items: CartItem[];
  addItem: (data: Product, quantity: number, selectedSize?: Size, selectedColor?: Color) => void;
  removeItem: (id: string, selectedSize?: Size, selectedColor?: Color) => void;
  updateQuantity: (id: string, quantity: number, selectedSize?: Size, selectedColor?: Color) => void;
  removeAll: () => void;
  getTotalPrice: () => number;
}

const useCart = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      addItem: (data: Product, quantity: number, selectedSize?: Size, selectedColor?: Color) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) =>
          item.id === data.id &&
          item.selectedSize?.id === selectedSize?.id &&
          item.selectedColor?.id === selectedColor?.id
        );

        const getAvailableQuantity = (): number => {
          const hasSizes = data.sizes.length > 0;
          const hasColors = data.colors.length > 0;
        
          // No colors, no sizes - use the product's base quantity
          if (!hasSizes && !hasColors) {
            // First check for base quantity in colorSizeQuantities
            const baseQuantity = data.colorSizeQuantities.find(
              csq => !csq.colorId && !csq.sizeId
            );
            if (baseQuantity) {
              return baseQuantity.quantity;
            }
            
            // Otherwise fall back to the product's main quantity field
            return data.quantity || 0;
          }
        
          // Only colors
          if (!hasSizes && hasColors && selectedColor) {
            const colorQuantity = data.colorSizeQuantities.find(
              csq => csq.colorId === selectedColor.id && !csq.sizeId
            );
            return colorQuantity?.quantity || 0;
          }
        
          // Only sizes
          if (hasSizes && !hasColors && selectedSize) {
            const sizeQuantity = data.colorSizeQuantities.find(
              csq => csq.sizeId === selectedSize.id && !csq.colorId
            );
            return sizeQuantity?.quantity || 0;
          }
        
          // Both colors and sizes
          if (selectedSize && selectedColor) {
            const colorSizeQuantity = data.colorSizeQuantities.find(
              csq => csq.colorId === selectedColor.id && csq.sizeId === selectedSize.id
            );
            return colorSizeQuantity?.quantity || 0;
          }
        
          return 0;
        };

        // Check if item or its selected variant is out of stock
        const isOutOfStock = () => {
          if (data.isCompletelyOutOfStock) return true;

          if (selectedSize?.isOutOfStock) return true;
          if (selectedColor?.isOutOfStock) return true;

          return getAvailableQuantity() === 0;
        };

        if (isOutOfStock()) {
          toast.error("هذا المنتج غير متوفر حاليًا في المخزون");
          return;
        }

        const availableQuantity = getAvailableQuantity();
        const currentQuantity = existingItem ? existingItem.quantity : 0;
        const newQuantity = currentQuantity + quantity;

        if (newQuantity > availableQuantity) {
          toast.error(`عذرًا، لم يتبقَ سوى ${availableQuantity - currentQuantity} من هذا المنتج`);
          return;
        }

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item === existingItem
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
          toast.success("تم تحديث كمية المنتج في سلة التسوق");
        } else {
          set({ items: [...currentItems, { ...data, quantity, selectedSize, selectedColor }] });
          toast.success("تم إضافة المنتج إلى سلة التسوق");
        }
      },

      removeItem: (id: string, selectedSize?: Size, selectedColor?: Color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.id === id &&
                item.selectedSize?.id === selectedSize?.id &&
                item.selectedColor?.id === selectedColor?.id)
          ),
        }));
        toast.success("تم إزالة المنتج من سلة التسوق");
      },

      updateQuantity: (id: string, quantity: number, selectedSize?: Size, selectedColor?: Color) => {
        const currentItems = get().items;
        const itemToUpdate = currentItems.find((item) => 
          item.id === id && 
          item.selectedSize?.id === selectedSize?.id && 
          item.selectedColor?.id === selectedColor?.id
        );
      
        if (!itemToUpdate) {
          toast.error("لم يتم العثور على المنتج في سلة التسوق");
          return;
        }
      
        // Simple quantity check for products without variants
        if (!selectedSize && !selectedColor && !itemToUpdate.sizes.length && !itemToUpdate.colors.length) {
          if (quantity <= itemToUpdate.quantity) {
            set({
              items: currentItems.map((item) =>
                item === itemToUpdate ? { ...item, quantity } : item
              ),
            });
            toast.success("تم تحديث كمية المنتج");
            return;
          } else {
            toast.error(`متوفر فقط ${itemToUpdate.quantity} من هذا المنتج`);
            return;
          }
        }
        const getAvailableQuantity = () => {
          const hasSizes = itemToUpdate.sizes.length > 0;
          const hasColors = itemToUpdate.colors.length > 0;

          // No colors, no sizes - use the product's base quantity
          if (!hasSizes && !hasColors) {
            // First check for base quantity in colorSizeQuantities
            const baseQuantity = itemToUpdate.colorSizeQuantities.find(
              csq => !csq.colorId && !csq.sizeId
            );
            // Fall back to product quantity if no specific entry found
            return baseQuantity?.quantity ?? itemToUpdate.quantity ?? 0;
          }

          // Only colors
          if (!hasSizes && hasColors && selectedColor) {
            const colorQuantity = itemToUpdate.colorSizeQuantities.find(
              csq => csq.colorId === selectedColor.id && !csq.sizeId
            );
            return colorQuantity?.quantity || 0;
          }

          // Only sizes
          if (hasSizes && !hasColors && selectedSize) {
            const sizeQuantity = itemToUpdate.colorSizeQuantities.find(
              csq => csq.sizeId === selectedSize.id && !csq.colorId
            );
            return sizeQuantity?.quantity || 0;
          }

          // Both colors and sizes
          if (selectedSize && selectedColor) {
            const colorSizeQuantity = itemToUpdate.colorSizeQuantities.find(
              csq => csq.colorId === selectedColor.id && csq.sizeId === selectedSize.id
            );
            return colorSizeQuantity?.quantity || 0;
          }

          return 0;
        };

        const availableQuantity = getAvailableQuantity();
  if (quantity <= availableQuantity) {
    set({
      items: currentItems.map((item) =>
        item === itemToUpdate ? { ...item, quantity } : item
      ),
    });
    toast.success("تم تحديث كمية المنتج");
  } else {
    toast.error(`متوفر فقط  ${availableQuantity} من هذا المنتج`);
  }
},

      removeAll: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCart;