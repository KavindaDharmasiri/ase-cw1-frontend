import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Delivery {
  id: number;
  order: {
    id: number;
    customer: {
      id: number;
      fullName: string;
    };
    deliveryAddress: string;
  };
  driverName: string;
  vehicleNumber: string;
  status: string;
  scheduledDate: string;
  actualDeliveryDate?: string;
  currentLocation?: string;
  notes?: string;
}

@Injectable()
export class DeliveryService {
  private apiUrl = 'http://localhost:5000/api/deliveries';

  constructor(private http: HttpClient) {}

  getAllDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.apiUrl);
  }

  getDeliveriesByStatus(status: string): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/status/${status}`);
  }

  getDeliveriesByCustomer(customerId: number): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  getDeliveryByOrderId(orderId: number): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.apiUrl}/order/${orderId}`);
  }

  scheduleDelivery(request: any): Observable<Delivery> {
    return this.http.post<Delivery>(`${this.apiUrl}/schedule`, request);
  }

  updateDeliveryStatus(deliveryId: number, request: any): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.apiUrl}/${deliveryId}/status`, request);
  }

  updateDeliveryLocation(deliveryId: number, location: string): Observable<Delivery> {
    return this.http.put<Delivery>(`${this.apiUrl}/${deliveryId}/location`, null, {
      params: { currentLocation: location }
    });
  }
}