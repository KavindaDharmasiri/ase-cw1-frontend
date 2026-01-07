import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-rdc-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="rdc-dashboard fade-in">
      <div class="dashboard-header">
        <h1>RDC Operations Dashboard</h1>
        <div class="rdc-info">
          <span class="rdc-badge">{{rdcLocation}}</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card urgent">
          <h3>New Orders</h3>
          <div class="stat-number">{{stats.newOrders}}</div>
          <p>Require processing</p>
        </div>
        <div class="stat-card warning">
          <h3>Pending Orders</h3>
          <div class="stat-number">{{stats.pendingOrders}}</div>
          <p>In progress</p>
        </div>
        <div class="stat-card alert">
          <h3>Low Stock Items</h3>
          <div class="stat-number">{{stats.lowStockItems}}</div>
          <p>Need restocking</p>
        </div>
        <div class="stat-card info">
          <h3>Today's Deliveries</h3>
          <div class="stat-number">{{stats.scheduledDeliveries}}</div>
          <p>Scheduled</p>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="orders-section">
          <div class="section-header">
            <h2>Recent Orders</h2>
            <a routerLink="/rdc/orders" class="view-all-btn">View All</a>
          </div>
          <div class="orders-list">
            <div class="order-item" *ngFor="let order of recentOrders">
              <div class="order-info">
                <h4>Order #{{order.id}}</h4>
                <p>{{order.customerName}} - {{order.totalAmount | currency}}</p>
              </div>
              <div class="order-status">
                <span class="status-badge" [class]="order.status.toLowerCase()">{{order.status}}</span>
              </div>
              <div class="order-actions">
                <button class="process-btn" (click)="processOrder(order.id)">Process</button>
              </div>
            </div>
          </div>
        </div>

        <div class="alerts-section">
          <div class="section-header">
            <h2>Alerts & Notifications</h2>
          </div>
          <div class="alerts-list">
            <div class="alert-item" *ngFor="let alert of alerts" [class]="alert.type">
              <div class="alert-icon">⚠️</div>
              <div class="alert-content">
                <h4>{{alert.title}}</h4>
                <p>{{alert.message}}</p>
                <span class="alert-time">{{formatTime(alert.timestamp)}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/rdc/orders" class="action-card">
            <div class="action-icon">📋</div>
            <h3>Process Orders</h3>
            <p>Accept, reject, and update order status</p>
          </a>
          <a routerLink="/inventory" class="action-card">
            <div class="action-icon">📦</div>
            <h3>Manage Inventory</h3>
            <p>Update stock levels and adjustments</p>
          </a>
          <a routerLink="/rdc/deliveries" class="action-card">
            <div class="action-icon">🚚</div>
            <h3>Delivery Preparation</h3>
            <p>Assign routes and prepare deliveries</p>
          </a>
          <a routerLink="/stock-transfers" class="action-card">
            <div class="action-icon">🔄</div>
            <h3>Stock Transfers</h3>
            <p>Request and manage inter-RDC transfers</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rdc-dashboard { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .rdc-badge { padding: 8px 16px; background: var(--primary-blue); color: white; border-radius: 20px; font-weight: 600; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .stat-card { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border-left: 4px solid; }
    .stat-card.urgent { border-color: var(--red-500); }
    .stat-card.warning { border-color: var(--yellow-500); }
    .stat-card.alert { border-color: var(--orange-500); }
    .stat-card.info { border-color: var(--blue-500); }
    .stat-number { font-size: 36px; font-weight: 700; color: var(--gray-800); margin: 8px 0; }
    .dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-bottom: 40px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .view-all-btn { color: var(--primary-blue); text-decoration: none; font-weight: 600; }
    .orders-section, .alerts-section { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .order-item { display: flex; align-items: center; gap: 16px; padding: 16px; border-bottom: 1px solid var(--gray-200); }
    .order-item:last-child { border-bottom: none; }
    .order-info { flex: 1; }
    .order-info h4 { margin: 0 0 4px 0; }
    .order-info p { margin: 0; color: var(--gray-600); font-size: 14px; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.new { background: var(--blue-100); color: var(--blue-600); }
    .status-badge.pending { background: var(--yellow-100); color: var(--yellow-600); }
    .process-btn { padding: 8px 16px; background: var(--secondary-green); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .alerts-list { max-height: 300px; overflow-y: auto; }
    .alert-item { display: flex; gap: 12px; padding: 12px; margin-bottom: 12px; border-radius: var(--border-radius-md); }
    .alert-item.urgent { background: var(--red-50); }
    .alert-item.warning { background: var(--yellow-50); }
    .alert-content h4 { margin: 0 0 4px 0; font-size: 14px; }
    .alert-content p { margin: 0 0 4px 0; font-size: 12px; }
    .alert-time { font-size: 11px; color: var(--gray-500); }
    .action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .action-card { display: block; background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); text-decoration: none; color: inherit; transition: all var(--transition-normal); }
    .action-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .action-icon { font-size: 48px; margin-bottom: 16px; }
    .action-card h3 { margin: 0 0 8px 0; color: var(--gray-800); }
    .action-card p { margin: 0; color: var(--gray-600); font-size: 14px; }
  `]
})
export class RdcDashboardComponent implements OnInit {
  rdcLocation = 'Colombo RDC';
  stats = {
    newOrders: 12,
    pendingOrders: 8,
    lowStockItems: 5,
    scheduledDeliveries: 15
  };
  recentOrders: any[] = [];
  alerts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Mock data - replace with actual API calls
    this.recentOrders = [
      { id: 1001, customerName: 'ABC Store', totalAmount: 2500, status: 'NEW' },
      { id: 1002, customerName: 'XYZ Mart', totalAmount: 1800, status: 'PENDING' },
      { id: 1003, customerName: 'Quick Shop', totalAmount: 3200, status: 'NEW' }
    ];

    this.alerts = [
      {
        type: 'urgent',
        title: 'Low Stock Alert',
        message: 'Product A is running low (5 units remaining)',
        timestamp: new Date()
      },
      {
        type: 'warning',
        title: 'Delivery Delay',
        message: 'Route 3 delivery delayed due to traffic',
        timestamp: new Date()
      }
    ];
  }

  processOrder(orderId: number) {
    // Navigate to order processing
    window.location.href = `/rdc/orders/${orderId}`;
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }
}