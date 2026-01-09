import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { OrderService } from '../../core/services/order.service';
import { DeliveryService } from '../../core/services/delivery.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../models/order.model';
import Swal from 'sweetalert2';

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
            <p><strong>Total:</strong> Rs. {{order.totalAmount}}</p>
            <p><strong>RDC:</strong> {{order.rdcLocation}}</p>
            <p><strong>Delivery Address:</strong> {{order.deliveryAddress}}</p>
            <p *ngIf="order.deliveryDate"><strong>Delivered:</strong> {{formatDate(order.deliveryDate)}}</p>
            <p *ngIf="order.rejectionReason" class="rejection-reason"><strong>Rejection Reason:</strong> {{order.rejectionReason}}</p>
          </div>

          <div class="order-items">
            <h4>Items:</h4>
            <div *ngFor="let item of order.orderItems" class="order-item">
              <span>{{item.product.name}} × {{item.quantity}}</span>
              <span>Rs. {{item.totalPrice}}</span>
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
            <div class="delivery-actions">
              <a *ngIf="canTrackDelivery(order.status)" [routerLink]="['/delivery-tracking', order.id]" class="track-delivery-btn">🗺️ Track Live Delivery</a>
              <button *ngIf="order.status === 'DELIVERED'" (click)="downloadInvoice(order.id)" class="download-invoice-btn">📄 Download Invoice</button>
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
    .track-delivery-btn { padding: 10px 20px; background: #e67e22; color: white; text-decoration: none; border-radius: 4px; display: inline-block; margin-right: 10px; }
    .download-invoice-btn { padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .download-invoice-btn:hover { background: #229954; }
    .no-orders { text-align: center; padding: 40px; }
    .btn { padding: 10px 20px; background: #3498db; color: white; text-decoration: none; border-radius: 4px; display: inline-block; }
    .rejection-reason { color: #e74c3c; font-weight: bold; }
  `]
})
export class OrderTrackingComponent implements OnInit {
  orders: Order[] = [];

  constructor(
    private orderService: OrderService,
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {}

  ngOnInit() {
    console.log('OrderTrackingComponent initialized');
    this.loadCustomerOrders();
  }

  loadCustomerOrders() {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    console.log('User info from localStorage:', userInfo);
    
    if (userInfo.id) {
      console.log('Loading orders for customer ID:', userInfo.id);
      this.orderService.getOrdersByCustomer(userInfo.id).subscribe({
        next: (orders) => {
          console.log('Orders received:', orders);
          setTimeout(() => {
            this.orders = orders || [];
            console.log('Orders array set to:', this.orders);
            this.cdr.detectChanges();
          }, 0);
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.orders = [];
        }
      });
    } else {
      console.error('No user ID found in localStorage');
      // Try with hardcoded ID 4 for testing
      console.log('Trying with hardcoded customer ID 4');
      this.orderService.getOrdersByCustomer(4).subscribe({
        next: (orders) => {
          console.log('Orders received with ID 4:', orders);
          setTimeout(() => {
            this.orders = orders || [];
            this.cdr.detectChanges();
          }, 0);
        },
        error: (error) => {
          console.error('Error loading orders with ID 4:', error);
          this.orders = [];
        }
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

  canTrackDelivery(status: string): boolean {
    return status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY';
  }

  downloadInvoice(orderId: number) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) {
      Swal.fire('Error', 'Order not found', 'error');
      return;
    }

    // Generate invoice data from order
    const subtotal = order.totalAmount;
    const taxRate = 0.10; // 10% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;
    const invoiceNumber = `INV-${Date.now()}`;

    // Create PDF content using jsPDF
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text('INVOICE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Invoice Number: ${invoiceNumber}`, 20, 40);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.text(`Order ID: ${order.id}`, 20, 60);
    
    // Customer Info
    doc.text('Bill To:', 20, 80);
    doc.text(`${order.customerName || order.storeName || 'N/A'}`, 20, 90);
    doc.text(`${order.customerPhone || 'N/A'}`, 20, 100);
    doc.text(`${order.deliveryAddress || 'N/A'}`, 20, 110);
    
    // Items table
    let yPos = 130;
    doc.text('Items:', 20, yPos);
    yPos += 10;
    
    doc.text('Product', 20, yPos);
    doc.text('Qty', 100, yPos);
    doc.text('Unit Price', 130, yPos);
    doc.text('Total', 170, yPos);
    yPos += 10;
    
    if (order.orderItems) {
      order.orderItems.forEach(item => {
        doc.text(item.product.name, 20, yPos);
        doc.text(item.quantity.toString(), 100, yPos);
        doc.text(`LKR ${item.unitPrice}`, 130, yPos);
        doc.text(`LKR ${item.totalPrice}`, 170, yPos);
        yPos += 10;
      });
    }
    
    // Summary
    yPos += 10;
    doc.text(`Subtotal: LKR ${subtotal.toFixed(2)}`, 130, yPos);
    yPos += 10;
    doc.text(`Tax (10%): LKR ${taxAmount.toFixed(2)}`, 130, yPos);
    yPos += 10;
    doc.setFontSize(14);
    doc.text(`Total: LKR ${totalAmount.toFixed(2)}`, 130, yPos);
    
    // Footer
    doc.setFontSize(10);
    doc.text('Thank you for your business!', 105, 280, { align: 'center' });
    
    // Download PDF
    doc.save(`invoice-${invoiceNumber}.pdf`);
    
    Swal.fire('Downloaded', `Invoice ${invoiceNumber} downloaded as PDF!`, 'success');
  }
}