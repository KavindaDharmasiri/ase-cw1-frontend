import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-allocation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="allocation-container">
      <h1>📦 Stock Allocation & Dispatch</h1>
      
      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="filterOrders()">
          <option value="">All Orders</option>
          <option value="PROCESSING">Ready for Allocation</option>
          <option value="SHIPPED">Ready for Dispatch</option>
          <option value="OUT_FOR_DELIVERY">Dispatched</option>
        </select>
      </div>

      <div class="orders-grid">
        <div *ngFor="let order of filteredOrders" class="order-card" 
             [ngClass]="'status-' + order.status.toLowerCase()">
          <div class="order-header">
            <h3>{{order.orderCode}}</h3>
            <span class="status-badge">{{order.status}}</span>
          </div>
          
          <div class="order-details">
            <p><strong>Customer:</strong> {{order.customer?.name || 'Unknown'}}</p>
            <p><strong>RDC:</strong> {{order.rdcLocation}}</p>
            <p><strong>Total:</strong> Rs. {{order.totalAmount}}</p>
            <p><strong>Items:</strong> {{order.orderItems?.length || 0}}</p>
          </div>

          <div class="order-items">
            <h4>Items to Pick:</h4>
            <div *ngFor="let item of order.orderItems" class="item-row">
              <span>{{item.product.name}}</span>
              <span>×{{item.quantity}}</span>
            </div>
          </div>

          <div class="order-actions">
            <button *ngIf="order.status === 'PROCESSING'" 
                    (click)="allocateStock(order.id)" 
                    class="btn-allocate">
              📋 Allocate Stock
            </button>
            
            <button *ngIf="order.status === 'SHIPPED'" 
                    (click)="dispatchOrder(order.id)" 
                    class="btn-dispatch">
              🚚 Dispatch Order
            </button>
            
            <span *ngIf="order.status === 'OUT_FOR_DELIVERY'" class="dispatched-label">
              ✅ Dispatched
            </span>
          </div>
        </div>
      </div>

      <div *ngIf="filteredOrders.length === 0" class="no-orders">
        <p>No orders found for the selected status.</p>
      </div>
    </div>
  `,
  styles: [`
    .allocation-container { padding: 20px; }
    .filters { margin-bottom: 20px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .order-card.status-processing { border-left: 4px solid #f39c12; }
    .order-card.status-shipped { border-left: 4px solid #3498db; }
    .order-card.status-out_for_delivery { border-left: 4px solid #27ae60; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #ecf0f1; color: #2c3e50; }
    .order-details p { margin: 5px 0; }
    .order-items { margin: 15px 0; }
    .item-row { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #eee; }
    .order-actions { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .btn-allocate { background: #f39c12; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-dispatch { background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .dispatched-label { color: #27ae60; font-weight: bold; }
    .no-orders { text-align: center; padding: 40px; color: #666; }
  `]
})
export class StockAllocationComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  statusFilter = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<any[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (orders) => {
        this.orders = orders.filter(order => 
          ['PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(order.status)
        );
        this.filteredOrders = [...this.orders];
      },
      error: (error) => console.error('Error loading orders:', error)
    });
  }

  filterOrders() {
    if (this.statusFilter) {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    } else {
      this.filteredOrders = [...this.orders];
    }
  }

  allocateStock(orderId: number) {
    Swal.fire({
      title: 'Allocate Stock?',
      text: 'This will move stock from Available to Allocated status.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Allocate Stock'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${environment.apiUrl}/stock-allocation/allocate/${orderId}`, {}).subscribe({
          next: (response: any) => {
            Swal.fire('Success', response.message, 'success');
            this.loadOrders();
          },
          error: (error) => {
            Swal.fire('Error', error.error?.message || 'Failed to allocate stock', 'error');
          }
        });
      }
    });
  }

  dispatchOrder(orderId: number) {
    Swal.fire({
      title: 'Dispatch Order?',
      text: 'This will mark the order as Out for Delivery.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Dispatch Order'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.post(`${environment.apiUrl}/stock-allocation/dispatch/${orderId}`, {}).subscribe({
          next: (response: any) => {
            Swal.fire('Success', response.message, 'success');
            this.loadOrders();
          },
          error: (error) => {
            Swal.fire('Error', error.error?.message || 'Failed to dispatch order', 'error');
          }
        });
      }
    });
  }
}