import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockTransfer, TransferRequest } from '../../models/stock-transfer.model';

@Injectable()
export class StockTransferService {
  private apiUrl = 'http://localhost:5000/api/stock-transfers';

  constructor(private http: HttpClient) {}

  getAllTransfers(): Observable<StockTransfer[]> {
    return this.http.get<StockTransfer[]>(this.apiUrl);
  }

  getTransfersByStatus(status: string): Observable<StockTransfer[]> {
    return this.http.get<StockTransfer[]>(`${this.apiUrl}/status/${status}`);
  }

  getTransfersByFromRdc(fromRdc: string): Observable<StockTransfer[]> {
    return this.http.get<StockTransfer[]>(`${this.apiUrl}/from/${fromRdc}`);
  }

  requestTransfer(request: TransferRequest): Observable<StockTransfer> {
    return this.http.post<StockTransfer>(`${this.apiUrl}/request`, request);
  }

  approveTransfer(transferId: number, approvedById: number, notes: string): Observable<StockTransfer> {
    return this.http.put<StockTransfer>(`${this.apiUrl}/${transferId}/approve`, {
      approvedById,
      notes
    });
  }

  completeTransfer(transferId: number): Observable<StockTransfer> {
    return this.http.put<StockTransfer>(`${this.apiUrl}/${transferId}/complete`, {});
  }
}