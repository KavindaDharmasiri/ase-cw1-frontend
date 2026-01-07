import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderRequest } from '../../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class OrderService {
  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${environment.endpoints.orders.base}`);
  }

  getOrdersByCustomer(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${environment.endpoints.orders.customer}/${customerId}`);
  }

  getOrdersByRdc(rdcLocation: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${environment.endpoints.orders.rdc}/${rdcLocation}`);
  }

  getOrdersByStatus(status: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}${environment.endpoints.orders.status}/${status}`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}${environment.endpoints.orders.base}/${id}`);
  }

  createOrder(orderData: CreateOrderRequest): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}${environment.endpoints.orders.base}`, orderData);
  }

  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${environment.apiUrl}${environment.endpoints.orders.base}/${orderId}/status`, null, {
      params: { status }
    });
  }
}