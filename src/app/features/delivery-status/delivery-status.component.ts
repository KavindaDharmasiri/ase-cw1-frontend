import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-delivery-status',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="delivery-container fade-in">
      <h1>Delivery Tracking</h1>
      
      <div class="delivery-card" *ngIf="delivery">
        <div class="delivery-header">
          <h2>Order #{{delivery.orderId}}</h2>
          <span class="status-badge" [class]="delivery.status.toLowerCase()">{{delivery.status}}</span>
        </div>

        <div class="tracking-timeline">
          <div class="timeline-item" [class.completed]="isStepCompleted('PLACED')">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Order Placed</h4>
              <p>{{formatDate(delivery.orderDate)}}</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStepCompleted('ACCEPTED')">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Order Accepted</h4>
              <p *ngIf="delivery.acceptedDate">{{formatDate(delivery.acceptedDate)}}</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStepCompleted('PACKED')">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Order Packed</h4>
              <p *ngIf="delivery.packedDate">{{formatDate(delivery.packedDate)}}</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStepCompleted('OUT_FOR_DELIVERY')">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Out for Delivery</h4>
              <p *ngIf="delivery.shippedDate">{{formatDate(delivery.shippedDate)}}</p>
              <p *ngIf="delivery.driverName">Driver: {{delivery.driverName}}</p>
              <p *ngIf="delivery.driverPhone">Phone: {{delivery.driverPhone}}</p>
            </div>
          </div>
          <div class="timeline-item" [class.completed]="isStepCompleted('DELIVERED')">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <h4>Delivered</h4>
              <p *ngIf="delivery.deliveredDate">{{formatDate(delivery.deliveredDate)}}</p>
            </div>
          </div>
        </div>

        <div class="delivery-info">
          <div class="info-section">
            <h3>Delivery Details</h3>
            <p><strong>Estimated Delivery:</strong> {{formatDate(delivery.estimatedDelivery)}}</p>
            <p><strong>Delivery Address:</strong> {{delivery.deliveryAddress}}</p>
            <p *ngIf="delivery.trackingNumber"><strong>Tracking Number:</strong> {{delivery.trackingNumber}}</p>
          </div>
          
          <div class="driver-info" *ngIf="delivery.status === 'OUT_FOR_DELIVERY'">
            <h3>Driver Information</h3>
            <p><strong>Name:</strong> {{delivery.driverName}}</p>
            <p><strong>Phone:</strong> {{delivery.driverPhone}}</p>
            <p><strong>Vehicle:</strong> {{delivery.vehicleNumber}}</p>
            <button class="contact-driver" (click)="contactDriver()">Contact Driver</button>
          </div>
        </div>

        <div class="live-tracking" *ngIf="delivery.status === 'OUT_FOR_DELIVERY'">
          <h3>Live Location</h3>
          <div class="map-placeholder">
            <p>🗺️ Live tracking map would appear here</p>
            <p>Current location: {{delivery.currentLocation}}</p>
          </div>
        </div>
      </div>

      <div class="no-delivery" *ngIf="!delivery">
        <h2>Delivery not found</h2>
        <p>Please check your order number and try again.</p>
      </div>
    </div>
  `,
  styles: [`
    .delivery-container { padding: 40px; max-width: 800px; margin: 0 auto; }
    .delivery-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 32px; }
    .delivery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .status-badge { padding: 8px 16px; border-radius: 20px; font-weight: 600; text-transform: uppercase; }
    .status-badge.placed { background: var(--blue-100); color: var(--primary-blue); }
    .status-badge.accepted { background: var(--yellow-100); color: var(--yellow-600); }
    .status-badge.packed { background: var(--purple-100); color: var(--purple-600); }
    .status-badge.out_for_delivery { background: var(--orange-100); color: var(--orange-600); }
    .status-badge.delivered { background: var(--green-100); color: var(--secondary-green); }
    .tracking-timeline { margin-bottom: 32px; }
    .timeline-item { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 24px; position: relative; }
    .timeline-item:not(:last-child)::after { content: ''; position: absolute; left: 12px; top: 32px; width: 2px; height: 24px; background: var(--gray-300); }
    .timeline-item.completed::after { background: var(--secondary-green); }
    .timeline-dot { width: 24px; height: 24px; border-radius: 50%; background: var(--gray-300); border: 3px solid white; box-shadow: 0 0 0 2px var(--gray-300); }
    .timeline-item.completed .timeline-dot { background: var(--secondary-green); box-shadow: 0 0 0 2px var(--secondary-green); }
    .timeline-content h4 { margin: 0 0 4px 0; color: var(--gray-800); }
    .timeline-content p { margin: 0; color: var(--gray-600); font-size: 14px; }
    .delivery-info { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
    .info-section, .driver-info { padding: 20px; background: var(--gray-50); border-radius: var(--border-radius-md); }
    .info-section h3, .driver-info h3 { margin: 0 0 16px 0; color: var(--gray-800); }
    .info-section p, .driver-info p { margin: 8px 0; }
    .contact-driver { margin-top: 16px; padding: 8px 16px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .live-tracking { padding: 20px; background: var(--blue-50); border-radius: var(--border-radius-md); }
    .map-placeholder { text-align: center; padding: 40px; background: white; border-radius: var(--border-radius-md); border: 2px dashed var(--gray-300); }
    .no-delivery { text-align: center; padding: 80px 40px; }
  `]
})
export class DeliveryStatusComponent implements OnInit {
  delivery: any = null;
  orderId: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.orderId = params['orderId'];
      this.loadDeliveryStatus();
    });
  }

  loadDeliveryStatus() {
    // Mock delivery data - replace with actual API call
    this.delivery = {
      orderId: this.orderId,
      status: 'OUT_FOR_DELIVERY',
      orderDate: new Date('2024-01-15'),
      acceptedDate: new Date('2024-01-15T10:30:00'),
      packedDate: new Date('2024-01-16T09:00:00'),
      shippedDate: new Date('2024-01-16T14:00:00'),
      estimatedDelivery: new Date('2024-01-17T16:00:00'),
      deliveryAddress: '123 Main Street, Colombo 03',
      trackingNumber: 'TRK123456789',
      driverName: 'Kamal Perera',
      driverPhone: '+94 77 123 4567',
      vehicleNumber: 'CAB-1234',
      currentLocation: 'Near Galle Road Junction'
    };
  }

  isStepCompleted(step: string): boolean {
    const steps = ['PLACED', 'ACCEPTED', 'PACKED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    const currentIndex = steps.indexOf(this.delivery?.status);
    const stepIndex = steps.indexOf(step);
    return stepIndex <= currentIndex;
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  contactDriver() {
    window.open(`tel:${this.delivery.driverPhone}`);
  }
}