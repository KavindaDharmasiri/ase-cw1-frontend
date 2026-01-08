export interface Product {
  id?: number;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  sku?: string;
  brand?: string;
  barcode?: string;
  taxClass?: string;
  weight?: number;
  volume?: number;
  status?: string;
  purchasePrice?: number;
  price: number;
  taxRate?: number;
  unit: string;
  imageUrl?: string;
  minStockLevel: number;
  createdAt?: string;
  updatedAt?: string;
  orderQuantity?: number;
}

export interface ProductSearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}