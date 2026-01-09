import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-delivery-confirmation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="delivery-confirmation">
      <h1>📦 Delivery Confirmation</h1>
      
      <div class="route-info" *ngIf="currentRoute">
        <h2>Route: {{currentRoute.routeName}}</h2>
        <p><strong>Driver:</strong> {{currentRoute.driverName}}</p>
        <p><strong>Vehicle:</strong> {{currentRoute.vehicleNumber}}</p>
      </div>

      <div class="deliveries-list">
        <div *ngIf="pendingDeliveries.length === 0" class="no-deliveries">
          <p>No deliveries pending confirmation.</p>
        </div>
        <div *ngFor="let delivery of pendingDeliveries" class="delivery-card">
          <div class="delivery-header">
            <h3>{{delivery.orderCode}}</h3>
            <span class="status-badge" [class]="'status-' + delivery.status.toLowerCase().replace('_', '-')">
              {{delivery.status.replace('_', ' ')}}
            </span>
          </div>
          
          <div class="delivery-details">
            <p><strong>Customer:</strong> {{delivery.customerName}}</p>
            <p><strong>Store:</strong> {{delivery.storeName}}</p>
            <p><strong>Address:</strong> {{delivery.deliveryAddress}}</p>
            <p><strong>Phone:</strong> {{delivery.customerPhone}}</p>
            <p><strong>Amount:</strong> LKR {{delivery.totalAmount | number:'1.2-2'}}</p>
          </div>

          <div class="delivery-actions" *ngIf="delivery.status === 'OUT_FOR_DELIVERY'">
            <button class="confirm-btn" (click)="confirmDelivery(delivery)">
              ✅ Confirm Delivery
            </button>
            <button class="issue-btn" (click)="reportIssue(delivery)">
              ⚠️ Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .delivery-confirmation { padding: 20px; max-width: 800px; margin: 0 auto; }
    .route-info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .deliveries-list { display: grid; gap: 15px; }
    .delivery-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .delivery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-out-for-delivery { background: #fff3cd; color: #856404; }
    .no-deliveries { text-align: center; padding: 40px; color: #666; }
    .status-delivered { background: #d4edda; color: #155724; }
    .delivery-details p { margin: 4px 0; }
    .delivery-actions { margin-top: 15px; display: flex; gap: 10px; }
    .confirm-btn { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .issue-btn { padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class DeliveryConfirmationComponent implements OnInit {
  currentRoute: any = null;
  pendingDeliveries: any[] = [];

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadAllDeliveries();
  }

  loadAllDeliveries() {
    // Load all OUT_FOR_DELIVERY orders directly
    this.http.get<any[]>(`${environment.apiUrl}/orders/status/OUT_FOR_DELIVERY`).subscribe({
      next: (orders) => {
        this.pendingDeliveries = orders;
        console.log('Loaded deliveries:', orders);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading deliveries:', error);
        this.pendingDeliveries = [];
        this.cdr.detectChanges();
      }
    });
  }

  confirmDelivery(delivery: any) {
    Swal.fire({
      title: 'Confirm Delivery',
      html: `
        <select id="paymentMethod" class="swal2-select">
          <option value="CASH">Cash Payment</option>
          <option value="CHEQUE">Cheque Payment</option>
          <option value="CREDIT">Credit Payment</option>
        </select>
        <input id="amountReceived" class="swal2-input" type="number" placeholder="Amount Received" value="${delivery.totalAmount}">
        <textarea id="notes" class="swal2-textarea" placeholder="Delivery notes (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Delivery'
    }).then((result) => {
      if (result.isConfirmed) {
        const paymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement).value;
        const amountReceived = parseFloat((document.getElementById('amountReceived') as HTMLInputElement).value);
        const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;

        this.http.post(`${environment.apiUrl}/orders/${delivery.id}/deliver`, {
          paymentMethod,
          amountReceived,
          notes
        }).subscribe({
          next: () => {
            Swal.fire('Delivered!', 'Delivery confirmed successfully', 'success');
            this.loadAllDeliveries();
          },
          error: () => {
            Swal.fire('Error', 'Failed to confirm delivery', 'error');
          }
        });
      }
    });
  }

  reportIssue(delivery: any) {
    Swal.fire({
      title: 'Report Delivery Issue',
      html: `
        <select id="issueType" class="swal2-select">
          <option value="CUSTOMER_NOT_AVAILABLE">Customer Not Available</option>
          <option value="WRONG_ADDRESS">Wrong Address</option>
          <option value="PAYMENT_ISSUE">Payment Issue</option>
          <option value="DAMAGED_GOODS">Damaged Goods</option>
          <option value="OTHER">Other</option>
        </select>
        <textarea id="issueNotes" class="swal2-textarea" placeholder="Issue details" required></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Report Issue'
    }).then((result) => {
      if (result.isConfirmed) {
        const issueType = (document.getElementById('issueType') as HTMLSelectElement).value;
        const issueNotes = (document.getElementById('issueNotes') as HTMLTextAreaElement).value;

        this.http.post(`${environment.apiUrl}/orders/${delivery.id}/issue`, {
          issueType,
          issueNotes
        }).subscribe({
          next: () => {
            Swal.fire('Reported!', 'Issue reported successfully', 'success');
            this.loadAllDeliveries();
          },
          error: () => {
            Swal.fire('Error', 'Failed to report issue', 'error');
          }
        });
      }
    });
  }
}