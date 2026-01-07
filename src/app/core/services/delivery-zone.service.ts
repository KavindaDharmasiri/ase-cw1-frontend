import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeliveryZone } from '../../models/delivery-zone.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeliveryZoneService {
  private apiUrl = `${environment.apiUrl}/delivery-zones`;

  constructor(private http: HttpClient) {}

  getAllDeliveryZones(): Observable<DeliveryZone[]> {
    return this.http.get<DeliveryZone[]>(this.apiUrl);
  }

  getActiveDeliveryZones(): Observable<DeliveryZone[]> {
    return this.http.get<DeliveryZone[]>(`${this.apiUrl}/active`);
  }

  createDeliveryZone(zone: DeliveryZone): Observable<DeliveryZone> {
    return this.http.post<DeliveryZone>(this.apiUrl, zone);
  }

  updateDeliveryZone(id: number, zone: DeliveryZone): Observable<DeliveryZone> {
    return this.http.put<DeliveryZone>(`${this.apiUrl}/${id}`, zone);
  }

  activateDeliveryZone(id: number): Observable<DeliveryZone> {
    return this.http.put<DeliveryZone>(`${this.apiUrl}/${id}/activate`, {});
  }

  deactivateDeliveryZone(id: number): Observable<DeliveryZone> {
    return this.http.put<DeliveryZone>(`${this.apiUrl}/${id}/deactivate`, {});
  }
}