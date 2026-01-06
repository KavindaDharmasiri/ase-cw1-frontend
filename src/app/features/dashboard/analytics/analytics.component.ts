import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  providers: [ReportService],
  template: `
    <div class="analytics-container">
      <h1>📈 Analytics Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Orders</h3>
          <div class="stat-number">{{totalOrders}}</div>
        </div>
        
        <div class="stat-card">
          <h3>Total Products</h3>
          <div class="stat-number">{{totalProducts}}</div>
        </div>
        
        <div class="stat-card">
          <h3>Low Stock Items</h3>
          <div class="stat-number">{{lowStockItems}}</div>
        </div>
        
        <div class="stat-card">
          <h3>Total Inventory</h3>
          <div class="stat-number">{{totalInventory}}</div>
        </div>
      </div>

      <div class="charts-section">
        <div class="chart-card">
          <h3>Order Status Distribution</h3>
          <div class="simple-chart">
            <div class="chart-bar" *ngFor="let status of orderStatusData">
              <span class="bar-label">{{status.name}}</span>
              <div class="bar" [style.width.%]="status.percentage">
                <span class="bar-value">{{status.count}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container { padding: 20px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .stat-card h3 { margin: 0 0 10px 0; color: #666; }
    .stat-number { font-size: 2em; font-weight: bold; color: #2c3e50; }
    .charts-section { margin-top: 30px; }
    .chart-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .simple-chart { margin-top: 15px; }
    .chart-bar { display: flex; align-items: center; margin-bottom: 10px; }
    .bar-label { width: 100px; font-size: 12px; }
    .bar { background: #3498db; height: 25px; display: flex; align-items: center; padding: 0 10px; color: white; font-size: 12px; min-width: 30px; }
  `]
})
export class AnalyticsComponent implements OnInit {
  totalOrders = 0;
  totalProducts = 0;
  lowStockItems = 0;
  totalInventory = 0;
  orderStatusData: any[] = [];

  constructor(
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    this.reportService.getDashboardReport().subscribe({
      next: (report) => {
        this.totalOrders = report.totalOrders;
        this.totalProducts = report.totalProducts;
        this.lowStockItems = report.lowStockItems;
        this.totalInventory = report.totalInventoryItems;
      },
      error: (error) => console.error('Error loading analytics:', error)
    });
  }

  calculateOrderStatusData(orders: any[]) {
    const statusCounts: { [key: string]: number } = {};
    orders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(statusCounts) as number[]);
    this.orderStatusData = Object.keys(statusCounts).map(status => ({
      name: status,
      count: statusCounts[status],
      percentage: (statusCounts[status] / maxCount) * 100
    }));
  }
}