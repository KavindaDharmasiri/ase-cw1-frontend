import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../../models/order.model';

@Injectable()
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getOrdersByRdc(rdcLocation: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/rdc/${rdcLocation}`);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/status/${status}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, orderData);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.apiUrl}/${orderId}/status`, null, {
      params: { status }
    });
  }
}