import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logistics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="logistics-dashboard fade-in">
      <div class="dashboard-header">
        <h1>Logistics Operations</h1>
        <div class="user-info">
          <span class="role-badge">{{userType}}</span>
          <span class="location">{{assignedLocation}}</span>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card active">
          <h3>Active Routes</h3>
          <div class="stat-number">{{stats.activeRoutes}}</div>
          <p>Currently in progress</p>
        </div>
        <div class="stat-card pending">
          <h3>Pending Deliveries</h3>
          <div class="stat-number">{{stats.pendingDeliveries}}</div>
          <p>Scheduled for today</p>
        </div>
        <div class="stat-card completed">
          <h3>Completed Today</h3>
          <div class="stat-number">{{stats.completedToday}}</div>
          <p>Successfully delivered</p>
        </div>
        <div class="stat-card vehicles">
          <h3>Available Vehicles</h3>
          <div class="stat-number">{{stats.availableVehicles}}</div>
          <p>Ready for dispatch</p>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="routes-section">
          <div class="section-header">
            <h2>Today's Routes</h2>
            <a routerLink="/logistics/routes" class="view-all-btn">Manage Routes</a>
          </div>
          <div class="routes-list">
            <div class="route-item" *ngFor="let route of todaysRoutes" [class]="'status-' + route.status.toLowerCase()">
              <div class="route-info">
                <h4>{{route.name}}</h4>
                <p>{{route.driver}} - {{route.vehicle}}</p>
                <p>{{route.deliveries}} deliveries</p>
              </div>
              <div class="route-status">
                <span class="status-badge" [class]="route.status.toLowerCase()">{{route.status}}</span>
                <div class="progress-bar">
                  <div class="progress" [style.width.%]="route.progress"></div>
                </div>
                <span class="progress-text">{{route.progress}}%</span>
              </div>
              <div class="route-actions">
                <button class="track-btn" (click)="trackRoute(route.id)">Track</button>
              </div>
            </div>
          </div>
        </div>

        <div class="alerts-section">
          <div class="section-header">
            <h2>Alerts & Issues</h2>
          </div>
          <div class="alerts-list">
            <div class="alert-item" *ngFor="let alert of alerts" [class]="alert.type">
              <div class="alert-icon">{{getAlertIcon(alert.type)}}</div>
              <div class="alert-content">
                <h4>{{alert.title}}</h4>
                <p>{{alert.message}}</p>
                <span class="alert-time">{{formatTime(alert.timestamp)}}</span>
              </div>
              <button class="resolve-btn" (click)="resolveAlert(alert.id)">Resolve</button>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/logistics/routes" class="action-card">
            <div class="action-icon">🗺️</div>
            <h3>Route Planning</h3>
            <p>Plan and optimize delivery routes</p>
          </a>
          <a routerLink="/logistics/deliveries" class="action-card">
            <div class="action-icon">📦</div>
            <h3>Delivery Execution</h3>
            <p>Manage active deliveries</p>
          </a>
          <a routerLink="/logistics/tracking" class="action-card">
            <div class="action-icon">📍</div>
            <h3>GPS Tracking</h3>
            <p>Monitor vehicle locations</p>
          </a>
          <a routerLink="/logistics/reports" class="action-card">
            <div class="action-icon">📊</div>
            <h3>Performance Reports</h3>
            <p>View delivery metrics</p>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .logistics-dashboard { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .user-info { display: flex; gap: 12px; align-items: center; }
    .role-badge { padding: 8px 16px; background: var(--orange-500); color: white; border-radius: 20px; font-weight: 600; }
    .location { padding: 8px 16px; background: var(--gray-100); border-radius: 20px; font-weight: 600; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; margin-bottom: 40px; }
    .stat-card { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); border-left: 4px solid; }
    .stat-card.active { border-color: var(--blue-500); }
    .stat-card.pending { border-color: var(--yellow-500); }
    .stat-card.completed { border-color: var(--green-500); }
    .stat-card.vehicles { border-color: var(--purple-500); }
    .stat-number { font-size: 36px; font-weight: 700; color: var(--gray-800); margin: 8px 0; }
    .dashboard-content { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-bottom: 40px; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .view-all-btn { color: var(--primary-blue); text-decoration: none; font-weight: 600; }
    .routes-section, .alerts-section { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .route-item { display: grid; grid-template-columns: 1fr auto auto; gap: 16px; align-items: center; padding: 16px; border-bottom: 1px solid var(--gray-200); }
    .route-item:last-child { border-bottom: none; }
    .route-info h4 { margin: 0 0 4px 0; }
    .route-info p { margin: 2px 0; color: var(--gray-600); font-size: 14px; }
    .route-status { text-align: center; }
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.dispatched { background: var(--blue-100); color: var(--blue-600); }
    .status-badge.in-transit { background: var(--yellow-100); color: var(--yellow-600); }
    .status-badge.completed { background: var(--green-100); color: var(--green-600); }
    .progress-bar { width: 100px; height: 8px; background: var(--gray-200); border-radius: 4px; margin: 8px 0; overflow: hidden; }
    .progress { height: 100%; background: var(--primary-blue); transition: width 0.3s ease; }
    .progress-text { font-size: 12px; color: var(--gray-600); }
    .track-btn { padding: 8px 16px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .alerts-list { max-height: 300px; overflow-y: auto; }
    .alert-item { display: flex; gap: 12px; align-items: center; padding: 12px; margin-bottom: 12px; border-radius: var(--border-radius-md); }
    .alert-item.warning { background: var(--yellow-50); }
    .alert-item.error { background: var(--red-50); }
    .alert-item.info { background: var(--blue-50); }
    .alert-icon { font-size: 24px; }
    .alert-content { flex: 1; }
    .alert-content h4 { margin: 0 0 4px 0; font-size: 14px; }
    .alert-content p { margin: 0 0 4px 0; font-size: 12px; }
    .alert-time { font-size: 11px; color: var(--gray-500); }
    .resolve-btn { padding: 6px 12px; background: var(--green-500); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .action-card { display: block; background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); text-decoration: none; color: inherit; transition: all var(--transition-normal); }
    .action-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .action-icon { font-size: 48px; margin-bottom: 16px; }
    .action-card h3 { margin: 0 0 8px 0; color: var(--gray-800); }
    .action-card p { margin: 0; color: var(--gray-600); font-size: 14px; }
  `]
})
export class LogisticsDashboardComponent implements OnInit {
  userType = 'Logistics Officer';
  assignedLocation = 'Colombo Region';
  stats = {
    activeRoutes: 5,
    pendingDeliveries: 23,
    completedToday: 18,
    availableVehicles: 8
  };
  todaysRoutes: any[] = [];
  alerts: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Mock data
    this.todaysRoutes = [
      {
        id: 1,
        name: 'Route A - Central',
        driver: 'Kamal Perera',
        vehicle: 'CAB-1234',
        deliveries: 8,
        status: 'IN-TRANSIT',
        progress: 65
      },
      {
        id: 2,
        name: 'Route B - North',
        driver: 'Sunil Silva',
        vehicle: 'CAB-5678',
        deliveries: 6,
        status: 'DISPATCHED',
        progress: 25
      }
    ];

    this.alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'Route Delay',
        message: 'Route A is 30 minutes behind schedule',
        timestamp: new Date()
      },
      {
        id: 2,
        type: 'error',
        title: 'Vehicle Issue',
        message: 'CAB-9012 reported mechanical problem',
        timestamp: new Date()
      }
    ];
  }

  trackRoute(routeId: number) {
    window.location.href = `/logistics/tracking/${routeId}`;
  }

  resolveAlert(alertId: number) {
    this.alerts = this.alerts.filter(a => a.id !== alertId);
  }

  getAlertIcon(type: string): string {
    switch (type) {
      case 'warning': return '⚠️';
      case 'error': return '🚨';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString();
  }
}