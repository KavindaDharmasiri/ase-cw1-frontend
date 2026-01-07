import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-real-time-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="tracking-container">
      <h1>📍 Real-Time Delivery Tracking</h1>
      
      <div class="tracking-search">
        <input type="text" [(ngModel)]="trackingNumber" 
               placeholder="Enter order number..." class="tracking-input">
        <button (click)="trackOrder()" class="btn-track">Track Order</button>
      </div>

      <div *ngIf="currentOrder" class="tracking-info">
        <div class="order-header">
          <h2>Order #{{currentOrder.orderNumber}}</h2>
          <span class="status-badge" [ngClass]="'status-' + currentOrder.status.toLowerCase()">
            {{currentOrder.status}}
          </span>
        </div>

        <div class="tracking-timeline">
          <div *ngFor="let step of trackingSteps" 
               class="timeline-step" 
               [ngClass]="{'completed': step.completed, 'active': step.active}">
            <div class="step-icon">{{step.icon}}</div>
            <div class="step-content">
              <h4>{{step.title}}</h4>
              <p>{{step.description}}</p>
              <small *ngIf="step.timestamp">{{formatDate(step.timestamp)}}</small>
            </div>
          </div>
        </div>

        <div class="delivery-map">
          <div class="map-placeholder">
            <p>🗺️ Live GPS Tracking</p>
            <div class="location-info">
              <p><strong>Current Location:</strong> {{currentOrder.currentLocation}}</p>
              <p><strong>Estimated Delivery:</strong> {{currentOrder.estimatedDelivery}}</p>
              <p><strong>Driver:</strong> {{currentOrder.driverName}}</p>
              <p><strong>Contact:</strong> {{currentOrder.driverPhone}}</p>
            </div>
          </div>
        </div>

        <div class="delivery-updates">
          <h3>Recent Updates</h3>
          <div *ngFor="let update of currentOrder.updates" class="update-item">
            <div class="update-time">{{formatTime(update.timestamp)}}</div>
            <div class="update-message">{{update.message}}</div>
          </div>
        </div>
      </div>

      <div *ngIf="!currentOrder && searchAttempted" class="no-order">
        <p>No order found with that tracking number.</p>
      </div>
    </div>
  `,
  styles: [`
    .tracking-container { padding: 20px; max-width: 800px; margin: 0 auto; }
    .tracking-search { display: flex; gap: 10px; margin-bottom: 30px; }
    .tracking-input { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 6px; }
    .btn-track { background: #3498db; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .status-pending { background: #f39c12; color: white; }
    .status-processing { background: #3498db; color: white; }
    .status-shipped { background: #9b59b6; color: white; }
    .status-delivered { background: #27ae60; color: white; }
    .tracking-timeline { margin-bottom: 30px; }
    .timeline-step { display: flex; align-items: flex-start; gap: 15px; margin-bottom: 20px; padding: 15px; border-radius: 8px; background: #f8f9fa; }
    .timeline-step.completed { background: #d4edda; border-left: 4px solid #27ae60; }
    .timeline-step.active { background: #cce5ff; border-left: 4px solid #3498db; }
    .step-icon { font-size: 24px; min-width: 40px; }
    .step-content h4 { margin-bottom: 5px; color: #333; }
    .step-content p { color: #666; margin-bottom: 5px; }
    .step-content small { color: #999; }
    .delivery-map { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center; }
    .map-placeholder { min-height: 200px; display: flex; flex-direction: column; justify-content: center; }
    .location-info { text-align: left; margin-top: 20px; }
    .location-info p { margin: 8px 0; }
    .delivery-updates h3 { margin-bottom: 15px; }
    .update-item { display: flex; gap: 15px; padding: 10px; border-bottom: 1px solid #eee; }
    .update-time { font-weight: bold; color: #666; min-width: 120px; }
    .update-message { flex: 1; }
    .no-order { text-align: center; padding: 40px; color: #666; }
  `]
})
export class RealTimeTrackingComponent implements OnInit, OnDestroy {
  trackingNumber = '';
  currentOrder: any = null;
  searchAttempted = false;
  trackingSteps: any[] = [];

  ngOnInit() {
    this.initializeTrackingSteps();
  }

  ngOnDestroy() {}

  initializeTrackingSteps() {
    this.trackingSteps = [
      {
        icon: '📝',
        title: 'Order Placed',
        description: 'Your order has been received and is being processed',
        completed: false,
        active: false
      },
      {
        icon: '📦',
        title: 'Order Confirmed',
        description: 'Order confirmed and items are being prepared',
        completed: false,
        active: false
      },
      {
        icon: '🚛',
        title: 'Out for Delivery',
        description: 'Your order is on the way',
        completed: false,
        active: false
      },
      {
        icon: '✅',
        title: 'Delivered',
        description: 'Order has been delivered successfully',
        completed: false,
        active: false
      }
    ];
  }

  trackOrder() {
    if (!this.trackingNumber.trim()) return;
    
    this.searchAttempted = true;
    
    this.currentOrder = {
      orderNumber: this.trackingNumber,
      status: 'SHIPPED',
      currentLocation: 'Colombo Distribution Center',
      estimatedDelivery: '2024-01-07 2:00 PM',
      driverName: 'John Silva',
      driverPhone: '+94 77 123 4567',
      updates: [
        {
          timestamp: new Date(Date.now() - 3600000),
          message: 'Package out for delivery'
        },
        {
          timestamp: new Date(Date.now() - 7200000),
          message: 'Package arrived at local facility'
        }
      ]
    };

    this.updateTrackingSteps();
  }

  updateTrackingSteps() {
    const status = this.currentOrder?.status;
    
    switch(status) {
      case 'PROCESSING':
        this.trackingSteps[0].completed = true;
        this.trackingSteps[1].active = true;
        break;
      case 'SHIPPED':
        this.trackingSteps[0].completed = true;
        this.trackingSteps[1].completed = true;
        this.trackingSteps[2].active = true;
        break;
      case 'DELIVERED':
        this.trackingSteps.forEach((step, index) => {
          step.completed = true;
          step.active = index === 3;
        });
        break;
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }

  formatTime(date: string | Date): string {
    return new Date(date).toLocaleTimeString();
  }
}