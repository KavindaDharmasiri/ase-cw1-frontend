import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ho-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ho-reports">
      <div class="header">
        <h1>Reports & Analytics</h1>
        <div class="report-filters">
          <select [(ngModel)]="selectedPeriod" class="filter-select">
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="annual">Annual</option>
          </select>
          <select [(ngModel)]="selectedRdc" class="filter-select">
            <option value="">All RDCs</option>
            <option value="Colombo">Colombo RDC</option>
            <option value="Kandy">Kandy RDC</option>
            <option value="Galle">Galle RDC</option>
          </select>
        </div>
      </div>

      <div class="report-categories">
        <div class="category-card" [class.active]="activeCategory === 'sales'" (click)="setActiveCategory('sales')">
          <div class="category-icon">📈</div>
          <h3>Sales Performance</h3>
        </div>
        <div class="category-card" [class.active]="activeCategory === 'inventory'" (click)="setActiveCategory('inventory')">
          <div class="category-icon">📦</div>
          <h3>Inventory Reports</h3>
        </div>
        <div class="category-card" [class.active]="activeCategory === 'delivery'" (click)="setActiveCategory('delivery')">
          <div class="category-icon">🚚</div>
          <h3>Delivery Efficiency</h3>
        </div>
        <div class="category-card" [class.active]="activeCategory === 'staff'" (click)="setActiveCategory('staff')">
          <div class="category-icon">👥</div>
          <h3>Staff Performance</h3>
        </div>
        <div class="category-card" [class.active]="activeCategory === 'financial'" (click)="setActiveCategory('financial')">
          <div class="category-icon">💰</div>
          <h3>Financial Reports</h3>
        </div>
      </div>

      <div class="report-content">
        <!-- Sales Performance Reports -->
        <div *ngIf="activeCategory === 'sales'" class="report-section">
          <h2>Sales Performance Reports</h2>
          <div class="report-grid">
            <div class="report-item" *ngFor="let report of salesReports">
              <h4>{{report.title}}</h4>
              <p>{{report.description}}</p>
              <div class="report-actions">
                <button class="view-btn" (click)="viewReport(report)">View</button>
                <button class="export-btn" (click)="exportReport(report, 'pdf')">PDF</button>
                <button class="export-btn" (click)="exportReport(report, 'excel')">Excel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory Reports -->
        <div *ngIf="activeCategory === 'inventory'" class="report-section">
          <h2>Inventory Reports</h2>
          <div class="report-grid">
            <div class="report-item" *ngFor="let report of inventoryReports">
              <h4>{{report.title}}</h4>
              <p>{{report.description}}</p>
              <div class="report-actions">
                <button class="view-btn" (click)="viewReport(report)">View</button>
                <button class="export-btn" (click)="exportReport(report, 'pdf')">PDF</button>
                <button class="export-btn" (click)="exportReport(report, 'excel')">Excel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Efficiency Reports -->
        <div *ngIf="activeCategory === 'delivery'" class="report-section">
          <h2>Delivery Efficiency Reports</h2>
          <div class="report-grid">
            <div class="report-item" *ngFor="let report of deliveryReports">
              <h4>{{report.title}}</h4>
              <p>{{report.description}}</p>
              <div class="report-actions">
                <button class="view-btn" (click)="viewReport(report)">View</button>
                <button class="export-btn" (click)="exportReport(report, 'pdf')">PDF</button>
                <button class="export-btn" (click)="exportReport(report, 'excel')">Excel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Staff Performance Reports -->
        <div *ngIf="activeCategory === 'staff'" class="report-section">
          <h2>Staff Performance KPIs</h2>
          <div class="report-grid">
            <div class="report-item" *ngFor="let report of staffReports">
              <h4>{{report.title}}</h4>
              <p>{{report.description}}</p>
              <div class="report-actions">
                <button class="view-btn" (click)="viewReport(report)">View</button>
                <button class="export-btn" (click)="exportReport(report, 'pdf')">PDF</button>
                <button class="export-btn" (click)="exportReport(report, 'excel')">Excel</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Financial Reports -->
        <div *ngIf="activeCategory === 'financial'" class="report-section">
          <h2>Financial Reports</h2>
          <div class="report-grid">
            <div class="report-item" *ngFor="let report of financialReports">
              <h4>{{report.title}}</h4>
              <p>{{report.description}}</p>
              <div class="report-actions">
                <button class="view-btn" (click)="viewReport(report)">View</button>
                <button class="export-btn" (click)="exportReport(report, 'pdf')">PDF</button>
                <button class="export-btn" (click)="exportReport(report, 'excel')">Excel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="scheduled-reports">
        <h2>Scheduled Reports</h2>
        <div class="schedule-list">
          <div class="schedule-item" *ngFor="let schedule of scheduledReports">
            <div class="schedule-info">
              <h4>{{schedule.reportName}}</h4>
              <p>{{schedule.frequency}} • Next: {{schedule.nextRun | date:'short'}}</p>
            </div>
            <div class="schedule-actions">
              <button class="edit-btn" (click)="editSchedule(schedule)">Edit</button>
              <button class="run-btn" (click)="runNow(schedule)">Run Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ho-reports {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .report-filters {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
    }

    .report-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .category-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }

    .category-card.active {
      border-color: #3b82f6;
      background: #eff6ff;
    }

    .category-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }

    .report-content {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 2rem;
    }

    .report-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .report-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1.5rem;
      background: #f9fafb;
    }

    .report-item h4 {
      margin-bottom: 0.5rem;
      color: #1f2937;
    }

    .report-item p {
      color: #6b7280;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }

    .report-actions {
      display: flex;
      gap: 0.5rem;
    }

    .view-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      flex: 1;
    }

    .export-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .scheduled-reports {
      background: white;
      border-radius: 10px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .schedule-list {
      margin-top: 1rem;
    }

    .schedule-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      margin-bottom: 1rem;
    }

    .schedule-info h4 {
      margin-bottom: 0.25rem;
    }

    .schedule-info p {
      color: #6b7280;
      font-size: 0.9rem;
    }

    .schedule-actions {
      display: flex;
      gap: 0.5rem;
    }

    .edit-btn, .run-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .edit-btn {
      background: #f59e0b;
      color: white;
    }

    .run-btn {
      background: #10b981;
      color: white;
    }
  `]
})
export class HoReportsComponent implements OnInit {
  activeCategory = 'sales';
  selectedPeriod = 'monthly';
  selectedRdc = '';

  salesReports = [
    { id: 1, title: 'Sales Performance by RDC', description: 'Compare sales performance across all RDCs' },
    { id: 2, title: 'Product Sales Analysis', description: 'Top performing products and categories' },
    { id: 3, title: 'Customer Sales Trends', description: 'Customer purchasing patterns and trends' },
    { id: 4, title: 'Revenue Growth Analysis', description: 'Month-over-month revenue growth metrics' }
  ];

  inventoryReports = [
    { id: 5, title: 'Inventory Turnover Report', description: 'Stock turnover rates by product and RDC' },
    { id: 6, title: 'Stock Level Analysis', description: 'Current stock levels and reorder recommendations' },
    { id: 7, title: 'Damaged/Expired Stock', description: 'Report on damaged and expired inventory' },
    { id: 8, title: 'Inter-RDC Transfer Summary', description: 'Stock transfer activities between RDCs' }
  ];

  deliveryReports = [
    { id: 9, title: 'Delivery Performance Metrics', description: 'On-time delivery rates and performance KPIs' },
    { id: 10, title: 'Route Efficiency Analysis', description: 'Delivery route optimization and efficiency' },
    { id: 11, title: 'Failed Delivery Analysis', description: 'Analysis of failed deliveries and reasons' },
    { id: 12, title: 'Customer Satisfaction Report', description: 'Delivery satisfaction scores and feedback' }
  ];

  staffReports = [
    { id: 13, title: 'Staff Performance KPIs', description: 'Individual and team performance metrics' },
    { id: 14, title: 'Productivity Analysis', description: 'Staff productivity and efficiency metrics' },
    { id: 15, title: 'Training Requirements', description: 'Staff training needs and recommendations' },
    { id: 16, title: 'Attendance & Punctuality', description: 'Staff attendance and punctuality reports' }
  ];

  financialReports = [
    { id: 17, title: 'Revenue Summary', description: 'Consolidated revenue across all RDCs' },
    { id: 18, title: 'Payment Status Report', description: 'Outstanding payments and collection status' },
    { id: 19, title: 'Cash vs Online Payments', description: 'Payment method analysis and trends' },
    { id: 20, title: 'Profit & Loss Statement', description: 'Monthly P&L statements by RDC' }
  ];

  scheduledReports = [
    { reportName: 'Monthly Sales Summary', frequency: 'Monthly', nextRun: new Date(2024, 1, 1) },
    { reportName: 'Weekly Inventory Report', frequency: 'Weekly', nextRun: new Date(2024, 0, 15) },
    { reportName: 'Daily Delivery Performance', frequency: 'Daily', nextRun: new Date() }
  ];

  ngOnInit(): void {}

  setActiveCategory(category: string): void {
    this.activeCategory = category;
  }

  viewReport(report: any): void {
    console.log('Viewing report:', report);
  }

  exportReport(report: any, format: string): void {
    console.log(`Exporting report ${report.title} as ${format}`);
  }

  editSchedule(schedule: any): void {
    console.log('Editing schedule:', schedule);
  }

  runNow(schedule: any): void {
    console.log('Running report now:', schedule);
  }
}