import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptService {
  private apiUrl = `${environment.apiUrl}/goods-receipt`;

  constructor(private http: HttpClient) {}

  getAllGoodsReceiptNotes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getGoodsReceiptNoteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createGoodsReceiptNote(grn: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, grn);
  }

  getGrnsByRdc(rdcId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rdc/${rdcId}`);
  }

  getGrnsByPurchaseOrder(poId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/purchase-order/${poId}`);
  }
}