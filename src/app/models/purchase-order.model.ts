export interface PurchaseOrder {
  id?: number;
  poNumber: string;
  supplierName: string;
  status: string;
  totalAmount: number;
  orderDate: Date;
  expectedDeliveryDate?: Date;
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
  ISSUED = 'ISSUED',
  RECEIVED = 'RECEIVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}