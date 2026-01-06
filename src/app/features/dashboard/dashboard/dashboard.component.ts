import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="sidebar">
        <div class="user-info">
          <h3>{{userRole}}</h3>
          <p>{{username}}</p>
        </div>
        
        <nav class="nav-menu">
          <!-- RETAILER Menu -->
          <div *ngIf="userRole === 'RETAILER'">
            <a routerLink="/products" routerLinkActive="active">🛍️ Browse Products</a>
            <a routerLink="/orders/place" routerLinkActive="active">📋 Place Order</a>
            <a routerLink="/orders" routerLinkActive="active">📄 My Orders</a>
            <a routerLink="/profile" routerLinkActive="active">👤 Profile</a>
          </div>

          <!-- RDC_STAFF Menu -->
          <div *ngIf="userRole === 'RDC_STAFF'">
            <a routerLink="/orders/manage" routerLinkActive="active">📦 Manage Orders</a>
            <a routerLink="/inventory" routerLinkActive="active">📊 Inventory</a>
            <a routerLink="/stock-transfers" routerLinkActive="active">🔄 Stock Transfers</a>
            <a routerLink="/products" routerLinkActive="active">🛍️ Products</a>
          </div>

          <!-- LOGISTICS Menu -->
          <div *ngIf="userRole === 'LOGISTICS'">
            <a routerLink="/deliveries" routerLinkActive="active">🚚 Deliveries</a>
            <a routerLink="/orders/status" routerLinkActive="active">📋 Order Status</a>
            <a routerLink="/delivery-tracking" routerLinkActive="active">📍 Track Deliveries</a>
          </div>

          <!-- HEAD_OFFICE_MANAGER Menu -->
          <div *ngIf="userRole === 'HEAD_OFFICE_MANAGER'">
            <a routerLink="/analytics" routerLinkActive="active">📈 Analytics</a>
            <a routerLink="/orders/manage" routerLinkActive="active">📋 All Orders</a>
            <a routerLink="/inventory" routerLinkActive="active">📊 Inventory</a>
            <a routerLink="/products" routerLinkActive="active">🛍️ Products</a>
            <a routerLink="/invoices" routerLinkActive="active">💰 Invoices</a>
            <a routerLink="/reports" routerLinkActive="active">📊 Reports</a>
          </div>
        </nav>

        <button class="logout-btn" (click)="logout()">🚪 Logout</button>
      </div>

      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 250px;
      background: #2c3e50;
      color: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .user-info {
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid #34495e;
    }
    .user-info h3 {
      margin: 0;
      color: #3498db;
    }
    .nav-menu {
      flex: 1;
    }
    .nav-menu a {
      display: block;
      padding: 12px 16px;
      color: #ecf0f1;
      text-decoration: none;
      margin-bottom: 8px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    .nav-menu a:hover, .nav-menu a.active {
      background: #3498db;
    }
    .logout-btn {
      padding: 12px;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 20px;
    }
    .main-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
    }
  `]
})
export class DashboardComponent implements OnInit {
  userRole = '';
  username = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    this.username = this.authService.getUsername() || '';
  }

  logout() {
    this.authService.logout();
  }
}