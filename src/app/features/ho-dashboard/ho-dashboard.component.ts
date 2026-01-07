import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ho-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ho-dashboard">
      <div class="dashboard-header">
        <h1>Head Office Executive Dashboard</h1>
        <p>Island-wide Performance Overview</p>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">💰</div>
          <div class="metric-content">
            <h3>Total Sales</h3>
            <div class="metric-value">Rs. {{totalSales | number}}</div>
            <div class="metric-change positive">+12.5% from last month</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">📦</div>
          <div class="metric-content">
            <h3>Order Volumes</h3>
            <div class="metric-value">{{totalOrders}}</div>
            <div class="metric-change positive">+8.3% from last week</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">📊</div>
          <div class="metric-content">
            <h3>Inventory Value</h3>
            <div class="metric-value">Rs. {{inventoryValue | number}}</div>
            <div class="metric-change neutral">Stable</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🚚</div>
          <div class="metric-content">
            <h3>Delivery Rate</h3>
            <div class="metric-value">{{deliveryRate}}%</div>
            <div class="metric-change positive">+2.1% improvement</div>
          </div>
        </div>
      </div>

      <div class="dashboard-sections">
        <div class="section rdc-overview">
          <h2>RDC Performance Overview</h2>
          <div class="rdc-grid">
            <div class="rdc-card" *ngFor="let rdc of rdcData">
              <h4>{{rdc.name}}</h4>
              <div class="rdc-stats">
                <div class="stat">
                  <span class="label">Orders:</span>
                  <span class="value">{{rdc.orders}}</span>
                </div>
                <div class="stat">
                  <span class="label">Stock Level:</span>
                  <span class="value" [class]="rdc.stockStatus">{{rdc.stockLevel}}%</span>
                </div>
                <div class="stat">
                  <span class="label">Delivery Rate:</span>
                  <span class="value">{{rdc.deliveryRate}}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section alerts">
          <h2>System Alerts & Exceptions</h2>
          <div class="alert-list">
            <div class="alert-item" *ngFor="let alert of systemAlerts" [class]="alert.severity">
              <div class="alert-icon">⚠️</div>
              <div class="alert-content">
                <div class="alert-title">{{alert.title}}</div>
                <div class="alert-message">{{alert.message}}</div>
                <div class="alert-time">{{alert.timestamp | date:'short'}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <button class="action-btn" (click)="navigateTo('/ho-reports')">
            <div class="btn-icon">📈</div>
            <div class="btn-text">View Reports</div>
          </button>
          <button class="action-btn" (click)="navigateTo('/ho-inventory')">
            <div class="btn-icon">📦</div>
            <div class="btn-text">Inventory Overview</div>
          </button>
          <button class="action-btn" (click)="navigateTo('/ho-users')">
            <div class="btn-icon">👥</div>
            <div class="btn-text">User Management</div>
          </button>
          <button class="action-btn" (click)="navigateTo('/ho-config')">
            <div class="btn-icon">⚙️</div>
            <div class="btn-text">System Config</div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ho-dashboard {
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }

    .dashboard-header {
      text-align: center;
      color: white;
      margin-bottom: 2rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .metric-icon {
      font-size: 3rem;
      margin-right: 1rem;
    }

    .metric-value {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .metric-change {
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }

    .metric-change.positive { color: #10b981; }
    .metric-change.negative { color: #ef4444; }
    .metric-change.neutral { color: #6b7280; }

    .dashboard-sections {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .section {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .rdc-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .rdc-card {
      background: #f8fafc;
      border-radius: 10px;
      padding: 1rem;
      border-left: 4px solid #3b82f6;
    }

    .rdc-stats {
      margin-top: 0.5rem;
    }

    .stat {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }

    .stat .value.low { color: #ef4444; }
    .stat .value.medium { color: #f59e0b; }
    .stat .value.high { color: #10b981; }

    .alert-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .alert-item {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
      margin-bottom: 0.5rem;
      border-radius: 8px;
      border-left: 4px solid;
    }

    .alert-item.high { 
      background: #fef2f2; 
      border-left-color: #ef4444; 
    }

    .alert-item.medium { 
      background: #fffbeb; 
      border-left-color: #f59e0b; 
    }

    .quick-actions {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 15px;
      padding: 1.5rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .action-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 10px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .btn-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class HoDashboardComponent implements OnInit {
  totalSales = 15750000;
  totalOrders = 2847;
  inventoryValue = 8950000;
  deliveryRate = 94.2;

  rdcData = [
    { name: 'Colombo RDC', orders: 1250, stockLevel: 85, deliveryRate: 96, stockStatus: 'high' },
    { name: 'Kandy RDC', orders: 890, stockLevel: 45, deliveryRate: 92, stockStatus: 'medium' },
    { name: 'Galle RDC', orders: 707, stockLevel: 25, deliveryRate: 94, stockStatus: 'low' }
  ];

  systemAlerts = [
    {
      title: 'Low Stock Alert',
      message: 'Galle RDC stock level below 30% for Category A items',
      timestamp: new Date(),
      severity: 'high'
    },
    {
      title: 'Payment Delay',
      message: '15 invoices overdue by more than 7 days',
      timestamp: new Date(Date.now() - 3600000),
      severity: 'medium'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}