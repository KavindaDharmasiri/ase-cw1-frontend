import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ReportService {
  private apiUrl = 'http://localhost:5000/api/reports';

  constructor(private http: HttpClient) {}

  getDashboardReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard`);
  }

  getSalesReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales`);
  }

  getInventoryReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/inventory`);
  }

  getDeliveryReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/deliveries`);
  }
}