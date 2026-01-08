import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../../models/inventory.model';

@Injectable()
export class InventoryService {
  private apiUrl = 'http://localhost:5000/api/inventory';

  constructor(private http: HttpClient) {}

  getInventoryByRdc(rdcId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/rdc/${rdcId}`);
  }

  getAllInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  updateStock(productId: number, rdcId: number, newStock: number): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/update`, null, {
      params: { productId: productId.toString(), rdcId: rdcId.toString(), newStock: newStock.toString() }
    });
  }

  transferStock(productId: number, fromRdcId: number, toRdcId: number, quantity: number): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.apiUrl}/transfer`, null, {
      params: { productId: productId.toString(), fromRdcId: fromRdcId.toString(), toRdcId: toRdcId.toString(), quantity: quantity.toString() }
    });
  }

  getLowStockItems(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/low-stock`);
  }

  getLowStockItemsByRdc(rdcId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/low-stock/rdc/${rdcId}`);
  }

  deleteInventoryByProductAndRdc(productId: number, rdcId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${productId}/rdc/${rdcId}`, { responseType: 'text' });
  }

  deleteInventoryByProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${productId}`, { responseType: 'text' });
  }
}