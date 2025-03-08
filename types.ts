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
    originalPrice?: number; // Add this line
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

    selectedColor?: Color;  // Add this line

    
  }
  
  export interface Media {
    id: string;
    url: string;
    type: MediaType; 
    colorId?: string;
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


export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  colorId?: string;
  sizeId?: string;
  color?: Color;
  size?: Size;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  storeId: string;
  orderItems: OrderItem[];
  isPaid: boolean;
  phone: string;
  address: string;
  customerName?: string;
  city?: string;
  cityship?: string;
  shippingCost?: number;
  deliveryStatus: DeliveryStatus;
  paymentMethod: string;
  billingAddress?: string;
  shippingAddress?: string;
  NumNom?: string;
  batiment?: string;
  email?: string;
  Nomsentmoney?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryStatus {
  SELECT_STATUS = 'SELECT_STATUS',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED'
}