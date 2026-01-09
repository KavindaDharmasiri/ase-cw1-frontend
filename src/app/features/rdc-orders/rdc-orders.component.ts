import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdc-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rdc-orders">
      <div class="header">
        <h1>📦 RDC Orders</h1>
        <div class="filters">
          <button *ngFor="let status of statuses" 
                  (click)="filterByStatus(status)"
                  [class.active]="selectedStatus === status"
                  class="filter-btn">
            {{status}}
          </button>
        </div>
      </div>

      <!-- Route Pick Lists Section -->
      <div class="routes-section" *ngIf="routes.length > 0">
        <h2>📋 Route Pick Lists (Legacy - Use Individual Orders Instead)</h2>
        <p class="info-message">⚠️ Route pick lists are deprecated. Create pick lists for individual orders first, then assign them to routes in Logistics.</p>
      </div>

      <!-- Individual Orders Section -->
      <div class="orders-list">
        <h2>Individual Orders</h2>
        <div *ngFor="let order of filteredOrders" class="order-item">
          <div class="order-header">
            <span class="order-number">{{order.orderCode}}</span>
            <span class="status-badge" [class]="'status-' + order.status.toLowerCase()">
              {{order.status}}
            </span>
          </div>
          <div class="order-details">
            <p><strong>Customer:</strong> {{order.customerName || 'Unknown Customer'}}</p>
            <p><strong>Total:</strong> LKR {{order.totalAmount | number:'1.2-2'}}</p>
            <p><strong>Date:</strong> {{order.orderDate | date:'short'}}</p>
            <p *ngIf="order.rejectionReason"><strong>Rejection Reason:</strong> {{order.rejectionReason}}</p>
          </div>
          
          <div class="order-actions" *ngIf="order.status === 'CONFIRMED'">
            <button (click)="generatePickList(order.id)" class="btn-picklist">
              📋 Generate Pick List
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rdc-orders { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filters { display: flex; gap: 10px; }
    .filter-btn { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 4px; cursor: pointer; }
    .filter-btn.active { background: #007bff; color: white; }
    .orders-list { display: grid; gap: 15px; }
    .order-item { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .order-number { font-weight: bold; font-size: 16px; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-confirmed { background: #d4edda; color: #155724; }
    .status-pick_list_created { background: #cce5ff; color: #004085; }
    .status-rejected { background: #f8d7da; color: #721c24; }
    .info-message { background: #fff3cd; color: #856404; padding: 10px; border-radius: 4px; margin-bottom: 20px; }
    .order-details p { margin: 4px 0; }
    .order-actions { margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .btn-picklist { padding: 8px 16px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class RdcOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  routes: any[] = [];
  statuses = ['ALL', 'PENDING', 'CONFIRMED', 'PICK_LIST_CREATED', 'REJECTED'];
  selectedStatus = 'ALL';
  rdcId = 1;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadOrders();
    this.loadRoutes();
  }

  loadOrders() {
    console.log('Loading orders for RDC ID:', this.rdcId);
    this.http.get<any[]>(`${environment.apiUrl}/orders/rdc-id/${this.rdcId}`)
      .subscribe({
        next: (orders) => {
          console.log('Orders received:', orders);
          setTimeout(() => {
            this.orders = orders || [];
            this.filterByStatus(this.selectedStatus);
            console.log('Filtered orders:', this.filteredOrders);
            this.cdr.detectChanges();
          }, 0);
        },
        error: (error) => {
          console.error('Error loading orders:', error);
          this.orders = [];
          this.filteredOrders = [];
        }
      });
  }

  filterByStatus(status: string) {
    this.selectedStatus = status;
    if (status === 'ALL') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
    }
  }

  generatePickList(orderId: number) {
    this.http.post(`${environment.apiUrl}/picklist/order/${orderId}`, {})
      .subscribe({
        next: (pickList) => {
          console.log('Pick list generated:', pickList);
          Swal.fire('Success!', 'Pick list generated! Order is now ready for route assignment.', 'success');
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error generating pick list:', error);
          Swal.fire('Error!', error.error?.message || 'Failed to generate pick list', 'error');
        }
      });
  }

  loadRoutes() {
    this.http.get<any[]>(`${environment.apiUrl}/delivery-routes`)
      .subscribe({
        next: (routes) => {
          this.routes = routes.map(route => ({
            ...route,
            orderCount: 0 // Will be updated when we get route orders
          }));
          // Load order count for each route
          this.routes.forEach(route => {
            this.http.get<any[]>(`${environment.apiUrl}/delivery-routes/${route.id}/orders`)
              .subscribe({
                next: (orders) => {
                  route.orderCount = orders.filter(o => o.status === 'CONFIRMED').length;
                },
                error: () => route.orderCount = 0
              });
          });
        },
        error: (error) => {
          console.error('Error loading routes:', error);
          this.routes = [];
        }
      });
  }

  generateRoutePickList(routeId: number) {
    this.http.get(`${environment.apiUrl}/delivery/picklist/route/${routeId}`)
      .subscribe({
        next: (pickList) => {
          console.log('Route pick list generated:', pickList);
          alert('Route pick list generated! All orders in this route are now being processed.');
          this.loadOrders();
          this.loadRoutes();
        },
        error: (error) => {
          console.error('Error generating route pick list:', error);
          alert('Error: ' + (error.error?.message || 'Failed to generate route pick list'));
        }
      });
  }
}