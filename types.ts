export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
    
}



export interface Comment {
  id: string;

  imageUrl: string;
  
}


export interface Category {
  id: string;
  name: string;
  billboard?: Billboard; 
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
    media: Media[];
    categories: Category[];
    quantity: number | null;
    isOnSale: boolean;  // Added this property
    colorSizeQuantities: ColorSizeQuantity[];
    isCompletelyOutOfStock: boolean;
    
  }
  
  export interface Media {
    id: string;
    url: string;
    type: MediaType; 
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum MediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO'
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
