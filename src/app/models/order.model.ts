import { Product } from './product.model';
import { User } from './user.model';

export interface Order {
  id: number;
  customer: User;
  rdcLocation: string;
  status: OrderStatus;
  totalAmount: number;
  orderDate: string;
  deliveryDate?: string;
  deliveryAddress: string;
  orderItems?: OrderItem[];
  newStatus?: OrderStatus; // For UI state management
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PROCESSING' 
  | 'SHIPPED' 
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