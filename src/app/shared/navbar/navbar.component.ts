import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar fade-in" *ngIf="isLoggedIn">
      <div class="nav-brand">
        <div class="logo-container">
          <img src="logo.png" alt="IslandLink Logo" class="logo-image">
          <h2 class="gradient-text">IslandLink</h2>
        </div>
      </div>

      <div class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Dashboard
        </a>

        <!-- Role-based navigation -->
        <a *ngIf="userRole === 'RETAILER'" routerLink="/retailer" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          Retailer
        </a>
        <a *ngIf="userRole === 'RDC_STAFF'" routerLink="/rdc-staff" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z"/>
          </svg>
          RDC Staff
        </a>
        <a *ngIf="userRole === 'LOGISTICS'" routerLink="/logistics" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          Logistics
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/head-office" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
          Head Office
        </a>

        <!-- Common features -->
        <a *ngIf="userRole === 'RETAILER'" routerLink="/product-catalog" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
          </svg>
          Browse Products
        </a>
        <a *ngIf="userRole === 'RDC_STAFF' || userRole === 'HEAD_OFFICE_MANAGER'"
           routerLink="/products" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
          </svg>
          Products
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/bulk-upload" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          Bulk Upload
        </a>
        <a *ngIf="userRole === 'RDC_STAFF' || userRole === 'HEAD_OFFICE_MANAGER' || userRole === 'LOGISTICS'"
           routerLink="/inventory" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Inventory
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/admin" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
          </svg>
          Admin
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/rdc-management" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
          </svg>
          RDC Management
        </a>
        <a *ngIf="userRole === 'LOGISTICS'" routerLink="/logistics/routes" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Route Management
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/delivery-zones" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          Delivery Zones
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/suppliers" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          Suppliers
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/procurement" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Procurement
        </a>
        <a *ngIf="userRole === 'HEAD_OFFICE_MANAGER'" routerLink="/vehicles" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
          Vehicles
        </a>
        <a *ngIf="userRole === 'RDC_STAFF'" routerLink="/goods-receipt" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12l-4-4 1.41-1.41L11 12.17l6.59-6.59L19 7l-8 8z"/>
          </svg>
          Goods Receipt
        </a>
        <a *ngIf="userRole === 'RDC_STAFF'" routerLink="/warehouse" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 9L12 2 2 9h3v13h2v-7h2v7h2v-7h2v7h2v-7h2v7h2v-7h2v7h3V9h3z"/>
          </svg>
          Warehouse
        </a>
        <a *ngIf="userRole === 'RDC_STAFF'" routerLink="/driver-settlements" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
          </svg>
          Settlements
        </a>
        <a *ngIf="userRole === 'RETAILER'" routerLink="/cart" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
          </svg>
          Cart
          <span class="cart-badge" *ngIf="cartItemCount > 0">{{cartItemCount}}</span>
        </a>
        <a routerLink="/notifications" routerLinkActive="active" class="nav-link">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
          Notifications
          <span class="notification-badge" *ngIf="notificationCount > 0">{{notificationCount}}</span>
        </a>
      </div>

      <div class="nav-user">
        <div class="user-info">
          <div class="user-avatar">
            <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="user-details">
            <span class="user-role">{{userRole}}</span>
            <span class="user-name">{{username}}</span>
          </div>
        </div>
        <button class="btn-logout" (click)="logout()">
          <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
          </svg>
          Logout
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%);
      color: white;
      padding: 0 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      backdrop-filter: blur(10px);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .nav-brand {
      display: flex;
      align-items: center;
    }

    .logo-container {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 12px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      transition: all var(--transition-normal);
    }

    .logo-container:hover {
      background: rgba(255,255,255,0.15);
      transform: scale(1.05);
    }

    .logo-image {
      width: 48px;
      height: 48px;
      object-fit: contain;
      animation: pulse 2s infinite;
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }

    .nav-menu {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-link {
      color: rgba(255,255,255,0.9);
      text-decoration: none;
      padding: 10px 16px;
      border-radius: 8px;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    }

    .cart-badge, .notification-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      animation: pulse 2s infinite;
    }

    .nav-link::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left var(--transition-slow);
    }

    .nav-link:hover {
      background: rgba(255,255,255,0.15);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .nav-link:hover::before {
      left: 100%;
    }

    .nav-link.active {
      background: rgba(16,185,129,0.2);
      color: #10b981;
      box-shadow: 0 0 20px rgba(16,185,129,0.3);
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 16px;
      border-radius: 12px;
      background: rgba(255,255,255,0.1);
      backdrop-filter: blur(10px);
      transition: all var(--transition-normal);
    }

    .user-info:hover {
      background: rgba(255,255,255,0.15);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .user-details {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-role {
      font-size: 12px;
      color: rgba(255,255,255,0.8);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .user-name {
      font-size: 14px;
      color: white;
      font-weight: 600;
    }

    .btn-logout {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    }

    .btn-logout::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left var(--transition-slow);
    }

    .btn-logout:hover {
      background: linear-gradient(135deg, #dc2626, #b91c1c);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(239,68,68,0.4);
    }

    .btn-logout:hover::before {
      left: 100%;
    }

    .btn-logout:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      .navbar {
        padding: 0 16px;
        height: 60px;
      }

      .nav-menu {
        display: none;
      }

      .user-details {
        display: none;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userRole = '';
  username = '';
  cartItemCount = 0;
  notificationCount = 0;
  private routerSubscription?: Subscription;
  private cartSubscription?: Subscription;
  private notificationSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.checkAuthStatus();
    
    // Subscribe to router events to update navbar on navigation
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkAuthStatus();
      });

    // Subscribe to cart changes for retailers
    if (this.userRole === 'RETAILER') {
      this.cartSubscription = this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      });
    }

    // Subscribe to notification changes
    this.notificationSubscription = this.notificationService.getUnreadCount().subscribe(count => {
      this.notificationCount = count;
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
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
