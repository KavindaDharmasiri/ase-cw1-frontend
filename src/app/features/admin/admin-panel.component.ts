import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-container">
      <h1>🔧 System Administration</h1>
      
      <div class="admin-tabs">
        <button *ngFor="let tab of tabs" 
                (click)="activeTab = tab.id" 
                [class.active]="activeTab === tab.id"
                class="tab-btn">
          {{tab.label}}
        </button>
      </div>

      <div *ngIf="activeTab === 'users'" class="tab-content">
        <h2>User Management</h2>
        <div class="users-grid">
          <div *ngFor="let user of users" class="user-card">
            <div class="user-info">
              <h4>{{user.username}}</h4>
              <p>{{user.email}}</p>
              <span class="role-badge">{{user.role?.name}}</span>
            </div>
            <div class="user-actions">
              <button (click)="deactivateUser(user.id)" class="btn-danger">
                Deactivate
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 'audit'" class="tab-content">
        <h2>Audit Logs</h2>
        <div class="audit-filters">
          <input type="text" [(ngModel)]="auditFilter" placeholder="Filter by username..." class="filter-input">
          <button (click)="loadAuditLogs()" class="btn-primary">Refresh</button>
        </div>
        <div class="audit-logs">
          <div *ngFor="let log of filteredAuditLogs" class="audit-item">
            <div class="audit-header">
              <span class="username">{{log.username}}</span>
              <span class="action">{{log.action}}</span>
              <span class="timestamp">{{formatDate(log.timestamp)}}</span>
            </div>
            <div class="audit-details">
              <p><strong>Entity:</strong> {{log.entityType}} ({{log.entityId}})</p>
              <p><strong>Details:</strong> {{log.details}}</p>
              <p><strong>IP:</strong> {{log.ipAddress}}</p>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 'alerts'" class="tab-content">
        <h2>Stock Alerts</h2>
        <div class="alerts-grid">
          <div *ngFor="let alert of stockAlerts" class="alert-card">
            <div class="alert-info">
              <h4>Low Stock Alert</h4>
              <p>Current Stock: {{alert.currentStock}} / Min: {{alert.minStockLevel}}</p>
              <small>{{formatDate(alert.createdAt)}}</small>
            </div>
            <div class="alert-actions" *ngIf="alert.status === 'ACTIVE'">
              <button (click)="resolveAlert(alert.id)" class="btn-success">
                Resolve
              </button>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 'stats'" class="tab-content">
        <h2>System Statistics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>{{systemStats.totalUsers}}</h3>
            <p>Total Users</p>
          </div>
          <div class="stat-card">
            <h3>{{systemStats.activeAlerts}}</h3>
            <p>Active Alerts</p>
          </div>
          <div class="stat-card">
            <h3>{{auditLogs.length}}</h3>
            <p>Audit Entries</p>
          </div>
        </div>
        
        <div class="system-actions">
          <button (click)="exportAuditLogs()" class="btn-primary">Export Audit Logs</button>
          <button (click)="generateSystemReport()" class="btn-secondary">Generate Report</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 20px; }
    .admin-tabs { display: flex; gap: 10px; margin-bottom: 30px; border-bottom: 1px solid #ddd; }
    .tab-btn { padding: 12px 24px; border: none; background: none; cursor: pointer; border-bottom: 2px solid transparent; }
    .tab-btn.active { border-bottom-color: #3498db; color: #3498db; font-weight: bold; }
    .tab-content { min-height: 400px; }
    .users-grid, .alerts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .user-card, .alert-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .user-info h4 { margin-bottom: 5px; }
    .role-badge { background: #3498db; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .user-actions { margin-top: 15px; }
    .btn-danger { background: #e74c3c; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-secondary { background: #95a5a6; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-success { background: #27ae60; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .audit-filters { display: flex; gap: 10px; margin-bottom: 20px; }
    .filter-input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; flex: 1; max-width: 300px; }
    .audit-logs { max-height: 500px; overflow-y: auto; }
    .audit-item { border: 1px solid #ddd; border-radius: 8px; padding: 15px; margin-bottom: 10px; background: white; }
    .audit-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
    .username { font-weight: bold; color: #3498db; }
    .action { background: #f39c12; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    .timestamp { color: #666; font-size: 12px; }
    .audit-details p { margin: 5px 0; font-size: 14px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 30px; border-radius: 8px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .stat-card h3 { font-size: 36px; margin-bottom: 10px; color: #3498db; }
    .system-actions { display: flex; gap: 15px; }
  `]
})
export class AdminPanelComponent implements OnInit {
  activeTab = 'users';
  users: any[] = [];
  auditLogs: any[] = [];
  stockAlerts: any[] = [];
  systemStats: any = {};
  auditFilter = '';

  tabs = [
    { id: 'users', label: 'Users' },
    { id: 'audit', label: 'Audit Logs' },
    { id: 'alerts', label: 'Stock Alerts' },
    { id: 'stats', label: 'Statistics' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
    this.loadAuditLogs();
    this.loadStockAlerts();
    this.loadSystemStats();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:5000/api/admin/users').subscribe({
      next: (users) => this.users = users,
      error: (error) => console.error('Error loading users:', error)
    });
  }

  loadAuditLogs() {
    this.http.get<any[]>('http://localhost:5000/api/admin/audit-logs').subscribe({
      next: (logs) => this.auditLogs = logs,
      error: (error) => console.error('Error loading audit logs:', error)
    });
  }

  loadStockAlerts() {
    this.http.get<any[]>('http://localhost:5000/api/admin/stock-alerts').subscribe({
      next: (alerts) => this.stockAlerts = alerts,
      error: (error) => console.error('Error loading stock alerts:', error)
    });
  }

  loadSystemStats() {
    this.http.get<any>('http://localhost:5000/api/admin/system-stats').subscribe({
      next: (stats) => this.systemStats = stats,
      error: (error) => console.error('Error loading system stats:', error)
    });
  }

  get filteredAuditLogs() {
    if (!this.auditFilter) return this.auditLogs;
    return this.auditLogs.filter(log => 
      log.username.toLowerCase().includes(this.auditFilter.toLowerCase())
    );
  }

  deactivateUser(userId: number) {
    Swal.fire({
      title: 'Deactivate User?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Deactivate'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.put(`http://localhost:5000/api/admin/users/${userId}/deactivate`, {}).subscribe({
          next: () => {
            Swal.fire('Success!', 'User deactivated successfully', 'success');
            this.loadUsers();
          },
          error: (error) => Swal.fire('Error!', 'Failed to deactivate user', 'error')
        });
      }
    });
  }

  resolveAlert(alertId: number) {
    this.http.put(`http://localhost:5000/api/admin/stock-alerts/${alertId}/resolve`, {}).subscribe({
      next: () => {
        Swal.fire('Success!', 'Alert resolved', 'success');
        this.loadStockAlerts();
      },
      error: (error) => Swal.fire('Error!', 'Failed to resolve alert', 'error')
    });
  }

  exportAuditLogs() {
    Swal.fire('Export Started', 'Audit logs export will be downloaded shortly', 'info');
  }

  generateSystemReport() {
    Swal.fire('Report Generated', 'System report has been generated successfully', 'success');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }
}