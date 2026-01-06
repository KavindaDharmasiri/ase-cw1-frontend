import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Invoice } from '../../models/invoice.model';

@Injectable()
export class InvoiceService {
  private apiUrl = 'http://localhost:5000/api/invoices';

  constructor(private http: HttpClient) {}

  getAllInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  getInvoiceByOrderId(orderId: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/order/${orderId}`);
  }

  generateInvoice(orderId: number): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/generate/${orderId}`, {});
  }

  markAsPaid(invoiceId: number, paymentMethod: string, paymentReference: string): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${invoiceId}/pay`, {
      paymentMethod,
      paymentReference
    });
  }
}