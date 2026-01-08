export interface PurchaseOrder {
  id?: number;
  poNumber: string;
  supplier: any;
  rdc?: any;
  status: POStatus;
  totalAmount: number;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  items?: PurchaseOrderItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PurchaseOrderItem {
  id?: number;
  product: any;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  damagedQuantity: number;
}

export enum POStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  CONFIRMED = 'CONFIRMED',
  PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
  RECEIVED = 'RECEIVED',
  CANCELLED = 'CANCELLED'
}