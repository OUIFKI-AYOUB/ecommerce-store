export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
    
}

export interface Category {
    id: string;
    name: string;
    billboard: Billboard;
    
}



export interface Size {
    id: string;
    name: string;
    value: string;
    isOutOfStock: boolean;
    colorSizeQuantities: ColorSizeQuantity[];
  }
  
  export interface Color {
    id: string;
    name: string;
    value: string;
    isOutOfStock: boolean;
    colorSizeQuantities: ColorSizeQuantity[];
  }
  
  export interface Product {
    id: string;
    storeId: string;
    name: string;
    isOutOfStock: boolean;
    price: number;
    isFeatured: boolean;
    isArchived: boolean;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    sizes: Size[];
    colors: Color[];
    images: Image[];
    categories: Category[];
    quantity: number | null;
    colorSizeQuantities: ColorSizeQuantity[];
    isCompletelyOutOfStock: boolean;
    
  }
  
  export interface Image {
    id: string;
    url: string;
    
  }
  

  export interface ColorSizeQuantity {
    id: string;
    productId: string;
    colorId?: string;
    sizeId?: string;
    quantity: number;
    color?: Color;
    size?: Size;
}

  export interface CartItem extends Product {
    quantity: number;
    selectedSize?: Size;
    selectedColor?: Color;
}