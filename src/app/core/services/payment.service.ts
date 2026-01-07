import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: 'ONLINE' | 'CASH_ON_DELIVERY';
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  transactionId?: string;
  paymentDate: Date;
}

export interface PaymentRequest {
  orderId: number;
  amount: number;
  method: 'ONLINE' | 'CASH_ON_DELIVERY';
  cardDetails?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  processPayment(paymentRequest: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(`${environment.apiUrl}/api/payments/process`, paymentRequest);
  }

  getPaymentHistory(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${environment.apiUrl}/api/payments/history`);
  }

  getPaymentByOrderId(orderId: number): Observable<Payment> {
    return this.http.get<Payment>(`${environment.apiUrl}/api/payments/order/${orderId}`);
  }

  retryPayment(paymentId: number): Observable<Payment> {
    return this.http.post<Payment>(`${environment.apiUrl}/api/payments/${paymentId}/retry`, {});
  }
}