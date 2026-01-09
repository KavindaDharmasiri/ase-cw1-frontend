import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-order-status-tracking',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="status-tracking">
      <h1>📦 Order Status Tracking</h1>
      
      <div class="status-flow">
        <div class="flow-step" [class.active]="true">
          <div class="step-icon">✅</div>
          <div class="step-content">
            <h3>CONFIRMED</h3>
            <p>Order confirmed by customer</p>
          </div>
        </div>
        
        <div class="flow-arrow">→</div>
        
        <div class="flow-step" [class.active]="true">
          <div class="step-icon">📋</div>
          <div class="step-content">
            <h3>PICK_LIST_CREATED</h3>
            <p>RDC staff generates pick list</p>
          </div>
        </div>
        
        <div class="flow-arrow">→</div>
        
        <div class="flow-step" [class.active]="true">
          <div class="step-icon">🚛</div>
          <div class="step-content">
            <h3>ASSIGNED_TO_ROUTE</h3>
            <p>Logistics assigns to delivery route</p>
          </div>
        </div>
        
        <div class="flow-arrow">→</div>
        
        <div class="flow-step" [class.active]="true">
          <div class="step-icon">🚀</div>
          <div class="step-content">
            <h3>OUT_FOR_DELIVERY</h3>
            <p>Route dispatched for delivery</p>
          </div>
        </div>
        
        <div class="flow-arrow">→</div>
        
        <div class="flow-step" [class.active]="true">
          <div class="step-icon">✅</div>
          <div class="step-content">
            <h3>DELIVERED</h3>
            <p>Order delivered to customer</p>
          </div>
        </div>
      </div>

      <div class="orders-list">
        <h2>Current Orders</h2>
        <div class="order-card" *ngFor="let order of orders">
          <div class="order-header">
            <h3>{{order.orderCode}}</h3>
            <span class="status-badge" [class]="'status-' + order.status.toLowerCase().replace('_', '-')">
              {{order.status.replace('_', ' ')}}
            </span>
          </div>
          <div class="order-details">
            <p><strong>Customer:</strong> {{order.customer?.firstName}} {{order.customer?.lastName}}</p>
            <p><strong>Amount:</strong> LKR {{order.totalAmount | number:'1.2-2'}}</p>
            <p><strong>RDC:</strong> {{order.rdcLocation}}</p>
            <p *ngIf="order.deliveryRoute"><strong>Route:</strong> {{order.deliveryRoute.routeName}}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-tracking { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .status-flow { display: flex; align-items: center; justify-content: center; margin: 40px 0; flex-wrap: wrap; gap: 20px; }
    .flow-step { text-align: center; min-width: 150px; }
    .step-icon { font-size: 2rem; margin-bottom: 10px; }
    .step-content h3 { margin: 10px 0 5px 0; font-size: 14px; color: #333; }
    .step-content p { margin: 0; font-size: 12px; color: #666; }
    .flow-arrow { font-size: 1.5rem; color: #007bff; }
    .orders-list { margin-top: 40px; }
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; background: white; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-confirmed { background: #d4edda; color: #155724; }
    .status-pick-list-created { background: #fff3cd; color: #856404; }
    .status-assigned-to-route { background: #cce5ff; color: #004085; }
    .status-out-for-delivery { background: #f8d7da; color: #721c24; }
    .status-delivered { background: #d1ecf1; color: #0c5460; }
    .order-details p { margin: 4px 0; font-size: 14px; }
  `]
})
export class OrderStatusTrackingComponent implements OnInit {
  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.http.get<any[]>(`${environment.apiUrl}/orders`).subscribe({
      next: (orders) => this.orders = orders,
      error: () => this.orders = []
    });
  }
}