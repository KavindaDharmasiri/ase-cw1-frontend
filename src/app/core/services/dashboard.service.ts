import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  recentOrders: number;
  pendingDeliveries: number;
  availableProducts: number;
  totalRevenue?: number;
  lowStockItems?: number;
}

@Injectable()
export class DashboardService {
  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${environment.apiUrl}/dashboard/stats`);
  }

  getRecentOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}${environment.endpoints.orders.base}/recent`);
  }

  getPendingDeliveries(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}${environment.endpoints.deliveries.base}/pending`);
  }
}