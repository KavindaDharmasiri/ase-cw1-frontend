import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RDC } from '../../models/rdc.model';

@Injectable({
  providedIn: 'root'
})
export class RDCService {
  private apiUrl = 'http://localhost:5000/api/rdcs';

  constructor(private http: HttpClient) {}

  getAllActiveRDCs(): Observable<RDC[]> {
    return this.http.get<RDC[]>(this.apiUrl);
  }

  getAllRDCs(): Observable<RDC[]> {
    return this.http.get<RDC[]>(`${this.apiUrl}/all`);
  }

  activateRDC(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/activate`, {}, { responseType: 'text' });
  }

  createRDC(rdc: RDC): Observable<RDC> {
    return this.http.post<RDC>(this.apiUrl, rdc);
  }

  updateRDC(id: number, rdc: RDC): Observable<RDC> {
    return this.http.put<RDC>(`${this.apiUrl}/${id}`, rdc);
  }

  deleteRDC(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}