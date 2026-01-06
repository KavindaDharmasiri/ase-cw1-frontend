import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="logo">
            <svg class="icon-lg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h1>IslandLink ISDN</h1>
          </div>
          
          <div class="user-info">
            <div class="user-details">
              <div class="user-avatar">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div>
                <span class="user-name">{{ user?.username }}</span>
                <span class="user-role">{{ getRoleDisplay(user?.role) }}</span>
              </div>
            </div>
            <button class="btn btn-secondary" (click)="logout()">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main class="dashboard-main">
        <div class="welcome-section">
          <h2>Welcome to IslandLink Sales Distribution Network</h2>
          <p>Manage your distribution operations efficiently across all regional centers</p>
        </div>
        
        <div class="dashboard-grid">
          <div *ngIf="user?.role === 'RETAILER'" class="role-dashboard">
            <div class="dashboard-card primary">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Retailer Dashboard</h3>
                <p>Place orders, track deliveries, and manage your retail operations with ISDN's network of 5,000+ outlets.</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">24-48h</span>
                    <span class="stat-label">Delivery Time</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">5</span>
                    <span class="stat-label">Regional Centers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="user?.role === 'RDC_STAFF'" class="role-dashboard">
            <div class="dashboard-card secondary">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>RDC Staff Dashboard</h3>
                <p>Manage regional distribution center operations, inventory, and coordinate with retailers across your district cluster.</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">North/South/East/West/Central</span>
                    <span class="stat-label">Regional Coverage</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="user?.role === 'LOGISTICS'" class="role-dashboard">
            <div class="dashboard-card accent">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Logistics Dashboard</h3>
                <p>Coordinate transportation, delivery routes, and ensure efficient distribution across all regional centers.</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">Real-time</span>
                    <span class="stat-label">Route Tracking</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">5,000+</span>
                    <span class="stat-label">Delivery Points</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div *ngIf="user?.role === 'HEAD_OFFICE_MANAGER'" class="role-dashboard">
            <div class="dashboard-card premium">
              <div class="card-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="card-content">
                <h3>Head Office Manager Dashboard</h3>
                <p>Oversee all ISDN operations, strategic planning, procurement, and manage system-wide performance across all regions.</p>
                <div class="card-stats">
                  <div class="stat">
                    <span class="stat-number">Central</span>
                    <span class="stat-label">HQ Location</span>
                  </div>
                  <div class="stat">
                    <span class="stat-number">Island-wide</span>
                    <span class="stat-label">Operations</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="info-cards">
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>Fast-Moving Consumer Goods</h4>
                <p>Packaged foods, beverages, home cleaning products, and personal care items</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>24-48 Hour Delivery</h4>
                <p>Efficient distribution network ensuring quick delivery to all retail outlets</p>
              </div>
            </div>
            
            <div class="info-card">
              <div class="info-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <div class="info-content">
                <h4>5 Regional Centers</h4>
                <p>Strategic coverage across North, South, East, West, and Central provinces</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: var(--gray-50);
    }
    
    .dashboard-header {
      background: white;
      border-bottom: 1px solid var(--gray-200);
      box-shadow: var(--shadow-sm);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .logo h1 {
      color: var(--primary-blue);
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    
    .icon-lg {
      width: 32px;
      height: 32px;
      color: var(--primary-blue);
    }
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .user-details {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      background: var(--primary-blue);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }
    
    .user-name {
      font-weight: 600;
      color: var(--gray-800);
      display: block;
    }
    
    .user-role {
      font-size: 12px;
      color: var(--gray-600);
      display: block;
    }
    
    .dashboard-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    
    .welcome-section {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .welcome-section h2 {
      color: var(--gray-800);
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 8px;
    }
    
    .welcome-section p {
      color: var(--gray-600);
      font-size: 16px;
    }
    
    .dashboard-grid {
      display: grid;
      gap: 24px;
    }
    
    .dashboard-card {
      background: white;
      border-radius: var(--border-radius-lg);
      box-shadow: var(--shadow-md);
      padding: 32px;
      display: flex;
      gap: 24px;
      align-items: flex-start;
    }
    
    .dashboard-card.primary {
      border-left: 4px solid var(--primary-blue);
    }
    
    .dashboard-card.secondary {
      border-left: 4px solid var(--secondary-green);
    }
    
    .dashboard-card.accent {
      border-left: 4px solid var(--accent-orange);
    }
    
    .dashboard-card.premium {
      border-left: 4px solid var(--gray-800);
    }
    
    .card-icon {
      width: 64px;
      height: 64px;
      background: var(--gray-100);
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .card-icon svg {
      width: 32px;
      height: 32px;
      color: var(--gray-600);
    }
    
    .card-content h3 {
      color: var(--gray-800);
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .card-content p {
      color: var(--gray-600);
      margin-bottom: 20px;
      line-height: 1.6;
    }
    
    .card-stats {
      display: flex;
      gap: 32px;
    }
    
    .stat {
      text-align: center;
    }
    
    .stat-number {
      display: block;
      font-size: 20px;
      font-weight: 700;
      color: var(--primary-blue);
    }
    
    .stat-label {
      font-size: 12px;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-top: 24px;
    }
    
    .info-card {
      background: white;
      border-radius: var(--border-radius);
      padding: 20px;
      display: flex;
      gap: 16px;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--gray-200);
    }
    
    .info-icon {
      width: 48px;
      height: 48px;
      background: var(--primary-blue);
      border-radius: var(--border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .info-icon svg {
      width: 24px;
      height: 24px;
      color: white;
    }
    
    .info-content h4 {
      color: var(--gray-800);
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .info-content p {
      color: var(--gray-600);
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .header-content {
        padding: 16px;
      }
      
      .dashboard-main {
        padding: 24px 16px;
      }
      
      .dashboard-card {
        flex-direction: column;
        text-align: center;
      }
      
      .card-stats {
        justify-content: center;
      }
      
      .user-details {
        display: none;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  user: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  getRoleDisplay(role: string): string {
    const roleMap: { [key: string]: string } = {
      'RETAILER': '🏪 Retailer',
      'RDC_STAFF': '🏢 RDC Staff',
      'LOGISTICS': '🚛 Logistics',
      'HEAD_OFFICE_MANAGER': '👔 Head Office Manager'
    };
    return roleMap[role] || role;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}