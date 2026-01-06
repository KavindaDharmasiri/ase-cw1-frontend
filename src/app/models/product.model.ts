export interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  imageUrl?: string;
  minStockLevel: number;
  createdAt?: string;
  updatedAt?: string;
  orderQuantity?: number; // For cart functionality
}

export interface ProductSearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}