import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn">
      <div class="nav-brand">
        <h2>🏝️ IslandLink</h2>
      </div>
      
      <div class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        
        <!-- Role-based navigation -->
        <a *ngIf="userRole === 'RETAILER'" routerLink="/retailer" routerLinkActive="active">Retailer</a>
        <a *ngIf="userRole === 'RDC_STAFF'" routerLink="/rdc-staff" routerLinkActive="active">RDC Staff</a>
        <a *ngIf="userRole === 'LOGISTICS'" routerLink="/logistics" routerLinkActive="active">Logistics</a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/head-office" routerLinkActive="active">Head Office</a>
        
        <!-- Common features -->
        <a *ngIf="userRole === 'RETAILER'" routerLink="/product-catalog" routerLinkActive="active">Browse Products</a>
        <a *ngIf="userRole === 'RDC_STAFF' || userRole === 'HEAD_OFFICE_MANAGER'" 
           routerLink="/products" routerLinkActive="active">Products</a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/bulk-upload" routerLinkActive="active">Bulk Upload</a>
        <a *ngIf="userRole === 'RDC_STAFF' || userRole === 'HEAD_OFFICE_MANAGER' || userRole === 'LOGISTICS'" 
           routerLink="/inventory" routerLinkActive="active">Inventory</a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/admin" routerLinkActive="active">Admin</a>
        <a routerLink="/profile" routerLinkActive="active">Profile</a>
      </div>
      
      <div class="nav-user">
        <span class="user-info">{{userRole}} | {{username}}</span>
        <button class="btn-logout" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #2c3e50;
      color: white;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .nav-brand h2 {
      margin: 0;
      color: #3498db;
    }
    
    .nav-menu {
      display: flex;
      gap: 20px;
    }
    
    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }
    
    .nav-menu a:hover,
    .nav-menu a.active {
      background: #34495e;
    }
    
    .nav-user {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .user-info {
      font-size: 14px;
      color: #bdc3c7;
    }
    
    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-logout:hover {
      background: #c0392b;
    }
  `]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userRole = '';
  username = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.userRole = this.authService.getUserRole() || '';
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        this.username = user.username;
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}