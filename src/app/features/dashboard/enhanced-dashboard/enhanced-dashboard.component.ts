import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-enhanced-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [NotificationService],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>📊 IslandLink Dashboard</h1>
        <div class="user-info">
          <span>Welcome, {{getUsername()}}</span>
          <div class="notifications">
            <span class="notification-bell" (click)="toggleNotifications()">
              🔔
              <span *ngIf="unreadCount > 0" class="notification-badge">{{unreadCount}}</span>
            </span>
          </div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card" *ngFor="let kpi of kpis">
          <div class="kpi-icon">{{kpi.icon}}</div>
          <div class="kpi-content">
            <h3>{{kpi.value}}</h3>
            <p>{{kpi.label}}</p>
            <span class="kpi-trend" [ngClass]="kpi.trend">
              {{kpi.change}}
            </span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <div *ngFor="let action of quickActions" class="action-card" (click)="navigateTo(action.route)">
            <div class="action-icon">{{action.icon}}</div>
            <h4>{{action.title}}</h4>
            <p>{{action.description}}</p>
          </div>
        </div>
      </div>

      <div class="recent-activity">
        <h2>Recent Activity</h2>
        <div class="activity-list">
          <div *ngFor="let activity of recentActivities" class="activity-item">
            <div class="activity-icon">{{activity.icon}}</div>
            <div class="activity-content">
              <h4>{{activity.title}}</h4>
              <p>{{activity.description}}</p>
              <small>{{formatTime(activity.timestamp)}}</small>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="showNotifications" class="notifications-panel">
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button (click)="toggleNotifications()" class="close-btn">×</button>
        </div>
        <div class="notifications-list">
          <div *ngFor="let notification of notifications" class="notification-item" [ngClass]="{'unread': !notification.isRead}">
            <div class="notification-content">
              <h4>{{notification.title}}</h4>
              <p>{{notification.message}}</p>
              <small>{{formatTime(notification.createdAt)}}</small>
            </div>
            <button *ngIf="!notification.isRead" (click)="markAsRead(notification.id)" class="mark-read-btn">
              Mark as Read
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    .dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .user-info { display: flex; align-items: center; gap: 20px; }
    .notifications { position: relative; }
    .notification-bell { font-size: 24px; cursor: pointer; position: relative; }
    .notification-badge { position: absolute; top: -8px; right: -8px; background: #e74c3c; color: white; border-radius: 50%; width: 20px; height: 20px; font-size: 12px; display: flex; align-items: center; justify-content: center; }
    .kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .kpi-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 15px; }
    .kpi-icon { font-size: 32px; }
    .kpi-content h3 { font-size: 28px; margin-bottom: 5px; color: #333; }
    .kpi-content p { color: #666; margin-bottom: 5px; }
    .kpi-trend { font-size: 12px; font-weight: bold; }
    .kpi-trend.positive { color: #27ae60; }
    .kpi-trend.negative { color: #e74c3c; }
    .quick-actions, .recent-activity { margin-bottom: 30px; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    .action-card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s; text-align: center; }
    .action-card:hover { transform: translateY(-2px); }
    .action-icon { font-size: 32px; margin-bottom: 10px; }
    .activity-list { background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .activity-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-bottom: 1px solid #eee; }
    .activity-item:last-child { border-bottom: none; }
    .activity-icon { font-size: 24px; }
    .activity-content h4 { margin-bottom: 5px; }
    .activity-content p { color: #666; margin-bottom: 5px; }
    .activity-content small { color: #999; }
    .notifications-panel { position: fixed; top: 80px; right: 20px; width: 350px; background: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); z-index: 1000; }
    .notifications-header { display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee; }
    .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; }
    .notifications-list { max-height: 400px; overflow-y: auto; }
    .notification-item { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: flex-start; }
    .notification-item.unread { background: #f0f8ff; }
    .notification-content h4 { margin-bottom: 5px; }
    .notification-content p { color: #666; margin-bottom: 5px; font-size: 14px; }
    .notification-content small { color: #999; }
    .mark-read-btn { background: #3498db; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; }
  `]
})
export class EnhancedDashboardComponent implements OnInit {
  kpis: any[] = [];
  quickActions: any[] = [];
  recentActivities: any[] = [];
  notifications: any[] = [];
  unreadCount = 0;
  showNotifications = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadKPIs();
    this.loadQuickActions();
    this.loadRecentActivities();
    this.loadNotifications();
  }

  loadKPIs() {
    this.kpis = [
      { icon: '📦', value: '1,234', label: 'Total Orders', change: '+12%', trend: 'positive' },
      { icon: '💰', value: '$45,678', label: 'Revenue', change: '+8%', trend: 'positive' },
      { icon: '🚚', value: '98%', label: 'Delivery Rate', change: '+2%', trend: 'positive' },
      { icon: '📊', value: '156', label: 'Active Customers', change: '-3%', trend: 'negative' }
    ];
  }

  loadQuickActions() {
    this.quickActions = [
      { icon: '🛍️', title: 'Browse Products', description: 'View product catalog', route: '/product-catalog' },
      { icon: '📋', title: 'Place Order', description: 'Create new order', route: '/orders/place' },
      { icon: '📍', title: 'Track Delivery', description: 'Real-time tracking', route: '/real-time-tracking' },
      { icon: '📊', title: 'View Reports', description: 'Analytics & insights', route: '/reports' }
    ];
  }

  loadRecentActivities() {
    this.recentActivities = [
      { icon: '📦', title: 'New Order Placed', description: 'Order #12345 from ABC Store', timestamp: new Date(Date.now() - 3600000) },
      { icon: '🚚', title: 'Delivery Completed', description: 'Order #12340 delivered successfully', timestamp: new Date(Date.now() - 7200000) },
      { icon: '💰', title: 'Payment Received', description: 'Invoice #INV-001 paid', timestamp: new Date(Date.now() - 10800000) }
    ];
  }

  loadNotifications() {
    this.notifications = [
      { id: 1, title: 'Order Confirmed', message: 'Your order #12345 has been confirmed', isRead: false, createdAt: new Date() },
      { id: 2, title: 'Low Stock Alert', message: 'Product XYZ is running low', isRead: false, createdAt: new Date(Date.now() - 3600000) }
    ];
    
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
  }

  getUsername(): string {
    return this.authService.getUsername() || 'User';
  }

  navigateTo(route: string) {
    console.log('Navigate to:', route);
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
      this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    }
  }

  formatTime(date: Date): string {
    return date.toLocaleString();
  }
}