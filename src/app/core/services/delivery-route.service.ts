import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DeliveryRoute {
  id?: number;
  routeName: string;
  driverName?: string;
  vehicleNumber?: string;
  rdcLocation: string;
  scheduledDate: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  deliveries?: any[];
  notes?: string;
  // Computed properties for UI
  estimatedTime?: string;
  totalDistance?: number;
}

export interface CreateRouteRequest {
  routeName: string;
  rdcLocation: string;
  scheduledDate: string;
  notes?: string;
}

export interface AssignDriverRequest {
  driverName: string;
  vehicleNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeliveryRouteService {
  private apiUrl = `${environment.apiUrl}/delivery-routes`;

  constructor(private http: HttpClient) {}

  getAllRoutes(): Observable<DeliveryRoute[]> {
    return this.http.get<DeliveryRoute[]>(this.apiUrl);
  }

  getRouteById(id: number): Observable<DeliveryRoute> {
    return this.http.get<DeliveryRoute>(`${this.apiUrl}/${id}`);
  }

  getRoutesByStatus(status: string): Observable<DeliveryRoute[]> {
    return this.http.get<DeliveryRoute[]>(`${this.apiUrl}/status/${status}`);
  }

  getRoutesByRdc(rdcLocation: string): Observable<DeliveryRoute[]> {
    return this.http.get<DeliveryRoute[]>(`${this.apiUrl}/rdc/${rdcLocation}`);
  }

  getRoutesByDriver(driverName: string): Observable<DeliveryRoute[]> {
    return this.http.get<DeliveryRoute[]>(`${this.apiUrl}/driver/${driverName}`);
  }

  getActiveRoutes(): Observable<DeliveryRoute[]> {
    return this.http.get<DeliveryRoute[]>(`${this.apiUrl}/active`);
  }

  createRoute(request: CreateRouteRequest): Observable<DeliveryRoute> {
    return this.http.post<DeliveryRoute>(this.apiUrl, request);
  }

  updateRoute(id: number, route: DeliveryRoute): Observable<DeliveryRoute> {
    return this.http.put<DeliveryRoute>(`${this.apiUrl}/${id}`, route);
  }

  updateRouteStatus(id: number, status: string): Observable<DeliveryRoute> {
    return this.http.put<DeliveryRoute>(`${this.apiUrl}/${id}/status`, { status });
  }

  assignDriver(id: number, request: AssignDriverRequest): Observable<DeliveryRoute> {
    return this.http.put<DeliveryRoute>(`${this.apiUrl}/${id}/assign`, request);
  }

  dispatchRoute(id: number): Observable<DeliveryRoute> {
    return this.http.put<DeliveryRoute>(`${this.apiUrl}/${id}/dispatch`, {});
  }

  deleteRoute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  countRoutesByStatus(status: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/stats/count/${status}`);
  }
}