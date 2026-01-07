import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdc-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rdc-orders fade-in">
      <div class="orders-header">
        <h1>Order Processing</h1>
        <div class="filters">
          <select [(ngModel)]="statusFilter" (change)="filterOrders()">
            <option value="">All Orders</option>
            <option value="NEW">New Orders</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PACKED">Packed</option>
            <option value="READY">Ready for Dispatch</option>
          </select>
        </div>
      </div>

      <div class="orders-grid">
        <div class="order-card" *ngFor="let order of filteredOrders" [class]="'status-' + order.status.toLowerCase()">
          <div class="order-header">
            <div class="order-id">
              <h3>Order #{{order.id}}</h3>
              <span class="order-date">{{formatDate(order.orderDate)}}</span>
            </div>
            <span class="status-badge" [class]="order.status.toLowerCase()">{{order.status}}</span>
          </div>

          <div class="customer-info">
            <h4>{{order.customerName}}</h4>
            <p>{{order.deliveryAddress}}</p>
            <p>Phone: {{order.customerPhone}}</p>
          </div>

          <div class="order-items">
            <h4>Items ({{order.items.length}})</h4>
            <div class="items-list">
              <div class="item" *ngFor="let item of order.items">
                <span>{{item.productName}} x {{item.quantity}}</span>
                <span>Rs. {{item.totalPrice}}</span>
              </div>
            </div>
            <div class="order-total">
              <strong>Total: Rs. {{order.totalAmount}}</strong>
            </div>
          </div>

          <div class="order-actions">
            <button class="accept-btn" *ngIf="order.status === 'NEW'" (click)="acceptOrder(order)">Accept</button>
            <button class="reject-btn" *ngIf="order.status === 'NEW'" (click)="rejectOrder(order)">Reject</button>
            <button class="pack-btn" *ngIf="order.status === 'ACCEPTED'" (click)="markAsPacked(order)">Mark as Packed</button>
            <button class="ready-btn" *ngIf="order.status === 'PACKED'" (click)="markAsReady(order)">Ready for Dispatch</button>
            <button class="view-btn" (click)="viewOrderDetails(order)">View Details</button>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredOrders.length === 0">
        <h3>No orders found</h3>
        <p>No orders match the current filter criteria.</p>
      </div>
    </div>
  `,
  styles: [`
    .rdc-orders { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .orders-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .filters select { padding: 12px; border: 1px solid var(--gray-300); border-radius: var(--border-radius-md); }
    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 24px; }
    .order-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 24px; border-left: 4px solid; }
    .order-card.status-new { border-color: var(--blue-500); }
    .order-card.status-accepted { border-color: var(--green-500); }
    .order-card.status-packed { border-color: var(--purple-500); }
    .order-card.status-ready { border-color: var(--orange-500); }
    .order-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .order-id h3 { margin: 0 0 4px 0; }
    .order-date { font-size: 12px; color: var(--gray-500); }
    .status-badge { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.new { background: var(--blue-100); color: var(--blue-600); }
    .status-badge.accepted { background: var(--green-100); color: var(--green-600); }
    .status-badge.packed { background: var(--purple-100); color: var(--purple-600); }
    .status-badge.ready { background: var(--orange-100); color: var(--orange-600); }
    .customer-info { margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid var(--gray-200); }
    .customer-info h4 { margin: 0 0 8px 0; }
    .customer-info p { margin: 4px 0; color: var(--gray-600); font-size: 14px; }
    .order-items h4 { margin: 0 0 12px 0; }
    .items-list { margin-bottom: 12px; }
    .item { display: flex; justify-content: space-between; padding: 4px 0; font-size: 14px; }
    .order-total { padding-top: 8px; border-top: 1px solid var(--gray-200); }
    .order-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
    .order-actions button { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 12px; font-weight: 600; }
    .accept-btn { background: var(--green-500); color: white; }
    .reject-btn { background: var(--red-500); color: white; }
    .pack-btn { background: var(--purple-500); color: white; }
    .ready-btn { background: var(--orange-500); color: white; }
    .view-btn { background: var(--gray-100); color: var(--gray-700); }
    .empty-state { text-align: center; padding: 80px 40px; }
  `]
})
export class RdcOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  statusFilter = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Mock data - replace with actual API call
    this.orders = [
      {
        id: 1001,
        customerName: 'ABC Store',
        customerPhone: '+94 77 123 4567',
        deliveryAddress: '123 Main St, Colombo 03',
        orderDate: new Date('2024-01-20'),
        status: 'NEW',
        totalAmount: 2500,
        items: [
          { productName: 'Product A', quantity: 2, totalPrice: 1000 },
          { productName: 'Product B', quantity: 3, totalPrice: 1500 }
        ]
      },
      {
        id: 1002,
        customerName: 'XYZ Mart',
        customerPhone: '+94 77 987 6543',
        deliveryAddress: '456 High St, Colombo 07',
        orderDate: new Date('2024-01-21'),
        status: 'ACCEPTED',
        totalAmount: 1800,
        items: [
          { productName: 'Product C', quantity: 1, totalPrice: 800 },
          { productName: 'Product D', quantity: 2, totalPrice: 1000 }
        ]
      }
    ];
    this.filteredOrders = [...this.orders];
  }

  filterOrders() {
    if (this.statusFilter) {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    } else {
      this.filteredOrders = [...this.orders];
    }
  }

  acceptOrder(order: any) {
    Swal.fire({
      title: 'Accept Order?',
      text: `Accept order #${order.id} from ${order.customerName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Accept'
    }).then((result) => {
      if (result.isConfirmed) {
        order.status = 'ACCEPTED';
        Swal.fire('Accepted!', 'Order has been accepted.', 'success');
      }
    });
  }

  rejectOrder(order: any) {
    Swal.fire({
      title: 'Reject Order?',
      input: 'textarea',
      inputLabel: 'Reason for rejection',
      inputPlaceholder: 'Enter reason...',
      showCancelButton: true,
      confirmButtonText: 'Reject'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        order.status = 'REJECTED';
        order.rejectionReason = result.value;
        Swal.fire('Rejected!', 'Order has been rejected.', 'success');
      }
    });
  }

  markAsPacked(order: any) {
    order.status = 'PACKED';
    Swal.fire('Updated!', 'Order marked as packed.', 'success');
  }

  markAsReady(order: any) {
    order.status = 'READY';
    Swal.fire('Updated!', 'Order is ready for dispatch.', 'success');
  }

  viewOrderDetails(order: any) {
    Swal.fire({
      title: `Order #${order.id} Details`,
      html: `
        <div style="text-align: left;">
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Address:</strong> ${order.deliveryAddress}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> Rs. ${order.totalAmount}</p>
        </div>
      `,
      width: 600
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}