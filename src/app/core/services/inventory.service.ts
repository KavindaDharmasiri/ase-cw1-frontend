import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../../models/inventory.model';

@Injectable()
export class InventoryService {
  private apiUrl = 'http://localhost:5000/api/inventory';

  constructor(private http: HttpClient) {}

  getInventoryByRdc(rdcLocation: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/rdc/${rdcLocation}`);
  }

  getAllInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  updateStock(productId: number, rdcLocation: string, newStock: number): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/update`, null, {
      params: { productId: productId.toString(), rdcLocation, newStock: newStock.toString() }
    });
  }

  transferStock(productId: number, fromRdc: string, toRdc: string, quantity: number): Observable<Inventory> {
    return this.http.post<Inventory>(`${this.apiUrl}/transfer`, null, {
      params: { productId: productId.toString(), fromRdc, toRdc, quantity: quantity.toString() }
    });
  }

  getLowStockItems(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/low-stock`);
  }

  getLowStockItemsByRdc(rdcLocation: string): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/low-stock/rdc/${rdcLocation}`);
  }
}