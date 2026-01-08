import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {
  private apiUrl = `${environment.apiUrl}/warehouse`;

  constructor(private http: HttpClient) {}

  getAllPickLists(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pick-lists`);
  }

  getPickListById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pick-lists/${id}`);
  }

  createPickList(pickList: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pick-lists`, pickList);
  }

  updatePickListStatus(id: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pick-lists/${id}/status?status=${status}`, {});
  }

  assignVehicleAndDriver(id: number, vehicleId: number, driverId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/pick-lists/${id}/assign?vehicleId=${vehicleId}&driverId=${driverId}`, {});
  }

  getPickListsByRdc(rdcId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pick-lists/rdc/${rdcId}`);
  }

  getPickListsByStatus(status: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pick-lists/status/${status}`);
  }
}