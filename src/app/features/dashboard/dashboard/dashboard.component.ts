import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService, DashboardStats } from '../../../core/services/dashboard.service';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DashboardService, ProductService, OrderService],
  template: `
    <div class="dashboard-container fade-in">
      <div class="welcome-section">
        <div class="welcome-card">
          <div class="welcome-header">
            <div class="user-avatar">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div class="welcome-text">
              <h1>Welcome back, {{username}}!</h1>
              <p class="role-badge">{{userRole}}</p>
            </div>
          </div>
          
          <div class="quick-stats" *ngIf="userRole === 'RETAILER'">
            <div class="stat-card">
              <h3>Recent Orders</h3>
              <p class="stat-number">{{ isLoading ? '...' : stats.recentOrders }}</p>
            </div>
            <div class="stat-card">
              <h3>Pending Deliveries</h3>
              <p class="stat-number">{{ isLoading ? '...' : stats.pendingDeliveries }}</p>
            </div>
            <div class="stat-card">
              <h3>Available Products</h3>
              <p class="stat-number">{{ isLoading ? '...' : stats.availableProducts }}</p>
            </div>
          </div>
          
          <div class="quick-actions">
            <h3>Quick Actions</h3>
            <div class="action-buttons">
              <a *ngIf="userRole === 'RETAILER'" routerLink="/product-catalog" class="action-btn primary">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z"/>
                </svg>
                Browse Products
              </a>
              <a *ngIf="userRole === 'RETAILER'" routerLink="/orders/place" class="action-btn secondary">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
                Place Order
              </a>
              <a *ngIf="userRole === 'RETAILER'" routerLink="/cart" class="action-btn secondary">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
                Shopping Cart
              </a>
              <a *ngIf="userRole === 'RETAILER'" routerLink="/returns" class="action-btn tertiary">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 17l3-2.94c-.39-.04-.68-.06-1-.06-2.67 0-8 1.34-8 4v2h9l-3-3zm2-15C8.34 2 6 4.34 6 7s2.34 5 5 5 5-2.34 5-5-2.34-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                Returns & Support
              </a>
              <a *ngIf="userRole === 'RETAILER'" routerLink="/invoices" class="action-btn tertiary">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
                My Invoices
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 40px;
      min-height: calc(100vh - 70px);
      background: linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%);
    }
    
    .welcome-section {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .welcome-card {
      background: white;
      border-radius: var(--border-radius-xl);
      box-shadow: var(--shadow-xl);
      padding: 48px;
      border: 1px solid var(--gray-200);
      position: relative;
      overflow: hidden;
    }
    
    .welcome-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-blue), var(--secondary-green));
    }
    
    .welcome-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .user-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-lg);
    }
    
    .user-avatar .icon {
      width: 40px;
      height: 40px;
    }
    
    .welcome-text h1 {
      margin: 0 0 8px 0;
      font-size: 32px;
      font-weight: 700;
      color: var(--gray-800);
    }
    
    .role-badge {
      display: inline-block;
      padding: 6px 16px;
      background: linear-gradient(135deg, var(--secondary-green), var(--secondary-green-light));
      color: white;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: var(--gray-50);
      padding: 24px;
      border-radius: var(--border-radius-lg);
      text-align: center;
      border: 1px solid var(--gray-200);
      transition: all var(--transition-normal);
    }
    
    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-lg);
    }
    
    .stat-card h3 {
      margin: 0 0 8px 0;
      font-size: 14px;
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-number {
      margin: 0;
      font-size: 36px;
      font-weight: 700;
      color: var(--primary-blue);
    }
    
    .quick-actions h3 {
      margin: 0 0 24px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-800);
    }
    
    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
      border-radius: var(--border-radius-lg);
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      transition: all var(--transition-normal);
      border: 2px solid transparent;
    }
    
    .action-btn.primary {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green));
      color: white;
      box-shadow: var(--shadow-md);
    }
    
    .action-btn.primary:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-xl);
    }
    
    .action-btn.secondary {
      background: var(--gray-100);
      color: var(--gray-700);
      border-color: var(--gray-300);
    }
    
    .action-btn.secondary:hover {
      background: var(--gray-200);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .action-btn.tertiary {
      background: rgba(16, 185, 129, 0.1);
      color: var(--secondary-green);
      border-color: var(--secondary-green);
    }
    
    .action-btn.tertiary:hover {
      background: var(--secondary-green);
      color: white;
      transform: translateY(-2px);
    }
    
    .action-btn .icon {
      width: 24px;
      height: 24px;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 20px;
      }
      
      .welcome-card {
        padding: 32px 24px;
      }
      
      .welcome-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }
      
      .welcome-text h1 {
        font-size: 24px;
      }
      
      .action-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userRole = '';
  username = '';
  stats: DashboardStats = {
    recentOrders: 0,
    pendingDeliveries: 0,
    availableProducts: 0
  };
  isLoading = true;

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private productService: ProductService,
    private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    this.username = this.authService.getUsername() || '';
    this.loadDashboardData();
  }

  loadDashboardData() {
    console.log('Loading dashboard data...');
    this.dashboardService.getDashboardStats().subscribe({
      next: (stats) => {
        console.log('Dashboard stats received:', stats);
        this.stats = stats;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Dashboard stats error:', error);
        this.loadFallbackData();
      }
    });
  }

  loadFallbackData() {
    // Get product count
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.stats.availableProducts = products.length;
      },
      error: () => {
        this.stats.availableProducts = 0;
      }
    });

    // Get order count (if user is retailer)
    if (this.userRole === 'RETAILER') {
      this.orderService.getAllOrders().subscribe({
        next: (orders) => {
          this.stats.recentOrders = orders.filter(o => 
            new Date(o.orderDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length;
          this.stats.pendingDeliveries = orders.filter(o => 
            o.status === 'SHIPPED' || o.status === 'OUT_FOR_DELIVERY'
          ).length;
        },
        error: () => {
          this.stats.recentOrders = 0;
          this.stats.pendingDeliveries = 0;
        }
      });
    }
    
    this.isLoading = false;
  }

  logout() {
    this.authService.logout();
  }
}