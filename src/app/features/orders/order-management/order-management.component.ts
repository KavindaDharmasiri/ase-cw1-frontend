import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../models/order.model';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [OrderService],
  template: `
    <div class="order-management-container">
      <h1>📦 Order Management</h1>
      
      <div class="filters">
        <select [(ngModel)]="statusFilter" (change)="filterOrders()">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        
        <div class="stats">
          <span class="stat">Total Orders: {{orders.length}}</span>
          <span class="stat">Pending: {{getPendingCount()}}</span>
          <span class="stat">Processing: {{getProcessingCount()}}</span>
        </div>
      </div>

      <div class="orders-grid">
        <div *ngFor="let order of filteredOrders" class="order-card" 
             [ngClass]="'status-' + order.status.toLowerCase()">
          <div class="order-header">
            <h3>Order #{{order.id}}</h3>
            <span class="status-badge">{{order.status}}</span>
          </div>
          
          <div class="order-details">
            <p><strong>Customer:</strong> {{order.customer.fullName}}</p>
            <p><strong>RDC:</strong> {{order.rdcLocation}}</p>
            <p><strong>Order Date:</strong> {{formatDate(order.orderDate)}}</p>
            <p><strong>Total Amount:</strong> \${{order.totalAmount}}</p>
            <p><strong>Delivery Address:</strong> {{order.deliveryAddress}}</p>
          </div>

          <div class="order-items">
            <h4>Items ({{order.orderItems?.length || 0}}):</h4>
            <div *ngFor="let item of order.orderItems" class="order-item">
              <span>{{item.product.name}} × {{item.quantity}}</span>
              <span>\${{item.totalPrice}}</span>
            </div>
          </div>

          <div class="order-actions">
            <select [(ngModel)]="order.newStatus" class="status-select">
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button (click)="updateOrderStatus(order)" 
                    [disabled]="order.newStatus === order.status">
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="filteredOrders.length === 0" class="no-orders">
        <p>No orders found matching the current filter.</p>
      </div>
    </div>
  `,
  styles: [`
    .order-management-container { padding: 20px; }
    .filters { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .stats { display: flex; gap: 20px; }
    .stat { padding: 8px 12px; background: white; border-radius: 4px; font-weight: bold; }
    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .order-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .order-card.status-pending { border-left: 4px solid #f39c12; }
    .order-card.status-confirmed { border-left: 4px solid #3498db; }
    .order-card.status-processing { border-left: 4px solid #9b59b6; }
    .order-card.status-shipped { border-left: 4px solid #e67e22; }
    .order-card.status-delivered { border-left: 4px solid #27ae60; }
    .order-card.status-cancelled { border-left: 4px solid #e74c3c; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .order-header h3 { margin: 0; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
    .status-badge { background: #ecf0f1; color: #2c3e50; }
    .order-details p { margin: 5px 0; }
    .order-items { margin: 15px 0; }
    .order-items h4 { margin: 0 0 10px 0; }
    .order-item { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
    .order-actions { display: flex; gap: 10px; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .status-select { padding: 6px; border: 1px solid #ddd; border-radius: 4px; }
    .order-actions button { padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .order-actions button:disabled { background: #bdc3c7; cursor: not-allowed; }
    .no-orders { text-align: center; padding: 40px; color: #666; }
  `]
})
export class OrderManagementComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  statusFilter = '';
  userRole = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    this.loadOrders();
  }

  loadOrders() {
    if (this.userRole === 'HEAD_OFFICE_MANAGER') {
      this.orderService.getAllOrders().subscribe({
        next: (orders) => {
          this.orders = orders.map(order => ({...order, newStatus: order.status}));
          this.filteredOrders = [...this.orders];
        },
        error: (error) => console.error('Error loading orders:', error)
      });
    } else if (this.userRole === 'RDC_STAFF') {
      // For RDC staff, load orders for their specific RDC
      const rdcLocation = 'Colombo'; // This should come from user profile
      this.orderService.getOrdersByRdc(rdcLocation).subscribe({
        next: (orders) => {
          this.orders = orders.map(order => ({...order, newStatus: order.status}));
          this.filteredOrders = [...this.orders];
        },
        error: (error) => console.error('Error loading orders:', error)
      });
    }
  }

  filterOrders() {
    if (this.statusFilter) {
      this.filteredOrders = this.orders.filter(order => order.status === this.statusFilter);
    } else {
      this.filteredOrders = [...this.orders];
    }
  }

  updateOrderStatus(order: Order) {
    if (!order.newStatus) return;
    
    this.orderService.updateOrderStatus(order.id, order.newStatus).subscribe({
      next: (updatedOrder) => {
        order.status = order.newStatus!;
        Swal.fire('Success', 'Order status updated successfully', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to update order status', 'error');
        console.error('Error updating order status:', error);
      }
    });
  }

  getPendingCount(): number {
    return this.orders.filter(order => order.status === 'PENDING').length;
  }

  getProcessingCount(): number {
    return this.orders.filter(order => order.status === 'PROCESSING').length;
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}