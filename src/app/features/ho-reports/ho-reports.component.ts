import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

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
              </div>
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
  reportData: any = {};

  constructor(private http: HttpClient) {}

  salesReports = [
    { id: 1, title: 'Sales Performance Dashboard', description: 'Comprehensive sales metrics and analytics', endpoint: '/reports/sales' },
    { id: 2, title: 'Sales Trends Analysis', description: 'Monthly trends and growth patterns', endpoint: '/reports/sales' },
    { id: 3, title: 'Category Performance', description: 'Sales breakdown by product categories', endpoint: '/reports/sales' },
    { id: 4, title: 'Regional Sales Report', description: 'Performance analysis by geographic regions', endpoint: '/reports/sales' },
    { id: 5, title: 'Top Products Report', description: 'Best performing products and revenue drivers', endpoint: '/reports/sales' },
    { id: 6, title: 'Customer Segment Analysis', description: 'Sales performance by customer segments', endpoint: '/reports/sales' },
    { id: 7, title: 'Export Sales Data', description: 'Download comprehensive sales data as CSV', endpoint: '/reports/sales/export' }
  ];

  inventoryReports = [
    { id: 5, title: 'Inventory Summary', description: 'Current inventory levels and status', endpoint: '/reports/inventory' },
    { id: 6, title: 'Low Stock Alert', description: 'Items requiring immediate restocking', endpoint: '/reports/inventory' },
    { id: 7, title: 'Export Inventory Data', description: 'Download inventory report as CSV', endpoint: '/reports/inventory/export' },
    { id: 8, title: 'Stock Movement Report', description: 'Track inventory movements and transfers', endpoint: '/reports/inventory' }
  ];

  deliveryReports = [
    { id: 9, title: 'Delivery Performance', description: 'Delivery success rates and metrics', endpoint: '/reports/deliveries' },
    { id: 10, title: 'Route Efficiency', description: 'Delivery route performance analysis', endpoint: '/reports/deliveries' },
    { id: 11, title: 'Settlement Reports', description: 'Driver settlement and reconciliation', endpoint: '/reports/settlements' },
    { id: 12, title: 'Logistics Overview', description: 'Complete logistics performance dashboard', endpoint: '/reports/deliveries' }
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
    let apiUrl = `${environment.apiUrl}${report.endpoint}`;
    
    // Add filters for sales reports
    if (report.endpoint === '/reports/sales') {
      const params = new URLSearchParams();
      if (this.selectedRdc) params.append('rdc', this.selectedRdc);
      if (this.selectedPeriod) {
        const now = new Date();
        let startDate, endDate;
        
        switch(this.selectedPeriod) {
          case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            break;
          case 'quarterly':
            const quarter = Math.floor(now.getMonth() / 3);
            startDate = new Date(now.getFullYear(), quarter * 3, 1);
            endDate = new Date(now.getFullYear(), (quarter + 1) * 3, 0);
            break;
          case 'annual':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31);
            break;
        }
        
        if (startDate && endDate) {
          params.append('startDate', startDate.toISOString().slice(0, 19));
          params.append('endDate', endDate.toISOString().slice(0, 19));
        }
      }
      
      if (params.toString()) {
        apiUrl += '?' + params.toString();
      }
    }
    
    this.http.get(apiUrl).subscribe({
      next: (data: any) => {
        this.reportData = data;
        this.generateSalesPerformancePDF(report, data);
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to load report data', 'error');
        console.error('Report error:', error);
      }
    });
  }

  generateSalesPerformancePDF(report: any, data: any): void {
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    
    // Header with gradient background
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('IslandLink Distribution System', 105, 20, { align: 'center' });
    doc.setFontSize(18);
    doc.text('Sales Performance Analytics Report', 105, 35, { align: 'center' });
    doc.setFontSize(12);
    doc.text(report.title, 105, 45, { align: 'center' });
    
    // Report info section
    doc.setFillColor(239, 246, 255);
    doc.rect(10, 55, 190, 25, 'F');
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 65);
    doc.text(`Period: ${this.selectedPeriod.toUpperCase()}`, 15, 72);
    if (this.selectedRdc) {
      doc.text(`RDC Filter: ${this.selectedRdc}`, 120, 65);
    }
    doc.text(`Report Type: ${report.title}`, 120, 72);
    
    let yPos = 90;
    
    // Executive Summary
    doc.setFillColor(16, 185, 129);
    doc.rect(10, yPos - 5, 190, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('EXECUTIVE SUMMARY', 15, yPos + 5);
    
    doc.setTextColor(31, 41, 55);
    yPos += 25;
    
    // Key metrics in colored boxes
    const metrics = [
      { label: 'Total Sales Revenue', value: `LKR ${data.totalSales?.toFixed(2) || 0}`, color: [254, 249, 195] },
      { label: 'Total Orders Processed', value: `${data.totalOrders || 0}`, color: [220, 252, 231] },
      { label: 'Average Order Value', value: `LKR ${data.averageOrderValue?.toFixed(2) || 0}`, color: [219, 234, 254] },
      { label: 'Revenue Growth Rate', value: `${data.trends?.growthRate || 0}%`, color: [254, 215, 215] }
    ];
    
    metrics.forEach((metric, index) => {
      doc.setFillColor(...metric.color);
      doc.rect(15, yPos - 3, 180, 12, 'F');
      doc.setFontSize(11);
      doc.text(`${metric.label}: ${metric.value}`, 20, yPos + 5);
      yPos += 15;
    });
    
    yPos += 10;
    
    // Sales Trends Analysis
    if (data.trends) {
      doc.setFillColor(147, 51, 234);
      doc.rect(10, yPos - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('SALES TRENDS ANALYSIS', 15, yPos + 5);
      
      doc.setTextColor(31, 41, 55);
      yPos += 20;
      
      doc.text('Performance vs Previous Period:', 20, yPos);
      yPos += 10;
      doc.text(`• Current Period Revenue: LKR ${data.trends.currentMonth?.toFixed(2) || 0}`, 25, yPos);
      yPos += 8;
      doc.text(`• Previous Period Revenue: LKR ${data.trends.previousMonth?.toFixed(2) || 0}`, 25, yPos);
      yPos += 8;
      doc.text(`• Growth Rate: ${data.trends.growthRate || 0}%`, 25, yPos);
      yPos += 8;
      doc.text(`• Monthly Target: LKR ${data.trends.monthlyTarget?.toFixed(2) || 0}`, 25, yPos);
      yPos += 8;
      doc.text(`• Target Achievement: ${data.trends.targetAchievement || 0}%`, 25, yPos);
      yPos += 15;
    }
    
    // Category Performance
    if (data.categoryBreakdown) {
      doc.setFillColor(59, 130, 246);
      doc.rect(10, yPos - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('CATEGORY PERFORMANCE BREAKDOWN', 15, yPos + 5);
      
      doc.setTextColor(31, 41, 55);
      yPos += 20;
      
      Object.entries(data.categoryBreakdown).forEach(([category, details]: [string, any]) => {
        const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1');
        doc.text(`${categoryName}:`, 20, yPos);
        yPos += 8;
        doc.text(`  • Revenue: LKR ${details.revenue?.toFixed(2) || 0}`, 25, yPos);
        yPos += 6;
        doc.text(`  • Orders: ${details.orders || 0}`, 25, yPos);
        yPos += 6;
        doc.text(`  • Growth Rate: ${details.growthRate || 0}%`, 25, yPos);
        yPos += 6;
        doc.text(`  • Avg Order Value: LKR ${details.avgOrderValue?.toFixed(2) || 0}`, 25, yPos);
        yPos += 10;
      });
    }
    
    // Add new page for additional content
    doc.addPage();
    yPos = 20;
    
    // Regional Performance
    if (data.regional) {
      doc.setFillColor(245, 158, 11);
      doc.rect(10, yPos - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(12);
      doc.text('REGIONAL PERFORMANCE ANALYSIS', 15, yPos + 5);
      
      doc.setTextColor(31, 41, 55);
      yPos += 20;
      
      Object.entries(data.regional).forEach(([region, details]: [string, any]) => {
        const regionName = region.charAt(0).toUpperCase() + region.slice(1);
        doc.text(`${regionName} Region:`, 20, yPos);
        yPos += 8;
        doc.text(`  • Revenue: LKR ${details.revenue?.toFixed(2) || 0}`, 25, yPos);
        yPos += 6;
        doc.text(`  • Orders: ${details.orders || 0}`, 25, yPos);
        yPos += 6;
        doc.text(`  • Growth Rate: ${details.growthRate || 0}%`, 25, yPos);
        yPos += 6;
        doc.text(`  • Market Share: ${details.marketShare || 0}%`, 25, yPos);
        yPos += 10;
      });
    }
    
    // Top Products
    if (data.topProducts) {
      doc.setFillColor(168, 85, 247);
      doc.rect(10, yPos - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('TOP PERFORMING PRODUCTS', 15, yPos + 5);
      
      doc.setTextColor(31, 41, 55);
      yPos += 20;
      
      data.topProducts.forEach((product: any, index: number) => {
        doc.text(`${index + 1}. ${product.name}`, 20, yPos);
        yPos += 8;
        doc.text(`   Category: ${product.category} | Revenue: LKR ${product.revenue?.toFixed(2) || 0} | Units: ${product.units || 0}`, 25, yPos);
        yPos += 12;
      });
    }
    
    // Customer Segments
    if (data.customerSegments) {
      doc.setFillColor(220, 38, 127);
      doc.rect(10, yPos - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('CUSTOMER SEGMENT ANALYSIS', 15, yPos + 5);
      
      doc.setTextColor(31, 41, 55);
      yPos += 20;
      
      Object.entries(data.customerSegments).forEach(([segment, details]: [string, any]) => {
        const segmentName = segment.charAt(0).toUpperCase() + segment.slice(1);
        doc.text(`${segmentName} Customers:`, 20, yPos);
        yPos += 8;
        doc.text(`  • Percentage: ${details.percentage || 0}%`, 25, yPos);
        yPos += 6;
        doc.text(`  • Avg Order Value: LKR ${details.avgOrderValue?.toFixed(2) || 0}`, 25, yPos);
        yPos += 6;
        doc.text(`  • Total Revenue: LKR ${details.revenue?.toFixed(2) || 0}`, 25, yPos);
        yPos += 10;
      });
    }
    
    // Performance Metrics
    if (data.performance) {
      doc.setFillColor(34, 197, 94);
      doc.rect(10, yPos - 5, 190, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text('KEY PERFORMANCE INDICATORS', 15, yPos + 5);
      
      doc.setTextColor(31, 41, 55);
      yPos += 20;
      
      const kpis = [
        { label: 'Revenue Growth Rate', value: `${data.performance.revenueGrowthRate || 0}%` },
        { label: 'Order Conversion Rate', value: `${data.performance.orderConversionRate || 0}%` },
        { label: 'Customer Retention Rate', value: `${data.performance.customerRetentionRate || 0}%` },
        { label: 'Average Items per Order', value: `${data.performance.averageItemsPerOrder || 0}` },
        { label: 'Repeat Customer Rate', value: `${data.performance.repeatCustomerRate || 0}%` },
        { label: 'Cart Abandonment Rate', value: `${data.performance.cartAbandonmentRate || 0}%` }
      ];
      
      kpis.forEach(kpi => {
        doc.text(`• ${kpi.label}: ${kpi.value}`, 20, yPos);
        yPos += 8;
      });
    }
    
    // Footer
    doc.setFillColor(75, 85, 99);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('IslandLink Distribution System - Sales Performance Analytics', 105, 280, { align: 'center' });
    doc.text(`Generated by: HEAD_OFFICE_MANAGER | ${new Date().toLocaleString()}`, 105, 290, { align: 'center' });
    
    // Display PDF
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    Swal.fire({
      title: `${report.title} - Sales Performance Report`,
      html: `<iframe src="${pdfUrl}" width="100%" height="600px" style="border: none;"></iframe>`,
      width: '90%',
      showCloseButton: true,
      showConfirmButton: false,
      didDestroy: () => {
        URL.revokeObjectURL(pdfUrl);
      }
    });
  }
  generateDetailedPDF(report: any, data: any): void {
    // Fallback for non-sales reports
    if (report.endpoint === '/reports/sales') {
      this.generateSalesPerformancePDF(report, data);
      return;
    }
    
    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF();
    
    // Standard report generation for other report types
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('IslandLink Distribution System', 105, 20, { align: 'center' });
    doc.setFontSize(16);
    doc.text(report.title, 105, 35, { align: 'center' });
    
    doc.setTextColor(31, 41, 55);
    doc.setFillColor(239, 246, 255);
    doc.rect(10, 50, 190, 25, 'F');
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 60);
    doc.text(`Period: ${this.selectedPeriod}`, 15, 67);
    if (this.selectedRdc) {
      doc.text(`RDC: ${this.selectedRdc}`, 15, 74);
    }
    
    let yPos = 90;
    
    // Basic data display for other reports
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        doc.setFontSize(12);
        doc.text(`${key.toUpperCase()}:`, 20, yPos);
        yPos += 10;
        Object.entries(value as any).forEach(([subKey, subValue]) => {
          doc.setFontSize(10);
          doc.text(`  ${subKey}: ${subValue}`, 25, yPos);
          yPos += 8;
        });
        yPos += 5;
      } else {
        doc.setFontSize(10);
        doc.text(`${key}: ${value}`, 20, yPos);
        yPos += 10;
      }
    });
    
    // Footer
    doc.setFillColor(75, 85, 99);
    doc.rect(0, 270, 210, 27, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('IslandLink Distribution System - Report Generation', 105, 280, { align: 'center' });
    doc.text(`Generated by: HEAD_OFFICE_MANAGER`, 105, 290, { align: 'center' });
    
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    Swal.fire({
      title: report.title,
      html: `<iframe src="${pdfUrl}" width="100%" height="600px" style="border: none;"></iframe>`,
      width: '90%',
      showCloseButton: true,
      showConfirmButton: false,
      didDestroy: () => {
        URL.revokeObjectURL(pdfUrl);
      }
    });
  }

  exportReport(report: any, format: string): void {
    if (report.endpoint.includes('/export')) {
      window.open(`${environment.apiUrl}${report.endpoint}`, '_blank');
    } else {
      Swal.fire('Info', `Export as ${format} will be available soon`, 'info');
    }
  }

  editSchedule(schedule: any): void {
    console.log('Editing schedule:', schedule);
  }

  runNow(schedule: any): void {
    console.log('Running report now:', schedule);
  }
}
