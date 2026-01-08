import { Product } from './product.model';
import { RDC } from './rdc.model';

export interface Inventory {
  id: number;
  product: Product;
  rdc: RDC;
  availableStock: number;
  allocatedStock: number;
  inTransitStock: number;
  soldStock: number;
  damagedStock: number;
  expiredStock: number;
  batchNumber?: string;
  expiryDate?: string;
  warehouseLocation?: string;
  lastUpdated: string;
  status: 'AVAILABLE' | 'ALLOCATED' | 'IN_TRANSIT' | 'SOLD' | 'DAMAGED' | 'EXPIRED';
}

export interface StockUpdateRequest {
  productId: number;
  rdcId: number;
  newStock: number;
}

export interface StockTransferRequest {
  productId: number;
  fromRdcId: number;
  toRdcId: number;
  quantity: number;
}