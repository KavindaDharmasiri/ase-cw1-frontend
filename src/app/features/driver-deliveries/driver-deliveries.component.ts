import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-driver-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="driver-deliveries">
      <div class="header">
        <h1>📦 My Deliveries</h1>
        <div class="driver-info">
          <span>Driver: {{currentDriver}}</span>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>

      <div class="route-info" *ngIf="currentRoute">
        <h2>Route: {{currentRoute.routeName}}</h2>
        <p><strong>Vehicle:</strong> {{currentRoute.vehicleNumber}}</p>
        <p><strong>Status:</strong> {{currentRoute.status}}</p>
      </div>

      <div class="deliveries-list">
        <div *ngFor="let order of deliveries" class="delivery-card">
          <div class="delivery-header">
            <h3>{{order.orderCode}}</h3>
            <span class="status-badge" [class]="'status-' + order.status.toLowerCase().replace('_', '-')">
              {{order.status.replace('_', ' ')}}
            </span>
          </div>
          
          <div class="delivery-details">
            <p><strong>Customer:</strong> {{order.customer?.firstName}} {{order.customer?.lastName}}</p>
            <p><strong>Store:</strong> {{order.storeName}}</p>
            <p><strong>Address:</strong> {{order.deliveryAddress}}</p>
            <p><strong>Phone:</strong> {{order.customerPhone}}</p>
            <p><strong>Amount:</strong> LKR {{order.totalAmount | number:'1.2-2'}}</p>
          </div>

          <div class="delivery-actions" *ngIf="order.status === 'OUT_FOR_DELIVERY'">
            <button class="confirm-btn" (click)="confirmDelivery(order)">
              ✅ Confirm Delivery
            </button>
            <button class="issue-btn" (click)="reportIssue(order)">
              ⚠️ Report Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .driver-deliveries { padding: 20px; max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .driver-info { display: flex; align-items: center; gap: 15px; }
    .logout-btn { padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .route-info { background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .deliveries-list { display: grid; gap: 15px; }
    .delivery-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .delivery-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-out-for-delivery { background: #fff3cd; color: #856404; }
    .status-delivered { background: #d4edda; color: #155724; }
    .delivery-details p { margin: 4px 0; }
    .delivery-actions { margin-top: 15px; display: flex; gap: 10px; }
    .confirm-btn { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .issue-btn { padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class DriverDeliveriesComponent implements OnInit {
  currentDriver = '';
  currentRoute: any = null;
  deliveries: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.currentDriver = localStorage.getItem('currentDriver') || '';
    if (!this.currentDriver) {
      this.router.navigate(['/driver-login']);
      return;
    }
    this.loadDriverRoute();
  }

  loadDriverRoute() {
    this.http.get<any[]>(`${environment.apiUrl}/delivery-routes/driver/${this.currentDriver}`).subscribe({
      next: (routes) => {
        this.currentRoute = routes.find(r => r.status === 'IN_PROGRESS') || routes[0];
        if (this.currentRoute) {
          this.loadDeliveries();
        }
      },
      error: () => {
        this.currentRoute = null;
        this.deliveries = [];
      }
    });
  }

  loadDeliveries() {
    if (!this.currentRoute) return;
    
    this.http.get<any[]>(`${environment.apiUrl}/delivery-routes/${this.currentRoute.id}/orders`).subscribe({
      next: (orders) => {
        this.deliveries = orders.filter(order => 
          order.status === 'OUT_FOR_DELIVERY' || order.status === 'DELIVERED'
        );
      },
      error: () => this.deliveries = []
    });
  }

  confirmDelivery(order: any) {
    Swal.fire({
      title: 'Confirm Delivery',
      html: `
        <select id="paymentMethod" class="swal2-select">
          <option value="CASH">Cash Payment</option>
          <option value="CHEQUE">Cheque Payment</option>
          <option value="CREDIT">Credit Payment</option>
        </select>
        <input id="amountReceived" class="swal2-input" type="number" placeholder="Amount Received" value="${order.totalAmount}">
        <textarea id="notes" class="swal2-textarea" placeholder="Delivery notes (optional)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirm Delivery'
    }).then((result) => {
      if (result.isConfirmed) {
        const paymentMethod = (document.getElementById('paymentMethod') as HTMLSelectElement).value;
        const amountReceived = parseFloat((document.getElementById('amountReceived') as HTMLInputElement).value);
        const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;

        this.http.post(`${environment.apiUrl}/orders/${order.id}/deliver`, {
          paymentMethod,
          amountReceived,
          notes,
          driverName: this.currentDriver
        }).subscribe({
          next: () => {
            Swal.fire('Delivered!', 'Delivery confirmed successfully', 'success');
            this.loadDeliveries();
          },
          error: () => {
            Swal.fire('Error', 'Failed to confirm delivery', 'error');
          }
        });
      }
    });
  }

  reportIssue(order: any) {
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

        this.http.post(`${environment.apiUrl}/orders/${order.id}/issue`, {
          issueType,
          issueNotes,
          driverName: this.currentDriver
        }).subscribe({
          next: () => {
            Swal.fire('Reported!', 'Issue reported successfully', 'success');
            this.loadDeliveries();
          },
          error: () => {
            Swal.fire('Error', 'Failed to report issue', 'error');
          }
        });
      }
    });
  }

  logout() {
    localStorage.removeItem('currentDriver');
    this.router.navigate(['/driver-login']);
  }
}