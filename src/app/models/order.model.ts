import { Product } from './product.model';

export interface Order {
  id: number;
  orderCode: string;
  customerId: number;
  customerName: string;
  rdcLocation: string;
  status: OrderStatus;
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  estimatedDeliveryDate?: string;
  deliveryAddress: string;
  customerPhone?: string;
  storeName?: string;
  orderItems?: OrderItem[];
  rejectionReason?: string;
  newStatus?: OrderStatus; // For UI state management
}

export interface OrderItem {
  id: number;
  product: ProductInfo;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ProductInfo {
  id: number;
  name: string;
  imageUrl?: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED' 
  | 'CANCELLED';

export interface CreateOrderRequest {
  customerId: number;
  rdcLocation: string;
  deliveryAddress: string;
  items: CreateOrderItemRequest[];
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
}