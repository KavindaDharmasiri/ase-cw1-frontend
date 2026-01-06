import { Product } from './product.model';

export interface Inventory {
  id: number;
  product: Product;
  rdcLocation: string;
  currentStock: number;
  reservedStock: number;
  lastUpdated: string;
  availableStock: number;
  lowStock: boolean;
}

export interface StockUpdateRequest {
  productId: number;
  rdcLocation: string;
  newStock: number;
}

export interface StockTransferRequest {
  productId: number;
  fromRdc: string;
  toRdc: string;
  quantity: number;
}