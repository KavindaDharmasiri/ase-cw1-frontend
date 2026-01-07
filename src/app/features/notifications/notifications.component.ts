import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container fade-in">
      <div class="notifications-header">
        <h1>Notifications</h1>
        <button class="mark-all-read" (click)="markAllAsRead()" *ngIf="unreadCount > 0">
          Mark All as Read ({{unreadCount}})
        </button>
      </div>

      <div class="notifications-list" *ngIf="notifications.length > 0">
        <div class="notification-item" 
             *ngFor="let notification of notifications" 
             [class.unread]="!notification.isRead"
             (click)="markAsRead(notification.id)">
          <div class="notification-icon" [ngClass]="getIconClass(notification.type)">
            <span>{{getIconSymbol(notification.type)}}</span>
          </div>
          <div class="notification-content">
            <h3>{{notification.title}}</h3>
            <p>{{notification.message}}</p>
            <span class="notification-time">{{formatDate(notification.createdAt)}}</span>
          </div>
          <div class="notification-status" *ngIf="!notification.isRead">
            <span class="unread-dot"></span>
          </div>
        </div>
      </div>

      <div class="empty-notifications" *ngIf="notifications.length === 0">
        <div class="empty-icon">📭</div>
        <h2>No notifications yet</h2>
        <p>You'll see order updates, delivery notifications, and promotions here.</p>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container { padding: 40px; max-width: 800px; margin: 0 auto; }
    .notifications-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .notifications-header h1 { margin: 0; color: var(--gray-800); }
    .mark-all-read { padding: 8px 16px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .notification-item { display: flex; align-items: flex-start; gap: 16px; padding: 20px; background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 16px; cursor: pointer; transition: all var(--transition-normal); }
    .notification-item:hover { box-shadow: var(--shadow-md); }
    .notification-item.unread { border-left: 4px solid var(--primary-blue); background: var(--blue-50); }
    .notification-icon { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; }
    .notification-icon.order { background: var(--blue-100); color: var(--primary-blue); }
    .notification-icon.delivery { background: var(--green-100); color: var(--secondary-green); }
    .notification-icon.payment { background: var(--yellow-100); color: var(--yellow-600); }
    .notification-icon.promotion { background: var(--purple-100); color: var(--purple-600); }
    .notification-content { flex: 1; }
    .notification-content h3 { margin: 0 0 4px 0; font-size: 16px; color: var(--gray-800); }
    .notification-content p { margin: 0 0 8px 0; color: var(--gray-600); line-height: 1.4; }
    .notification-time { font-size: 12px; color: var(--gray-500); }
    .notification-status { display: flex; align-items: center; }
    .unread-dot { width: 8px; height: 8px; background: var(--primary-blue); border-radius: 50%; }
    .empty-notifications { text-align: center; padding: 80px 40px; }
    .empty-icon { font-size: 64px; margin-bottom: 24px; }
    .empty-notifications h2 { margin: 0 0 8px 0; color: var(--gray-600); }
    .empty-notifications p { color: var(--gray-500); }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
    
    this.notificationService.getUnreadCount().subscribe(count => {
      this.unreadCount = count;
    });
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead();
  }

  getIconClass(type: string): string {
    return type.toLowerCase();
  }

  getIconSymbol(type: string): string {
    switch (type) {
      case 'ORDER': return '📦';
      case 'DELIVERY': return '🚚';
      case 'PAYMENT': return '💳';
      case 'PROMOTION': return '🎉';
      default: return '📢';
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return notificationDate.toLocaleDateString();
  }
}