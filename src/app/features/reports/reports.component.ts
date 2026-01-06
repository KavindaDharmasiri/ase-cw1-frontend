import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/services/report.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  providers: [ReportService],
  template: `
    <div class="reports-container">
      <h1>📊 Comprehensive Reports</h1>
      
      <div class="reports-grid">
        <!-- Sales Report -->
        <div class="report-card">
          <h3>💰 Sales Report</h3>
          <div class="report-content">
            <div class="metric">
              <span class="label">Total Sales:</span>
              <span class="value">\${{salesReport.totalSales | number:'1.2-2'}}</span>
            </div>
            <div class="metric">
              <span class="label">Total Orders:</span>
              <span class="value">{{salesReport.totalOrders}}</span>
            </div>
            <div class="metric">
              <span class="label">Average Order Value:</span>
              <span class="value">\${{salesReport.averageOrderValue | number:'1.2-2'}}</span>
            </div>
          </div>
        </div>

        <!-- Inventory Report -->
        <div class="report-card">
          <h3>📦 Inventory Report</h3>
          <div class="report-content">
            <div class="metric">
              <span class="label">Total Items:</span>
              <span class="value">{{inventoryReport.totalItems}}</span>
            </div>
            <div class="metric">
              <span class="label">Low Stock Items:</span>
              <span class="value">{{inventoryReport.lowStockItems}}</span>
            </div>
            <div class="metric">
              <span class="label">Low Stock %:</span>
              <span class="value">{{inventoryReport.lowStockPercentage | number:'1.1-1'}}%</span>
            </div>
          </div>
        </div>

        <!-- Delivery Report -->
        <div class="report-card">
          <h3>🚚 Delivery Report</h3>
          <div class="report-content">
            <div class="metric">
              <span class="label">Total Deliveries:</span>
              <span class="value">{{deliveryReport.totalDeliveries}}</span>
            </div>
            <div class="metric">
              <span class="label">Delivered:</span>
              <span class="value">{{deliveryReport.deliveredCount}}</span>
            </div>
            <div class="metric">
              <span class="label">Delivery Rate:</span>
              <span class="value">{{deliveryReport.deliveryRate | number:'1.1-1'}}%</span>
            </div>
          </div>
        </div>

        <!-- Dashboard Summary -->
        <div class="report-card">
          <h3>📈 System Overview</h3>
          <div class="report-content">
            <div class="metric">
              <span class="label">Total Orders:</span>
              <span class="value">{{dashboardReport.totalOrders}}</span>
            </div>
            <div class="metric">
              <span class="label">Total Products:</span>
              <span class="value">{{dashboardReport.totalProducts}}</span>
            </div>
            <div class="metric">
              <span class="label">Inventory Items:</span>
              <span class="value">{{dashboardReport.totalInventoryItems}}</span>
            </div>
            <div class="metric">
              <span class="label">Low Stock Alerts:</span>
              <span class="value">{{dashboardReport.lowStockItems}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="actions">
        <button (click)="refreshReports()" class="btn btn-primary">🔄 Refresh Reports</button>
        <button (click)="exportReports()" class="btn btn-secondary">📥 Export Reports</button>
      </div>
    </div>
  `,
  styles: [`
    .reports-container { padding: 20px; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .report-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .report-card h3 { margin: 0 0 15px 0; color: #2c3e50; }
    .report-content { display: flex; flex-direction: column; gap: 10px; }
    .metric { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee; }
    .metric:last-child { border-bottom: none; }
    .label { font-weight: 500; color: #666; }
    .value { font-weight: bold; color: #2c3e50; font-size: 1.1em; }
    .actions { display: flex; gap: 15px; justify-content: center; }
    .btn { padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; }
    .btn-primary { background: #3498db; color: white; }
    .btn-secondary { background: #95a5a6; color: white; }
    .btn:hover { opacity: 0.9; }
  `]
})
export class ReportsComponent implements OnInit {
  salesReport: any = {};
  inventoryReport: any = {};
  deliveryReport: any = {};
  dashboardReport: any = {};

  constructor(private reportService: ReportService) {}

  ngOnInit() {
    this.loadAllReports();
  }

  loadAllReports() {
    this.reportService.getSalesReport().subscribe({
      next: (report) => this.salesReport = report,
      error: (error) => console.error('Error loading sales report:', error)
    });

    this.reportService.getInventoryReport().subscribe({
      next: (report) => this.inventoryReport = report,
      error: (error) => console.error('Error loading inventory report:', error)
    });

    this.reportService.getDeliveryReport().subscribe({
      next: (report) => this.deliveryReport = report,
      error: (error) => console.error('Error loading delivery report:', error)
    });

    this.reportService.getDashboardReport().subscribe({
      next: (report) => this.dashboardReport = report,
      error: (error) => console.error('Error loading dashboard report:', error)
    });
  }

  refreshReports() {
    this.loadAllReports();
  }

  exportReports() {
    // Simple export functionality
    const reportData = {
      sales: this.salesReport,
      inventory: this.inventoryReport,
      delivery: this.deliveryReport,
      dashboard: this.dashboardReport,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `islandlink-reports-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}