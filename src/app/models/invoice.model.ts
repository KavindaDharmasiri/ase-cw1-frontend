export interface Invoice {
  id: number;
  order: {
    id: number;
    customer: {
      fullName: string;
    };
  };
  invoiceNumber: string;
  invoiceDate: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  paidDate?: string;
  paymentMethod?: string;
  paymentReference?: string;
}

export type PaymentStatus = 
  | 'PENDING' 
  | 'PAID' 
  | 'OVERDUE' 
  | 'CANCELLED';

export interface PaymentRequest {
  paymentMethod: string;
  paymentReference: string;
}