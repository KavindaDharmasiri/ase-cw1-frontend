import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'ORDER' | 'DELIVERY' | 'PAYMENT' | 'PROMOTION';
  isRead: boolean;
  createdAt: Date;
  orderId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {
    this.loadNotifications();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  loadNotifications(): void {
    this.http.get<Notification[]>(`${environment.apiUrl}/notifications`).subscribe({
      next: (notifications) => {
        this.notifications.next(notifications);
        this.updateUnreadCount(notifications);
      },
      error: () => {
        // Fallback to local notifications
        const localNotifications = this.getLocalNotifications();
        this.notifications.next(localNotifications);
        this.updateUnreadCount(localNotifications);
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.http.put(`${environment.apiUrl}/notifications/${notificationId}/read`, {}).subscribe({
      next: () => {
        const current = this.notifications.value;
        const notification = current.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
          this.notifications.next(current);
          this.updateUnreadCount(current);
        }
      }
    });
  }

  markAllAsRead(): void {
    this.http.put(`${environment.apiUrl}/notifications/read-all`, {}).subscribe({
      next: () => {
        const current = this.notifications.value.map(n => ({ ...n, isRead: true }));
        this.notifications.next(current);
        this.unreadCount.next(0);
      }
    });
  }

  addLocalNotification(notification: Omit<Notification, 'id' | 'createdAt'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      createdAt: new Date()
    };

    const current = [newNotification, ...this.notifications.value];
    this.notifications.next(current);
    this.updateUnreadCount(current);

    // Store in localStorage
    localStorage.setItem('notifications', JSON.stringify(current));
  }

  private updateUnreadCount(notifications: Notification[]): void {
    const count = notifications.filter(n => !n.isRead).length;
    this.unreadCount.next(count);
  }

  private getLocalNotifications(): Notification[] {
    const stored = localStorage.getItem('notifications');
    return stored ? JSON.parse(stored) : [];
  }
}
