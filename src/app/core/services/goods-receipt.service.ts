import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GoodsReceiptService {
  private apiUrl = `${environment.apiUrl}/procurement`;

  constructor(private http: HttpClient) {}

  getAllGoodsReceiptNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grn`);
  }

  getGoodsReceiptNoteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/grn/${id}`);
  }

  createGoodsReceiptNote(grn: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/grn`, grn, { responseType: 'text' as 'json' });
  }

  getGrnsByRdc(rdcId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/goods-receipt/rdc/${rdcId}`);
  }

  getGrnsByPurchaseOrder(poId: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/goods-receipt/purchase-order/${poId}`);
  }
}