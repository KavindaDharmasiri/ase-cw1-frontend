export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  maxStock: number;
}

export interface CartResponse {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    unit: number;
  };
  quantity: number;
  createdAt: string;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}