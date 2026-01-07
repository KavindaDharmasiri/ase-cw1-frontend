import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logistics-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="logistics-reports fade-in">
      <div class="reports-header">
        <h1>Logistics Performance Reports</h1>
        <div class="date-filter">
          <input type="date" [(ngModel)]="startDate" class="date-input">
          <span>to</span>
          <input type="date" [(ngModel)]="endDate" class="date-input">
          <button class="filter-btn" (click)="applyDateFilter()">Apply Filter</button>
        </div>
      </div>

      <div class="reports-tabs">
        <button class="tab" [class.active]="activeTab === 'deliveries'" (click)="activeTab = 'deliveries'">Delivery Reports</button>
        <button class="tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Driver Performance</button>
        <button class="tab" [class.active]="activeTab === 'efficiency'" (click)="activeTab = 'efficiency'">Route Efficiency</button>
        <button class="tab" [class.active]="activeTab === 'vehicles'" (click)="activeTab = 'vehicles'">Vehicle Reports</button>
      </div>

      <!-- Delivery Reports Tab -->
      <div class="tab-content" *ngIf="activeTab === 'deliveries'">
        <div class="report-summary">
          <div class="summary-card">
            <h3>Total Deliveries</h3>
            <div class="summary-value">{{deliveryStats.totalDeliveries}}</div>
            <div class="summary-change positive">+12% from last period</div>
          </div>
          <div class="summary-card">
            <h3>Successful Deliveries</h3>
            <div class="summary-value">{{deliveryStats.successfulDeliveries}}</div>
            <div class="summary-percentage">{{deliveryStats.successRate}}% success rate</div>
          </div>
          <div class="summary-card">
            <h3>Failed Deliveries</h3>
            <div class="summary-value">{{deliveryStats.failedDeliveries}}</div>
            <div class="summary-change negative">{{deliveryStats.failureRate}}% failure rate</div>
          </div>
          <div class="summary-card">
            <h3>Average Delivery Time</h3>
            <div class="summary-value">{{deliveryStats.averageDeliveryTime}}</div>
            <div class="summary-change positive">-5 min from last period</div>
          </div>
        </div>

        <div class="delivery-breakdown">
          <h3>Delivery Status Breakdown</h3>
          <div class="breakdown-chart">
            <div class="chart-placeholder">
              📊 Delivery Status Chart
              <div class="chart-data">
                <div class="chart-item">
                  <span class="chart-color delivered"></span>
                  <span>Delivered: {{deliveryStats.successfulDeliveries}}</span>
                </div>
                <div class="chart-item">
                  <span class="chart-color failed"></span>
                  <span>Failed: {{deliveryStats.failedDeliveries}}</span>
                </div>
                <div class="chart-item">
                  <span class="chart-color pending"></span>
                  <span>Pending: {{deliveryStats.pendingDeliveries}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="failed-deliveries">
          <h3>Failed Delivery Analysis</h3>
          <div class="failure-reasons">
            <div class="reason-item" *ngFor="let reason of failureReasons">
              <span class="reason-label">{{reason.reason}}</span>
              <div class="reason-bar">
                <div class="reason-fill" [style.width.%]="reason.percentage"></div>
              </div>
              <span class="reason-count">{{reason.count}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Driver Performance Tab -->
      <div class="tab-content" *ngIf="activeTab === 'performance'">
        <div class="performance-table">
          <h3>Driver Performance Summary</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>Driver Name</th>
                <th>Deliveries</th>
                <th>Success Rate</th>
                <th>Avg. Time</th>
                <th>Distance</th>
                <th>Rating</th>
                <th>Performance</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let driver of driverPerformance">
                <td>{{driver.name}}</td>
                <td>{{driver.totalDeliveries}}</td>
                <td>{{driver.successRate}}%</td>
                <td>{{driver.averageTime}}</td>
                <td>{{driver.totalDistance}} km</td>
                <td>{{driver.rating}}/5</td>
                <td>
                  <span class="performance-badge" [class]="getPerformanceClass(driver.performance)">
                    {{driver.performance}}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="top-performers">
          <h3>Top Performers This Month</h3>
          <div class="performers-grid">
            <div class="performer-card" *ngFor="let performer of topPerformers; let i = index">
              <div class="rank">{{i + 1}}</div>
              <div class="performer-info">
                <h4>{{performer.name}}</h4>
                <p>{{performer.deliveries}} deliveries</p>
                <p>{{performer.successRate}}% success rate</p>
              </div>
              <div class="performer-badge">⭐</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Route Efficiency Tab -->
      <div class="tab-content" *ngIf="activeTab === 'efficiency'">
        <div class="efficiency-metrics">
          <div class="metric-card">
            <h3>Route Optimization</h3>
            <div class="metric-value">{{routeEfficiency.optimizationRate}}%</div>
            <p>Routes optimized this month</p>
          </div>
          <div class="metric-card">
            <h3>Distance Saved</h3>
            <div class="metric-value">{{routeEfficiency.distanceSaved}} km</div>
            <p>Through optimization</p>
          </div>
          <div class="metric-card">
            <h3>Time Saved</h3>
            <div class="metric-value">{{routeEfficiency.timeSaved}} hrs</div>
            <p>Through optimization</p>
          </div>
          <div class="metric-card">
            <h3>Fuel Saved</h3>
            <div class="metric-value">{{routeEfficiency.fuelSaved}} L</div>
            <p>Cost savings: Rs. {{routeEfficiency.costSavings | number}}</p>
          </div>
        </div>

        <div class="route-analysis">
          <h3>Route Performance Analysis</h3>
          <div class="routes-table">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Route Name</th>
                  <th>Avg. Distance</th>
                  <th>Avg. Time</th>
                  <th>Deliveries/Day</th>
                  <th>Efficiency Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let route of routeAnalysis">
                  <td>{{route.name}}</td>
                  <td>{{route.avgDistance}} km</td>
                  <td>{{route.avgTime}}</td>
                  <td>{{route.avgDeliveries}}</td>
                  <td>{{route.efficiencyScore}}/100</td>
                  <td>
                    <span class="status-badge" [class]="route.status.toLowerCase()">
                      {{route.status}}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Vehicle Reports Tab -->
      <div class="tab-content" *ngIf="activeTab === 'vehicles'">
        <div class="vehicle-stats">
          <div class="stat-card">
            <h3>Fleet Utilization</h3>
            <div class="stat-value">{{vehicleStats.utilization}}%</div>
          </div>
          <div class="stat-card">
            <h3>Maintenance Due</h3>
            <div class="stat-value">{{vehicleStats.maintenanceDue}}</div>
          </div>
          <div class="stat-card">
            <h3>Fuel Efficiency</h3>
            <div class="stat-value">{{vehicleStats.fuelEfficiency}} km/L</div>
          </div>
          <div class="stat-card">
            <h3>Downtime</h3>
            <div class="stat-value">{{vehicleStats.downtime}}%</div>
          </div>
        </div>

        <div class="vehicle-details">
          <h3>Vehicle Performance Details</h3>
          <div class="vehicles-grid">
            <div class="vehicle-card" *ngFor="let vehicle of vehicleDetails">
              <div class="vehicle-header">
                <h4>{{vehicle.number}}</h4>
                <span class="vehicle-status" [class]="vehicle.status.toLowerCase()">{{vehicle.status}}</span>
              </div>
              <div class="vehicle-metrics">
                <div class="metric">
                  <span class="metric-label">Distance:</span>
                  <span class="metric-value">{{vehicle.totalDistance}} km</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Fuel Used:</span>
                  <span class="metric-value">{{vehicle.fuelUsed}} L</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Efficiency:</span>
                  <span class="metric-value">{{vehicle.efficiency}} km/L</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Deliveries:</span>
                  <span class="metric-value">{{vehicle.deliveries}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="export-actions">
        <button class="export-btn" (click)="exportToPDF()">📄 Export PDF</button>
        <button class="export-btn" (click)="exportToExcel()">📊 Export Excel</button>
        <button class="export-btn" (click)="scheduleReport()">⏰ Schedule Report</button>
      </div>
    </div>
  `,
  styles: [`
    .logistics-reports { padding: 40px; max-width: 1400px; margin: 0 auto; }
    .reports-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .date-filter { display: flex; gap: 12px; align-items: center; }
    .date-input { padding: 8px; border: 1px solid var(--gray-300); border-radius: var(--border-radius-md); }
    .filter-btn { padding: 8px 16px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
    .reports-tabs { display: flex; gap: 4px; margin-bottom: 32px; }
    .tab { padding: 12px 24px; border: none; background: var(--gray-100); cursor: pointer; border-radius: var(--border-radius-md) var(--border-radius-md) 0 0; }
    .tab.active { background: white; border-bottom: 2px solid var(--primary-blue); }
    .report-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .summary-card { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); text-align: center; }
    .summary-card h3 { margin: 0 0 12px 0; color: var(--gray-600); }
    .summary-value { font-size: 32px; font-weight: 700; color: var(--primary-blue); margin-bottom: 8px; }
    .summary-change { font-size: 14px; }
    .summary-change.positive { color: var(--green-600); }
    .summary-change.negative { color: var(--red-600); }
    .summary-percentage { font-size: 14px; color: var(--gray-600); }
    .delivery-breakdown, .failed-deliveries { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 24px; }
    .chart-placeholder { background: var(--gray-50); border-radius: var(--border-radius-md); padding: 40px; text-align: center; }
    .chart-data { display: flex; justify-content: center; gap: 24px; margin-top: 20px; }
    .chart-item { display: flex; align-items: center; gap: 8px; }
    .chart-color { width: 16px; height: 16px; border-radius: 4px; }
    .chart-color.delivered { background: var(--green-500); }
    .chart-color.failed { background: var(--red-500); }
    .chart-color.pending { background: var(--yellow-500); }
    .failure-reasons { margin-top: 16px; }
    .reason-item { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
    .reason-label { min-width: 150px; font-size: 14px; }
    .reason-bar { flex: 1; height: 20px; background: var(--gray-200); border-radius: 10px; overflow: hidden; }
    .reason-fill { height: 100%; background: var(--red-500); }
    .reason-count { min-width: 40px; text-align: right; font-weight: 600; }
    .performance-table, .route-analysis { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 24px; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--gray-200); }
    .data-table th { background: var(--gray-50); font-weight: 600; }
    .performance-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .performance-badge.excellent { background: var(--green-100); color: var(--green-600); }
    .performance-badge.good { background: var(--blue-100); color: var(--blue-600); }
    .performance-badge.average { background: var(--yellow-100); color: var(--yellow-600); }
    .performance-badge.poor { background: var(--red-100); color: var(--red-600); }
    .top-performers { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .performers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-top: 16px; }
    .performer-card { display: flex; align-items: center; gap: 16px; padding: 16px; background: var(--gray-50); border-radius: var(--border-radius-md); }
    .rank { width: 40px; height: 40px; background: var(--primary-blue); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .performer-info h4 { margin: 0 0 4px 0; }
    .performer-info p { margin: 2px 0; font-size: 14px; color: var(--gray-600); }
    .performer-badge { font-size: 24px; }
    .efficiency-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .metric-card { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); text-align: center; }
    .metric-card h3 { margin: 0 0 12px 0; color: var(--gray-600); }
    .metric-value { font-size: 28px; font-weight: 700; color: var(--primary-blue); margin-bottom: 8px; }
    .vehicle-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card { background: white; padding: 20px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); text-align: center; }
    .stat-value { font-size: 24px; font-weight: 700; color: var(--primary-blue); }
    .vehicle-details { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 24px; }
    .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-top: 16px; }
    .vehicle-card { padding: 20px; background: var(--gray-50); border-radius: var(--border-radius-md); }
    .vehicle-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .vehicle-status { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .vehicle-status.active { background: var(--green-100); color: var(--green-600); }
    .vehicle-status.maintenance { background: var(--yellow-100); color: var(--yellow-600); }
    .vehicle-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .metric { display: flex; justify-content: space-between; }
    .metric-label { font-size: 14px; color: var(--gray-600); }
    .metric-value { font-size: 14px; font-weight: 600; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-badge.optimal { background: var(--green-100); color: var(--green-600); }
    .status-badge.good { background: var(--blue-100); color: var(--blue-600); }
    .status-badge.needs-improvement { background: var(--yellow-100); color: var(--yellow-600); }
    .export-actions { display: flex; gap: 12px; justify-content: center; margin-top: 32px; }
    .export-btn { padding: 12px 24px; background: var(--gray-500); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
  `]
})
export class LogisticsReportsComponent implements OnInit {
  activeTab = 'deliveries';
  startDate = '';
  endDate = '';
  
  deliveryStats = {
    totalDeliveries: 245,
    successfulDeliveries: 231,
    failedDeliveries: 14,
    pendingDeliveries: 8,
    successRate: 94,
    failureRate: 6,
    averageDeliveryTime: '45 min'
  };

  failureReasons = [
    { reason: 'Customer Not Available', count: 8, percentage: 57 },
    { reason: 'Address Not Found', count: 3, percentage: 21 },
    { reason: 'Delivery Refused', count: 2, percentage: 14 },
    { reason: 'Damaged Goods', count: 1, percentage: 8 }
  ];

  driverPerformance = [
    {
      name: 'Kamal Perera',
      totalDeliveries: 89,
      successRate: 96,
      averageTime: '42 min',
      totalDistance: 1250,
      rating: 4.8,
      performance: 'EXCELLENT'
    },
    {
      name: 'Sunil Silva',
      totalDeliveries: 76,
      successRate: 92,
      averageTime: '48 min',
      totalDistance: 980,
      rating: 4.5,
      performance: 'GOOD'
    },
    {
      name: 'Nimal Fernando',
      totalDeliveries: 65,
      successRate: 88,
      averageTime: '52 min',
      totalDistance: 850,
      rating: 4.2,
      performance: 'AVERAGE'
    }
  ];

  topPerformers = [
    { name: 'Kamal Perera', deliveries: 89, successRate: 96 },
    { name: 'Sunil Silva', deliveries: 76, successRate: 92 },
    { name: 'Nimal Fernando', deliveries: 65, successRate: 88 }
  ];

  routeEfficiency = {
    optimizationRate: 85,
    distanceSaved: 450,
    timeSaved: 32,
    fuelSaved: 180,
    costSavings: 27000
  };

  routeAnalysis = [
    {
      name: 'Route A - Central',
      avgDistance: 45,
      avgTime: '6.5 hrs',
      avgDeliveries: 12,
      efficiencyScore: 92,
      status: 'OPTIMAL'
    },
    {
      name: 'Route B - North',
      avgDistance: 38,
      avgTime: '5.8 hrs',
      avgDeliveries: 10,
      efficiencyScore: 88,
      status: 'GOOD'
    },
    {
      name: 'Route C - South',
      avgDistance: 52,
      avgTime: '7.2 hrs',
      avgDeliveries: 8,
      efficiencyScore: 75,
      status: 'NEEDS-IMPROVEMENT'
    }
  ];

  vehicleStats = {
    utilization: 87,
    maintenanceDue: 3,
    fuelEfficiency: 12.5,
    downtime: 8
  };

  vehicleDetails = [
    {
      number: 'CAB-1234',
      status: 'ACTIVE',
      totalDistance: 2450,
      fuelUsed: 195,
      efficiency: 12.6,
      deliveries: 89
    },
    {
      number: 'CAB-5678',
      status: 'ACTIVE',
      totalDistance: 1980,
      fuelUsed: 165,
      efficiency: 12.0,
      deliveries: 76
    },
    {
      number: 'CAB-9012',
      status: 'MAINTENANCE',
      totalDistance: 1650,
      fuelUsed: 140,
      efficiency: 11.8,
      deliveries: 65
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setDefaultDates();
  }

  setDefaultDates() {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = lastMonth.toISOString().split('T')[0];
  }

  applyDateFilter() {
    console.log('Applying date filter:', this.startDate, 'to', this.endDate);
    // Implement date filtering logic
  }

  getPerformanceClass(performance: string): string {
    return performance.toLowerCase();
  }

  exportToPDF() {
    const content = `
      LOGISTICS PERFORMANCE REPORT
      ============================
      
      Period: ${this.startDate} to ${this.endDate}
      
      DELIVERY SUMMARY:
      - Total Deliveries: ${this.deliveryStats.totalDeliveries}
      - Successful: ${this.deliveryStats.successfulDeliveries}
      - Failed: ${this.deliveryStats.failedDeliveries}
      - Success Rate: ${this.deliveryStats.successRate}%
      
      TOP PERFORMERS:
      ${this.topPerformers.map((p, i) => `${i + 1}. ${p.name} - ${p.deliveries} deliveries (${p.successRate}%)`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `logistics-report-${this.startDate}-to-${this.endDate}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  exportToExcel() {
    console.log('Exporting to Excel...');
    // Implement Excel export
  }

  scheduleReport() {
    console.log('Scheduling report...');
    // Implement report scheduling
  }
}