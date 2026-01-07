import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { DeliveryService } from '../../core/services/delivery.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [OrderService, DeliveryService],
  template: `
    <div class="tracking-container">
      <h1>📋 My Orders & Tracking</h1>
      
      <div class="orders-list">
        <div *ngFor="let order of orders" class="order-card" 
             [ngClass]="'status-' + order.status.toLowerCase()">
          <div class="order-header">
            <h3>Order #{{order.id}}</h3>
            <span class="status-badge">{{order.status}}</span>
          </div>
          
          <div class="order-details">
            <p><strong>Date:</strong> {{formatDate(order.orderDate)}}</p>
            <p><strong>Total:</strong> \${{order.totalAmount}}</p>
            <p><strong>RDC:</strong> {{order.rdcLocation}}</p>
            <p><strong>Delivery Address:</strong> {{order.deliveryAddress}}</p>
            <p *ngIf="order.deliveryDate"><strong>Delivered:</strong> {{formatDate(order.deliveryDate)}}</p>
          </div>

          <div class="order-items">
            <h4>Items:</h4>
            <div *ngFor="let item of order.orderItems" class="order-item">
              <span>{{item.product.name}} × {{item.quantity}}</span>
              <span>\${{item.totalPrice}}</span>
            </div>
          </div>

          <div class="tracking-info" *ngIf="order.status === 'SHIPPED' || order.status === 'DELIVERED'">
            <h4>🚚 Delivery Tracking:</h4>
            <div class="tracking-steps">
              <div class="step" [ngClass]="{'active': isStepActive('CONFIRMED', order.status)}">
                <span class="step-icon">✓</span>
                <span>Order Confirmed</span>
              </div>
              <div class="step" [ngClass]="{'active': isStepActive('PROCESSING', order.status)}">
                <span class="step-icon">📦</span>
                <span>Processing</span>
              </div>
              <div class="step" [ngClass]="{'active': isStepActive('SHIPPED', order.status)}">
                <span class="step-icon">🚚</span>
                <span>Shipped</span>
              </div>
              <div class="step" [ngClass]="{'active': isStepActive('DELIVERED', order.status)}">
                <span class="step-icon">🏠</span>
                <span>Delivered</span>
              </div>
            </div>
            <div class="delivery-actions" *ngIf="order.status === 'SHIPPED'">
              <a [routerLink]="['/delivery-status', order.id]" class="track-delivery-btn">🗺️ Track Live Delivery</a>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="orders.length === 0" class="no-orders">
        <p>You haven't placed any orders yet.</p>
        <a routerLink="/orders/place" class="btn btn-primary">Place Your First Order</a>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container { padding: 20px; }
    .orders-list { display: grid; gap: 20px; }
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .order-card.status-pending { border-left: 4px solid #f39c12; }
    .order-card.status-confirmed { border-left: 4px solid #3498db; }
    .order-card.status-processing { border-left: 4px solid #9b59b6; }
    .order-card.status-shipped { border-left: 4px solid #e67e22; }
    .order-card.status-delivered { border-left: 4px solid #27ae60; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #ecf0f1; color: #2c3e50; }
    .order-details p { margin: 5px 0; }
    .order-items { margin: 15px 0; }
    .order-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
    .tracking-info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
    .tracking-steps { display: flex; justify-content: space-between; margin-top: 15px; }
    .step { display: flex; flex-direction: column; align-items: center; opacity: 0.5; }
    .step.active { opacity: 1; color: #27ae60; }
    .step-icon { font-size: 24px; margin-bottom: 5px; }
    .delivery-actions { margin-top: 15px; text-align: center; }
    .track-delivery-btn { padding: 10px 20px; background: #e67e22; color: white; text-decoration: none; border-radius: 4px; display: inline-block; }
    .no-orders { text-align: center; padding: 40px; }
    .btn { padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 4px; display: inline-block; }
  `]
})
export class OrderTrackingComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private deliveryService: DeliveryService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadCustomerOrders();
  }

  loadCustomerOrders() {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    if (userInfo.id) {
      this.orderService.getOrdersByCustomer(userInfo.id).subscribe({
        next: (orders) => this.orders = orders,
        error: (error) => console.error('Error loading orders:', error)
      });
    }
  }

  isStepActive(step: string, currentStatus: string): boolean {
    const steps = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
    const stepIndex = steps.indexOf(step);
    const currentIndex = steps.indexOf(currentStatus);
    return stepIndex <= currentIndex;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}