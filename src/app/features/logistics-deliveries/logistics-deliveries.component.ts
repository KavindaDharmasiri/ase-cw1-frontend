import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-logistics-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="logistics-deliveries fade-in">
      <div class="deliveries-header">
        <h1>Delivery Execution</h1>
        <div class="header-actions">
          <button class="start-trip-btn" (click)="startDeliveryTrip()" [disabled]="!selectedRoute">Start Trip</button>
          <select [(ngModel)]="selectedRoute" class="route-selector">
            <option value="">Select Route</option>
            <option *ngFor="let route of assignedRoutes" [value]="route.id">{{route.name}}</option>
          </select>
        </div>
      </div>

      <div class="delivery-status" *ngIf="activeTrip">
        <div class="status-card">
          <h2>Active Trip: {{activeTrip.routeName}}</h2>
          <div class="trip-progress">
            <div class="progress-bar">
              <div class="progress" [style.width.%]="activeTrip.progress"></div>
            </div>
            <span>{{activeTrip.completedDeliveries}}/{{activeTrip.totalDeliveries}} deliveries completed</span>
          </div>
          <div class="trip-actions">
            <button class="pause-btn" (click)="pauseTrip()">Pause Trip</button>
            <button class="emergency-btn" (click)="reportEmergency()">Emergency</button>
          </div>
        </div>
      </div>

      <div class="deliveries-list">
        <div class="delivery-card" *ngFor="let delivery of deliveries" [class]="'status-' + delivery.status.toLowerCase()">
          <div class="delivery-header">
            <div class="delivery-info">
              <h3>Order #{{delivery.orderId}}</h3>
              <p class="customer">{{delivery.customerName}}</p>
              <p class="address">{{delivery.address}}</p>
            </div>
            <div class="delivery-status">
              <span class="status-badge" [class]="delivery.status.toLowerCase()">{{delivery.status}}</span>
              <div class="delivery-time" *ngIf="delivery.estimatedTime">
                ETA: {{delivery.estimatedTime}}
              </div>
            </div>
          </div>

          <div class="delivery-details">
            <div class="order-items">
              <h4>Items ({{delivery.items.length}})</h4>
              <div class="items-list">
                <div class="item" *ngFor="let item of delivery.items">
                  <span>{{item.name}} x {{item.quantity}}</span>
                  <span>{{item.weight}} kg</span>
                </div>
              </div>
            </div>
            <div class="delivery-notes" *ngIf="delivery.notes">
              <h4>Special Instructions</h4>
              <p>{{delivery.notes}}</p>
            </div>
          </div>

          <div class="delivery-actions">
            <button class="navigate-btn" *ngIf="delivery.status === 'DISPATCHED'" (click)="navigateToAddress(delivery)">Navigate</button>
            <button class="arrived-btn" *ngIf="delivery.status === 'IN_TRANSIT'" (click)="markAsArrived(delivery)">Mark Arrived</button>
            <button class="deliver-btn" *ngIf="delivery.status === 'ARRIVED'" (click)="completeDelivery(delivery)">Complete Delivery</button>
            <button class="failed-btn" *ngIf="delivery.status !== 'DELIVERED' && delivery.status !== 'FAILED'" (click)="markAsFailed(delivery)">Mark Failed</button>
            <button class="collect-payment-btn" *ngIf="delivery.paymentMethod === 'COD' && delivery.status === 'ARRIVED'" (click)="collectPayment(delivery)">Collect Payment</button>
          </div>

          <div class="proof-of-delivery" *ngIf="delivery.status === 'DELIVERED'">
            <h4>Proof of Delivery</h4>
            <div class="pod-details">
              <p><strong>Delivered at:</strong> {{formatDateTime(delivery.deliveredAt)}}</p>
              <p><strong>Received by:</strong> {{delivery.receivedBy}}</p>
              <p *ngIf="delivery.signature"><strong>Signature:</strong> ✓ Captured</p>
              <p *ngIf="delivery.photo"><strong>Photo:</strong> ✓ Captured</p>
            </div>
          </div>
        </div>
      </div>

      <div class="trip-summary" *ngIf="activeTrip">
        <h2>Trip Summary</h2>
        <div class="summary-stats">
          <div class="stat">
            <span class="label">Distance Traveled</span>
            <span class="value">{{activeTrip.distanceTraveled}} km</span>
          </div>
          <div class="stat">
            <span class="label">Time Elapsed</span>
            <span class="value">{{activeTrip.timeElapsed}}</span>
          </div>
          <div class="stat">
            <span class="label">Fuel Used</span>
            <span class="value">{{activeTrip.fuelUsed}} L</span>
          </div>
          <div class="stat">
            <span class="label">Cash Collected</span>
            <span class="value">Rs. {{activeTrip.cashCollected | number}}</span>
          </div>
        </div>
        <button class="end-trip-btn" (click)="endTrip()" *ngIf="activeTrip.completedDeliveries === activeTrip.totalDeliveries">End Trip</button>
      </div>
    </div>
  `,
  styles: [`
    .logistics-deliveries { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .deliveries-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .header-actions { display: flex; gap: 12px; align-items: center; }
    .start-trip-btn { padding: 12px 24px; background: var(--green-500); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .start-trip-btn:disabled { background: var(--gray-400); cursor: not-allowed; }
    .route-selector { padding: 12px; border: 1px solid var(--gray-300); border-radius: var(--border-radius-md); }
    .delivery-status { margin-bottom: 32px; }
    .status-card { background: var(--blue-50); border: 1px solid var(--blue-200); border-radius: var(--border-radius-lg); padding: 24px; }
    .trip-progress { margin: 16px 0; }
    .progress-bar { width: 100%; height: 12px; background: var(--gray-200); border-radius: 6px; overflow: hidden; margin-bottom: 8px; }
    .progress { height: 100%; background: var(--green-500); transition: width 0.3s ease; }
    .trip-actions { display: flex; gap: 12px; margin-top: 16px; }
    .pause-btn { background: var(--yellow-500); color: white; padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .emergency-btn { background: var(--red-500); color: white; padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .deliveries-list { display: grid; gap: 24px; margin-bottom: 32px; }
    .delivery-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 24px; border-left: 4px solid; }
    .delivery-card.status-dispatched { border-color: var(--blue-500); }
    .delivery-card.status-in_transit { border-color: var(--yellow-500); }
    .delivery-card.status-arrived { border-color: var(--orange-500); }
    .delivery-card.status-delivered { border-color: var(--green-500); }
    .delivery-card.status-failed { border-color: var(--red-500); }
    .delivery-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .delivery-info h3 { margin: 0 0 8px 0; }
    .customer { margin: 4px 0; font-weight: 600; }
    .address { margin: 4px 0; color: var(--gray-600); }
    .status-badge { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.dispatched { background: var(--blue-100); color: var(--blue-600); }
    .status-badge.in_transit { background: var(--yellow-100); color: var(--yellow-600); }
    .status-badge.arrived { background: var(--orange-100); color: var(--orange-600); }
    .status-badge.delivered { background: var(--green-100); color: var(--green-600); }
    .status-badge.failed { background: var(--red-100); color: var(--red-600); }
    .delivery-time { font-size: 12px; color: var(--gray-600); margin-top: 4px; }
    .delivery-details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 16px; }
    .order-items h4, .delivery-notes h4 { margin: 0 0 12px 0; font-size: 14px; }
    .items-list { font-size: 14px; }
    .item { display: flex; justify-content: space-between; margin-bottom: 4px; }
    .delivery-notes p { margin: 0; font-size: 14px; color: var(--gray-600); }
    .delivery-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
    .delivery-actions button { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 12px; }
    .navigate-btn { background: var(--blue-500); color: white; }
    .arrived-btn { background: var(--orange-500); color: white; }
    .deliver-btn { background: var(--green-500); color: white; }
    .failed-btn { background: var(--red-500); color: white; }
    .collect-payment-btn { background: var(--purple-500); color: white; }
    .proof-of-delivery { background: var(--green-50); padding: 16px; border-radius: var(--border-radius-md); }
    .proof-of-delivery h4 { margin: 0 0 12px 0; }
    .pod-details p { margin: 4px 0; font-size: 14px; }
    .trip-summary { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .summary-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
    .stat { text-align: center; }
    .stat .label { display: block; font-size: 12px; color: var(--gray-600); margin-bottom: 4px; }
    .stat .value { display: block; font-size: 20px; font-weight: 700; color: var(--primary-blue); }
    .end-trip-btn { width: 100%; padding: 16px; background: var(--green-500); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 16px; font-weight: 600; }
  `]
})
export class LogisticsDeliveriesComponent implements OnInit {
  selectedRoute = '';
  assignedRoutes: any[] = [];
  deliveries: any[] = [];
  activeTrip: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDeliveriesData();
  }

  loadDeliveriesData() {
    // Mock data
    this.assignedRoutes = [
      { id: 1, name: 'Route A - Central' },
      { id: 2, name: 'Route B - North' }
    ];

    this.deliveries = [
      {
        id: 1,
        orderId: 1001,
        customerName: 'ABC Store',
        address: '123 Main St, Colombo 03',
        status: 'DISPATCHED',
        estimatedTime: '10:30 AM',
        paymentMethod: 'COD',
        items: [
          { name: 'Product A', quantity: 2, weight: 5 },
          { name: 'Product B', quantity: 1, weight: 3 }
        ],
        notes: 'Call before delivery'
      },
      {
        id: 2,
        orderId: 1002,
        customerName: 'XYZ Mart',
        address: '456 High St, Colombo 07',
        status: 'DELIVERED',
        deliveredAt: new Date(),
        receivedBy: 'Manager',
        signature: true,
        photo: true,
        items: [
          { name: 'Product C', quantity: 3, weight: 8 }
        ]
      }
    ];
  }

  startDeliveryTrip() {
    if (!this.selectedRoute) return;

    const route = this.assignedRoutes.find(r => r.id == this.selectedRoute);
    this.activeTrip = {
      routeName: route.name,
      totalDeliveries: this.deliveries.length,
      completedDeliveries: this.deliveries.filter(d => d.status === 'DELIVERED').length,
      progress: 0,
      distanceTraveled: 0,
      timeElapsed: '0h 0m',
      fuelUsed: 0,
      cashCollected: 0
    };

    // Update progress
    this.activeTrip.progress = (this.activeTrip.completedDeliveries / this.activeTrip.totalDeliveries) * 100;

    Swal.fire('Trip Started!', `Delivery trip for ${route.name} has been started.`, 'success');
  }

  pauseTrip() {
    Swal.fire('Trip Paused', 'Delivery trip has been paused.', 'info');
  }

  reportEmergency() {
    Swal.fire({
      title: 'Report Emergency',
      input: 'textarea',
      inputLabel: 'Emergency Details',
      inputPlaceholder: 'Describe the emergency...',
      showCancelButton: true,
      confirmButtonText: 'Report Emergency'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire('Emergency Reported!', 'Emergency has been reported to dispatch center.', 'warning');
      }
    });
  }

  navigateToAddress(delivery: any) {
    // Simulate GPS navigation
    delivery.status = 'IN_TRANSIT';
    Swal.fire('Navigation Started', `GPS navigation to ${delivery.address} has been started.`, 'info');
  }

  markAsArrived(delivery: any) {
    delivery.status = 'ARRIVED';
    Swal.fire('Arrived!', `Marked as arrived at ${delivery.customerName}.`, 'success');
  }

  completeDelivery(delivery: any) {
    Swal.fire({
      title: 'Complete Delivery',
      html: `
        <input id="receivedBy" class="swal2-input" placeholder="Received by (Name)">
        <label><input type="checkbox" id="signatureCaptured"> Signature Captured</label><br>
        <label><input type="checkbox" id="photoCaptured"> Photo Captured</label><br>
        <textarea id="deliveryNotes" class="swal2-textarea" placeholder="Delivery notes (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Complete Delivery',
      preConfirm: () => {
        const receivedBy = (document.getElementById('receivedBy') as HTMLInputElement).value;
        const signature = (document.getElementById('signatureCaptured') as HTMLInputElement).checked;
        const photo = (document.getElementById('photoCaptured') as HTMLInputElement).checked;
        const notes = (document.getElementById('deliveryNotes') as HTMLTextAreaElement).value;
        
        if (!receivedBy) {
          Swal.showValidationMessage('Received by name is required');
          return false;
        }
        
        return { receivedBy, signature, photo, notes };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        delivery.status = 'DELIVERED';
        delivery.deliveredAt = new Date();
        delivery.receivedBy = result.value.receivedBy;
        delivery.signature = result.value.signature;
        delivery.photo = result.value.photo;
        delivery.deliveryNotes = result.value.notes;
        
        if (this.activeTrip) {
          this.activeTrip.completedDeliveries++;
          this.activeTrip.progress = (this.activeTrip.completedDeliveries / this.activeTrip.totalDeliveries) * 100;
        }
        
        Swal.fire('Delivered!', 'Delivery has been completed successfully.', 'success');
      }
    });
  }

  markAsFailed(delivery: any) {
    Swal.fire({
      title: 'Mark as Failed',
      input: 'select',
      inputOptions: {
        'CUSTOMER_NOT_AVAILABLE': 'Customer Not Available',
        'ADDRESS_NOT_FOUND': 'Address Not Found',
        'REFUSED_DELIVERY': 'Delivery Refused',
        'DAMAGED_GOODS': 'Damaged Goods',
        'OTHER': 'Other'
      },
      inputPlaceholder: 'Select reason',
      showCancelButton: true,
      confirmButtonText: 'Mark as Failed'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        delivery.status = 'FAILED';
        delivery.failureReason = result.value;
        delivery.failedAt = new Date();
        Swal.fire('Marked as Failed', 'Delivery has been marked as failed.', 'error');
      }
    });
  }

  collectPayment(delivery: any) {
    Swal.fire({
      title: 'Collect Payment',
      html: `
        <p><strong>Amount:</strong> Rs. ${delivery.totalAmount || 2500}</p>
        <input id="paymentMethod" class="swal2-input" placeholder="Payment Method" value="Cash">
        <input id="amountReceived" class="swal2-input" type="number" placeholder="Amount Received" value="${delivery.totalAmount || 2500}">
        <input id="reference" class="swal2-input" placeholder="Reference/Receipt Number">
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Payment'
    }).then((result) => {
      if (result.isConfirmed) {
        delivery.paymentCollected = true;
        delivery.paymentMethod = (document.getElementById('paymentMethod') as HTMLInputElement).value;
        delivery.amountReceived = (document.getElementById('amountReceived') as HTMLInputElement).value;
        
        if (this.activeTrip) {
          this.activeTrip.cashCollected += parseFloat(delivery.amountReceived);
        }
        
        Swal.fire('Payment Collected!', 'Payment has been recorded successfully.', 'success');
      }
    });
  }

  endTrip() {
    Swal.fire({
      title: 'End Trip?',
      text: 'Are you sure you want to end this delivery trip?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'End Trip'
    }).then((result) => {
      if (result.isConfirmed) {
        this.activeTrip = null;
        Swal.fire('Trip Ended!', 'Delivery trip has been completed successfully.', 'success');
      }
    });
  }

  formatDateTime(date: Date): string {
    return new Date(date).toLocaleString();
  }
}