import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="order-verification">
      <div class="header">
        <h1>📋 Order Verification</h1>
        <div class="stats">
          <span class="stat">Pending: {{pendingOrders.length}}</span>
        </div>
      </div>

      <div class="orders-grid">
        <div *ngIf="pendingOrders.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Pending Orders</h3>
          <p>All orders have been processed.</p>
        </div>
        
        <div *ngFor="let order of pendingOrders; trackBy: trackByOrderId" class="order-card">
          <div class="order-header">
            <h3>{{order.orderNumber}}</h3>
            <span class="payment-badge" [class]="'payment-' + order.paymentType.toLowerCase()">
              {{order.paymentType}}
            </span>
          </div>
          
          <div class="order-info">
            <p><strong>Customer:</strong> {{order.customerName}}</p>
            <p><strong>Total:</strong> LKR {{order.totalAmount | number:'1.2-2'}}</p>
            <p *ngIf="order.paymentType === 'CREDIT'">
              <strong>Available Credit:</strong> LKR {{order.availableCredit | number:'1.2-2'}}
            </p>
          </div>

          <div class="items-summary">
            <h4>Items ({{order.items?.length || 0}})</h4>
            <div *ngFor="let item of order.items" class="item-row">
              <span class="product-name">{{item.productName}}</span>
              <span class="quantity">Qty: {{item.requestedQuantity}}</span>
              <span class="availability" [class]="'status-' + item.availabilityStatus?.toLowerCase()">
                {{item.availabilityStatus}}
              </span>
              <span *ngIf="item.availableStock !== undefined" class="stock">
                Stock: {{item.availableStock}}
              </span>
            </div>
          </div>

          <div class="actions">
            <button class="btn btn-success" (click)="approveOrder(order)" 
                    [disabled]="!canApprove(order)">
              Approve
            </button>
            <button class="btn btn-warning" (click)="partialApprove(order)"
                    [disabled]="!canPartialApprove(order)">
              Partial Approve
            </button>
            <button class="btn btn-danger" (click)="rejectOrder(order)">
              Reject
            </button>
            <button class="btn btn-info" (click)="viewDetails(order)">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-verification { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .stats { display: flex; gap: 15px; }
    .stat { background: #f8f9fa; padding: 8px 12px; border-radius: 4px; font-weight: 600; }
    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .order-header h3 { margin: 0; }
    .payment-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .payment-cash { background: #28a745; color: white; }
    .payment-credit { background: #ffc107; color: #212529; }
    .order-info p { margin: 4px 0; }
    .items-summary { margin: 12px 0; }
    .items-summary h4 { margin: 8px 0; color: #495057; }
    .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 8px; padding: 4px 0; font-size: 12px; align-items: center; }
    .product-name { font-weight: 600; }
    .availability { padding: 2px 6px; border-radius: 4px; text-align: center; }
    .status-available { background: #d4edda; color: #155724; }
    .status-partial { background: #fff3cd; color: #856404; }
    .status-unavailable { background: #f8d7da; color: #721c24; }
    .actions { display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap; }
    .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .btn-success { background: #28a745; color: white; }
    .btn-warning { background: #ffc107; color: #212529; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
  `]
})
export class OrderVerificationComponent implements OnInit {
  pendingOrders: any[] = [];
  rdcId = 1;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPendingOrders();
  }

  loadPendingOrders() {
    console.log('Loading pending orders for RDC:', this.rdcId);
    this.http.get<any[]>(`${environment.apiUrl}/orders/pending-verification?rdcId=${this.rdcId}`)
      .subscribe({
        next: (orders) => {
          console.log('Received orders:', orders);
          this.pendingOrders = [...orders];
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading pending orders:', error);
        }
      });
  }

  canApprove(order: any): boolean {
    return order.items?.every((item: any) => item.availabilityStatus === 'AVAILABLE') &&
           (order.paymentType !== 'CREDIT' || order.availableCredit >= order.totalAmount);
  }

  canPartialApprove(order: any): boolean {
    return order.items?.some((item: any) => item.availabilityStatus === 'PARTIAL');
  }

  approveOrder(order: any) {
    Swal.fire({
      title: 'Approve Order?',
      text: `Approve order ${order.orderNumber} for ${order.customerName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      confirmButtonText: 'Yes, approve'
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          orderId: order.orderId,
          decision: 'APPROVE',
          notifyCustomer: true
        };
        
        this.http.post<string>(`${environment.apiUrl}/orders/verify`, request, { responseType: 'text' as 'json' })
          .subscribe({
            next: (response) => {
              Swal.fire('Success', response, 'success');
              this.loadPendingOrders();
            },
            error: (error) => Swal.fire('Error', 'Failed to approve order', 'error')
          });
      }
    });
  }

  partialApprove(order: any) {
    const itemsHtml = order.items.map((item: any) => `
      <div style="margin: 8px 0; display: flex; justify-content: space-between; align-items: center;">
        <span>${item.productName}</span>
        <input type="number" id="qty_${item.itemId}" value="${item.suggestedQuantity || item.requestedQuantity}" 
               max="${item.availableStock}" min="0" style="width: 80px; padding: 4px;">
      </div>
    `).join('');

    Swal.fire({
      title: 'Partial Approval',
      html: `<div style="text-align: left;">${itemsHtml}</div>`,
      showCancelButton: true,
      confirmButtonText: 'Approve with adjustments',
      preConfirm: () => {
        const adjustments = order.items.map((item: any) => ({
          itemId: item.itemId,
          adjustedQuantity: parseInt((document.getElementById(`qty_${item.itemId}`) as HTMLInputElement).value),
          reason: 'Stock limitation'
        }));
        return adjustments;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          orderId: order.orderId,
          decision: 'PARTIAL_APPROVE',
          itemAdjustments: result.value,
          notifyCustomer: true
        };
        
        this.http.post<string>(`${environment.apiUrl}/orders/verify`, request, { responseType: 'text' as 'json' })
          .subscribe({
            next: (response) => {
              Swal.fire('Success', response, 'success');
              this.loadPendingOrders();
            },
            error: (error) => Swal.fire('Error', 'Failed to process order', 'error')
          });
      }
    });
  }

  rejectOrder(order: any) {
    Swal.fire({
      title: 'Reject Order?',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter reason for rejection...',
      inputValidator: (value) => {
        if (!value) return 'Please provide a reason for rejection';
        return null;
      },
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Reject Order'
    }).then((result) => {
      if (result.isConfirmed) {
        const request = {
          orderId: order.orderId,
          decision: 'REJECT',
          rejectionReason: result.value,
          notifyCustomer: true
        };
        
        this.http.post<string>(`${environment.apiUrl}/orders/verify`, request, { responseType: 'text' as 'json' })
          .subscribe({
            next: (response) => {
              Swal.fire('Success', response, 'success');
              this.loadPendingOrders();
            },
            error: (error) => Swal.fire('Error', 'Failed to reject order', 'error')
          });
      }
    });
  }

  viewDetails(order: any) {
    this.http.get<any>(`${environment.apiUrl}/orders/verification-details/${order.orderId}`)
      .subscribe({
        next: (details) => {
          const itemsHtml = details.items.map((item: any) => `
            <div style="border-bottom: 1px solid #eee; padding: 8px 0;">
              <strong>${item.productName}</strong><br>
              Requested: ${item.requestedQuantity} | Available: ${item.availableStock}<br>
              Status: <span style="color: ${item.availabilityStatus === 'AVAILABLE' ? 'green' : item.availabilityStatus === 'PARTIAL' ? 'orange' : 'red'}">
                ${item.availabilityStatus}
              </span>
              ${item.batchNumber ? `<br>Batch: ${item.batchNumber}` : ''}
              ${item.expiryDate ? `<br>Expiry: ${item.expiryDate}` : ''}
            </div>
          `).join('');

          Swal.fire({
            title: `Order ${details.orderNumber}`,
            html: `
              <div style="text-align: left;">
                <p><strong>Customer:</strong> ${details.customerName}</p>
                <p><strong>Total:</strong> LKR ${details.totalAmount}</p>
                <p><strong>Payment:</strong> ${details.paymentType}</p>
                ${details.paymentType === 'CREDIT' ? `<p><strong>Available Credit:</strong> LKR ${details.availableCredit}</p>` : ''}
                <h4>Items:</h4>
                ${itemsHtml}
              </div>
            `,
            width: 600
          });
        },
        error: (error) => Swal.fire('Error', 'Failed to load order details', 'error')
      });
  }

  trackByOrderId(index: number, order: any): any {
    return order.orderId;
  }
}