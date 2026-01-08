import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseOrder, POStatus } from '../../models/purchase-order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcurementService {
  private apiUrl = `${environment.apiUrl}/procurement`;

  constructor(private http: HttpClient) {}

  getAllPurchaseOrders(): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/purchase-orders`);
  }

  getPurchaseOrderById(id: number): Observable<PurchaseOrder> {
    return this.http.get<PurchaseOrder>(`${this.apiUrl}/purchase-orders/${id}`);
  }

  createPurchaseOrder(purchaseOrder: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/purchase-orders`, purchaseOrder, { responseType: 'text' as 'json' });
  }

  updatePurchaseOrderStatus(id: number, status: POStatus): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/purchase-orders/${id}/status?status=${status}`, {}, { responseType: 'text' as 'json' });
  }

  getPurchaseOrdersByStatus(status: POStatus): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/purchase-orders/status/${status}`);
  }

  getPurchaseOrdersByRdc(rdcId: number): Observable<PurchaseOrder[]> {
    return this.http.get<PurchaseOrder[]>(`${this.apiUrl}/purchase-orders/rdc/${rdcId}`);
  }
}