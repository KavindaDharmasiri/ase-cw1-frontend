import { Product } from './product.model';
import { User } from './user.model';

export interface StockTransfer {
  id: number;
  product: Product;
  fromRdc: string;
  toRdc: string;
  quantity: number;
  status: TransferStatus;
  requestDate: string;
  approvedDate?: string;
  completedDate?: string;
  reason: string;
  notes?: string;
  requestedBy: User;
  approvedBy?: User;
}

export type TransferStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'IN_TRANSIT' 
  | 'COMPLETED' 
  | 'REJECTED' 
  | 'CANCELLED';

export interface TransferRequest {
  productId: number;
  fromRdc: string;
  toRdc: string;
  quantity: number;
  reason: string;
  requestedById: number;
}