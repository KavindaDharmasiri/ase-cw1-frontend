import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rdc-deliveries',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rdc-deliveries fade-in">
      <div class="deliveries-header">
        <h1>Delivery Preparation</h1>
        <button class="create-route-btn" (click)="createNewRoute()">Create New Route</button>
      </div>

      <div class="delivery-routes">
        <div class="route-card" *ngFor="let route of deliveryRoutes">
          <div class="route-header">
            <h3>{{route.name}}</h3>
            <span class="route-status" [class]="route.status.toLowerCase()">{{route.status}}</span>
          </div>

          <div class="route-info">
            <div class="route-details">
              <p><strong>Driver:</strong> {{route.driverName}}</p>
              <p><strong>Vehicle:</strong> {{route.vehicleNumber}}</p>
              <p><strong>Date:</strong> {{formatDate(route.deliveryDate)}}</p>
              <p><strong>Orders:</strong> {{route.orders.length}} orders</p>
            </div>
            <div class="route-map">
              <div class="map-placeholder">🗺️ Route Map</div>
            </div>
          </div>

          <div class="route-orders">
            <h4>Assigned Orders</h4>
            <div class="orders-list">
              <div class="order-item" *ngFor="let order of route.orders">
                <div class="order-info">
                  <span class="order-id">#{{order.id}}</span>
                  <span class="customer">{{order.customerName}}</span>
                  <span class="address">{{order.deliveryAddress}}</span>
                </div>
                <div class="order-actions">
                  <button class="remove-btn" (click)="removeFromRoute(route.id, order.id)">Remove</button>
                </div>
              </div>
            </div>
          </div>

          <div class="route-actions">
            <button class="assign-btn" (click)="assignOrders(route)">Assign Orders</button>
            <button class="optimize-btn" (click)="optimizeRoute(route)">Optimize Route</button>
            <button class="dispatch-btn" *ngIf="route.status === 'READY'" (click)="dispatchRoute(route)">Dispatch</button>
            <button class="print-btn" (click)="printDeliveryNotes(route)">Print Notes</button>
          </div>
        </div>
      </div>

      <div class="unassigned-orders">
        <h2>Unassigned Orders</h2>
        <div class="orders-grid">
          <div class="order-card" *ngFor="let order of unassignedOrders">
            <div class="order-header">
              <h4>Order #{{order.id}}</h4>
              <span class="priority" [class]="order.priority">{{order.priority}}</span>
            </div>
            <div class="order-details">
              <p>{{order.customerName}}</p>
              <p>{{order.deliveryAddress}}</p>
              <p>{{order.items.length}} items - Rs. {{order.totalAmount}}</p>
            </div>
            <div class="order-actions">
              <select [(ngModel)]="order.selectedRoute" class="route-select">
                <option value="">Select Route</option>
                <option *ngFor="let route of availableRoutes" [value]="route.id">{{route.name}}</option>
              </select>
              <button class="assign-btn" (click)="assignToRoute(order)" [disabled]="!order.selectedRoute">Assign</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rdc-deliveries { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .deliveries-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .create-route-btn { padding: 12px 24px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .delivery-routes { margin-bottom: 40px; }
    .route-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 24px; margin-bottom: 24px; }
    .route-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .route-status { padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .route-status.planning { background: var(--blue-100); color: var(--blue-600); }
    .route-status.ready { background: var(--green-100); color: var(--green-600); }
    .route-status.dispatched { background: var(--purple-100); color: var(--purple-600); }
    .route-info { display: grid; grid-template-columns: 1fr auto; gap: 24px; margin-bottom: 20px; }
    .route-details p { margin: 8px 0; }
    .map-placeholder { width: 200px; height: 120px; background: var(--gray-100); border-radius: var(--border-radius-md); display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .route-orders { margin-bottom: 20px; }
    .orders-list { max-height: 200px; overflow-y: auto; }
    .order-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid var(--gray-200); }
    .order-info { display: flex; gap: 16px; align-items: center; }
    .order-id { font-weight: 600; }
    .customer { color: var(--gray-700); }
    .address { color: var(--gray-500); font-size: 12px; }
    .remove-btn { padding: 4px 8px; background: var(--red-100); color: var(--red-600); border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .route-actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .route-actions button { padding: 8px 16px; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-size: 14px; }
    .assign-btn { background: var(--blue-500); color: white; }
    .optimize-btn { background: var(--purple-500); color: white; }
    .dispatch-btn { background: var(--green-500); color: white; }
    .print-btn { background: var(--gray-500); color: white; }
    .unassigned-orders h2 { margin-bottom: 24px; }
    .orders-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .order-card { background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); padding: 20px; }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .priority { padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .priority.high { background: var(--red-100); color: var(--red-600); }
    .priority.normal { background: var(--blue-100); color: var(--blue-600); }
    .order-details p { margin: 6px 0; font-size: 14px; }
    .order-actions { display: flex; gap: 8px; align-items: center; margin-top: 12px; }
    .route-select { flex: 1; padding: 8px; border: 1px solid var(--gray-300); border-radius: 4px; }
  `]
})
export class RdcDeliveriesComponent implements OnInit {
  deliveryRoutes: any[] = [];
  unassignedOrders: any[] = [];
  availableRoutes: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDeliveryData();
  }

  loadDeliveryData() {
    // Mock data
    this.deliveryRoutes = [
      {
        id: 1,
        name: 'Route A - Colombo Central',
        status: 'PLANNING',
        driverName: 'Kamal Perera',
        vehicleNumber: 'CAB-1234',
        deliveryDate: new Date(),
        orders: [
          { id: 1001, customerName: 'ABC Store', deliveryAddress: '123 Main St' },
          { id: 1002, customerName: 'XYZ Mart', deliveryAddress: '456 High St' }
        ]
      }
    ];

    this.unassignedOrders = [
      {
        id: 1003,
        customerName: 'Quick Shop',
        deliveryAddress: '789 Park Ave',
        priority: 'HIGH',
        totalAmount: 3200,
        items: [{ name: 'Product A' }, { name: 'Product B' }],
        selectedRoute: ''
      }
    ];

    this.availableRoutes = this.deliveryRoutes.filter(r => r.status !== 'DISPATCHED');
  }

  createNewRoute() {
    Swal.fire({
      title: 'Create New Route',
      html: `
        <input id="routeName" class="swal2-input" placeholder="Route Name">
        <input id="driverName" class="swal2-input" placeholder="Driver Name">
        <input id="vehicleNumber" class="swal2-input" placeholder="Vehicle Number">
        <input id="deliveryDate" class="swal2-input" type="date">
      `,
      showCancelButton: true,
      confirmButtonText: 'Create Route',
      preConfirm: () => {
        const routeName = (document.getElementById('routeName') as HTMLInputElement).value;
        const driverName = (document.getElementById('driverName') as HTMLInputElement).value;
        const vehicleNumber = (document.getElementById('vehicleNumber') as HTMLInputElement).value;
        const deliveryDate = (document.getElementById('deliveryDate') as HTMLInputElement).value;
        
        if (!routeName || !driverName || !vehicleNumber) {
          Swal.showValidationMessage('All fields are required');
          return false;
        }
        
        return { routeName, driverName, vehicleNumber, deliveryDate };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const newRoute = {
          id: this.deliveryRoutes.length + 1,
          name: result.value.routeName,
          status: 'PLANNING',
          driverName: result.value.driverName,
          vehicleNumber: result.value.vehicleNumber,
          deliveryDate: new Date(result.value.deliveryDate),
          orders: []
        };
        this.deliveryRoutes.push(newRoute);
        this.availableRoutes = this.deliveryRoutes.filter(r => r.status !== 'DISPATCHED');
        Swal.fire('Created!', 'New delivery route created.', 'success');
      }
    });
  }

  assignOrders(route: any) {
    // Show available orders to assign
    Swal.fire('Info', 'Order assignment functionality would be implemented here.', 'info');
  }

  optimizeRoute(route: any) {
    Swal.fire('Optimized!', 'Route has been optimized for efficiency.', 'success');
  }

  dispatchRoute(route: any) {
    Swal.fire({
      title: 'Dispatch Route?',
      text: `Dispatch ${route.name} with ${route.orders.length} orders?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Dispatch'
    }).then((result) => {
      if (result.isConfirmed) {
        route.status = 'DISPATCHED';
        Swal.fire('Dispatched!', 'Route has been dispatched.', 'success');
      }
    });
  }

  printDeliveryNotes(route: any) {
    const content = `
      DELIVERY NOTES - ${route.name}
      ================================
      Driver: ${route.driverName}
      Vehicle: ${route.vehicleNumber}
      Date: ${this.formatDate(route.deliveryDate)}
      
      Orders:
      ${route.orders.map((o: any) => `- Order #${o.id}: ${o.customerName} - ${o.deliveryAddress}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `delivery-notes-${route.name}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  assignToRoute(order: any) {
    const route = this.deliveryRoutes.find(r => r.id == order.selectedRoute);
    if (route) {
      route.orders.push(order);
      this.unassignedOrders = this.unassignedOrders.filter(o => o.id !== order.id);
      Swal.fire('Assigned!', `Order #${order.id} assigned to ${route.name}.`, 'success');
    }
  }

  removeFromRoute(routeId: number, orderId: number) {
    const route = this.deliveryRoutes.find(r => r.id === routeId);
    if (route) {
      const order = route.orders.find((o: any) => o.id === orderId);
      route.orders = route.orders.filter((o: any) => o.id !== orderId);
      if (order) {
        this.unassignedOrders.push({ ...order, selectedRoute: '' });
      }
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}