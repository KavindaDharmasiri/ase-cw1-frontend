import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-advanced-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="advanced-analytics">
      <h1>📊 Advanced Analytics & Forecasting</h1>
      
      <div class="analytics-tabs">
        <button class="tab" [class.active]="activeTab === 'inventory'" (click)="activeTab = 'inventory'">Inventory Analysis</button>
        <button class="tab" [class.active]="activeTab === 'sales'" (click)="activeTab = 'sales'">Sales Analytics</button>
        <button class="tab" [class.active]="activeTab === 'logistics'" (click)="activeTab = 'logistics'">Logistics KPIs</button>
        <button class="tab" [class.active]="activeTab === 'forecasting'" (click)="activeTab = 'forecasting'">Demand Forecasting</button>
      </div>

      <!-- Inventory Analysis -->
      <div *ngIf="activeTab === 'inventory'" class="tab-content">
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Stock Aging Analysis</h3>
            <div class="aging-chart">
              <div *ngFor="let item of stockAging" class="aging-item">
                <span class="product-name">{{item.productName}}</span>
                <div class="aging-bar">
                  <div class="bar-segment fresh" [style.width.%]="item.fresh"></div>
                  <div class="bar-segment aging" [style.width.%]="item.aging"></div>
                  <div class="bar-segment old" [style.width.%]="item.old"></div>
                </div>
                <span class="days">{{item.avgAge}} days</span>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <h3>Stock Turnover</h3>
            <div class="turnover-list">
              <div *ngFor="let item of stockTurnover" class="turnover-item">
                <span class="product">{{item.productName}}</span>
                <span class="turnover" [class]="getTurnoverClass(item.ratio)">{{item.ratio}}x</span>
                <span class="status">{{item.status}}</span>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <h3>Warehouse Performance</h3>
            <div class="performance-metrics">
              <div class="performance-item">
                <span class="label">Pick Accuracy:</span>
                <span class="value">{{warehouseMetrics.pickAccuracy}}%</span>
              </div>
              <div class="performance-item">
                <span class="label">Order Fulfillment:</span>
                <span class="value">{{warehouseMetrics.fulfillmentRate}}%</span>
              </div>
              <div class="performance-item">
                <span class="label">Avg Pick Time:</span>
                <span class="value">{{warehouseMetrics.avgPickTime}} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Analytics -->
      <div *ngIf="activeTab === 'sales'" class="tab-content">
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Province Sales Performance</h3>
            <div class="province-sales">
              <div *ngFor="let province of provinceSales" class="province-item">
                <span class="province-name">{{province.name}}</span>
                <div class="sales-bar">
                  <div class="bar-fill" [style.width.%]="province.percentage"></div>
                </div>
                <span class="amount">LKR {{province.amount | number}}</span>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <h3>Customer Categories</h3>
            <div class="category-breakdown">
              <div *ngFor="let category of customerCategories" class="category-item">
                <span class="category">{{category.type}}</span>
                <span class="count">{{category.count}} customers</span>
                <span class="revenue">LKR {{category.revenue | number}}</span>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <h3>Monthly Trends</h3>
            <div class="trend-chart">
              <div *ngFor="let month of monthlyTrends" class="trend-item">
                <span class="month">{{month.name}}</span>
                <div class="trend-indicators">
                  <span class="sales" [class]="month.salesTrend">Sales: {{month.salesGrowth}}%</span>
                  <span class="orders" [class]="month.ordersTrend">Orders: {{month.ordersGrowth}}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Logistics KPIs -->
      <div *ngIf="activeTab === 'logistics'" class="tab-content">
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Delivery Performance</h3>
            <div class="delivery-kpis">
              <div class="kpi-item">
                <span class="kpi-label">On-Time Delivery:</span>
                <span class="kpi-value success">{{logisticsKPIs.onTimeDelivery}}%</span>
              </div>
              <div class="kpi-item">
                <span class="kpi-label">Avg Delivery Time:</span>
                <span class="kpi-value">{{logisticsKPIs.avgDeliveryTime}} hours</span>
              </div>
              <div class="kpi-item">
                <span class="kpi-label">Failed Deliveries:</span>
                <span class="kpi-value warning">{{logisticsKPIs.failedDeliveries}}%</span>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <h3>Vehicle Utilization</h3>
            <div class="vehicle-utilization">
              <div *ngFor="let vehicle of vehicleUtilization" class="vehicle-item">
                <span class="vehicle-id">{{vehicle.vehicleNumber}}</span>
                <div class="utilization-bar">
                  <div class="bar-fill" [style.width.%]="vehicle.utilization"></div>
                </div>
                <span class="percentage">{{vehicle.utilization}}%</span>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <h3>Route Efficiency</h3>
            <div class="route-metrics">
              <div class="metric-item">
                <span class="label">Avg Distance per Route:</span>
                <span class="value">{{routeMetrics.avgDistance}} km</span>
              </div>
              <div class="metric-item">
                <span class="label">Fuel Efficiency:</span>
                <span class="value">{{routeMetrics.fuelEfficiency}} km/L</span>
              </div>
              <div class="metric-item">
                <span class="label">Route Optimization:</span>
                <span class="value">{{routeMetrics.optimization}}% saved</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demand Forecasting -->
      <div *ngIf="activeTab === 'forecasting'" class="tab-content">
        <div class="forecasting-section">
          <div class="forecast-controls">
            <select [(ngModel)]="forecastPeriod" (change)="updateForecast()">
              <option value="1">Next Month</option>
              <option value="3">Next Quarter</option>
              <option value="6">Next 6 Months</option>
            </select>
            <button class="refresh-btn" (click)="generateForecast()">Generate Forecast</button>
          </div>

          <div class="forecast-results">
            <div class="forecast-card">
              <h3>Demand Forecast</h3>
              <div class="forecast-items">
                <div *ngFor="let item of demandForecast" class="forecast-item">
                  <span class="product">{{item.productName}}</span>
                  <span class="current">Current: {{item.currentDemand}}</span>
                  <span class="predicted">Predicted: {{item.predictedDemand}}</span>
                  <span class="trend" [class]="item.trendClass">{{item.trend}}</span>
                </div>
              </div>
            </div>

            <div class="forecast-card">
              <h3>Procurement Recommendations</h3>
              <div class="procurement-list">
                <div *ngFor="let item of procurementNeeds" class="procurement-item">
                  <span class="product">{{item.productName}}</span>
                  <span class="current-stock">Stock: {{item.currentStock}}</span>
                  <span class="recommended">Order: {{item.recommendedQuantity}}</span>
                  <span class="priority" [class]="item.priorityClass">{{item.priority}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .advanced-analytics { padding: 20px; max-width: 1400px; margin: 0 auto; }
    .analytics-tabs { display: flex; gap: 4px; margin-bottom: 20px; }
    .tab { padding: 12px 24px; border: none; background: #f5f5f5; cursor: pointer; border-radius: 8px 8px 0 0; }
    .tab.active { background: white; border-bottom: 2px solid #3498db; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
    .metric-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
    .metric-card h3 { margin: 0 0 15px 0; color: #2c3e50; }
    
    /* Inventory Styles */
    .aging-item, .turnover-item { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .aging-bar { flex: 1; height: 20px; background: #f0f0f0; border-radius: 10px; overflow: hidden; display: flex; }
    .bar-segment.fresh { background: #27ae60; }
    .bar-segment.aging { background: #f39c12; }
    .bar-segment.old { background: #e74c3c; }
    .turnover.high { color: #27ae60; font-weight: bold; }
    .turnover.low { color: #e74c3c; font-weight: bold; }
    
    /* Sales Styles */
    .province-item, .category-item { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
    .sales-bar { flex: 1; height: 15px; background: #f0f0f0; border-radius: 8px; overflow: hidden; }
    .bar-fill { height: 100%; background: #3498db; }
    
    /* Logistics Styles */
    .kpi-item, .metric-item { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .kpi-value.success { color: #27ae60; font-weight: bold; }
    .kpi-value.warning { color: #e67e22; font-weight: bold; }
    
    /* Forecasting Styles */
    .forecast-controls { display: flex; gap: 10px; margin-bottom: 20px; }
    .forecast-controls select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .refresh-btn { padding: 8px 16px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .forecast-results { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .forecast-card { background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
    .forecast-item, .procurement-item { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 8px; }
    .trend.up { color: #27ae60; }
    .trend.down { color: #e74c3c; }
    .priority.high { color: #e74c3c; font-weight: bold; }
    .priority.medium { color: #f39c12; }
    .priority.low { color: #27ae60; }
  `]
})
export class AdvancedAnalyticsComponent implements OnInit {
  activeTab = 'inventory';
  forecastPeriod = '1';
  
  stockAging: any[] = [];
  stockTurnover: any[] = [];
  warehouseMetrics: any = {};
  provinceSales: any[] = [];
  customerCategories: any[] = [];
  monthlyTrends: any[] = [];
  logisticsKPIs: any = {};
  vehicleUtilization: any[] = [];
  routeMetrics: any = {};
  demandForecast: any[] = [];
  procurementNeeds: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAnalyticsData();
  }

  loadAnalyticsData() {
    // Load mock data - in real implementation, these would be API calls
    this.loadInventoryAnalytics();
    this.loadSalesAnalytics();
    this.loadLogisticsAnalytics();
    this.loadForecastingData();
  }

  loadInventoryAnalytics() {
    this.stockAging = [
      { productName: 'Rice 5kg', fresh: 60, aging: 30, old: 10, avgAge: 15 },
      { productName: 'Sugar 1kg', fresh: 80, aging: 15, old: 5, avgAge: 8 },
      { productName: 'Oil 1L', fresh: 45, aging: 40, old: 15, avgAge: 25 }
    ];
    
    this.stockTurnover = [
      { productName: 'Rice 5kg', ratio: 8.5, status: 'Fast Moving' },
      { productName: 'Sugar 1kg', ratio: 12.2, status: 'Fast Moving' },
      { productName: 'Oil 1L', ratio: 2.1, status: 'Slow Moving' }
    ];
    
    this.warehouseMetrics = {
      pickAccuracy: 98.5,
      fulfillmentRate: 94.2,
      avgPickTime: 12
    };
  }

  loadSalesAnalytics() {
    this.provinceSales = [
      { name: 'Western', amount: 2500000, percentage: 45 },
      { name: 'Central', amount: 1800000, percentage: 32 },
      { name: 'Southern', amount: 1300000, percentage: 23 }
    ];
    
    this.customerCategories = [
      { type: 'Supermarkets', count: 45, revenue: 1800000 },
      { type: 'Grocery Stores', count: 120, revenue: 2200000 },
      { type: 'Restaurants', count: 35, revenue: 600000 }
    ];
    
    this.monthlyTrends = [
      { name: 'Jan', salesGrowth: 12, ordersGrowth: 8, salesTrend: 'up', ordersTrend: 'up' },
      { name: 'Feb', salesGrowth: -3, ordersGrowth: 5, salesTrend: 'down', ordersTrend: 'up' },
      { name: 'Mar', salesGrowth: 18, ordersGrowth: 15, salesTrend: 'up', ordersTrend: 'up' }
    ];
  }

  loadLogisticsAnalytics() {
    this.logisticsKPIs = {
      onTimeDelivery: 92.5,
      avgDeliveryTime: 4.2,
      failedDeliveries: 2.8
    };
    
    this.vehicleUtilization = [
      { vehicleNumber: 'CAB-1234', utilization: 85 },
      { vehicleNumber: 'CAB-5678', utilization: 72 },
      { vehicleNumber: 'CAB-9012', utilization: 91 }
    ];
    
    this.routeMetrics = {
      avgDistance: 45,
      fuelEfficiency: 12.5,
      optimization: 15
    };
  }

  loadForecastingData() {
    this.demandForecast = [
      { productName: 'Rice 5kg', currentDemand: 500, predictedDemand: 650, trend: '+30%', trendClass: 'up' },
      { productName: 'Sugar 1kg', currentDemand: 300, predictedDemand: 280, trend: '-7%', trendClass: 'down' },
      { productName: 'Oil 1L', currentDemand: 200, predictedDemand: 240, trend: '+20%', trendClass: 'up' }
    ];
    
    this.procurementNeeds = [
      { productName: 'Rice 5kg', currentStock: 100, recommendedQuantity: 800, priority: 'High', priorityClass: 'high' },
      { productName: 'Sugar 1kg', currentStock: 250, recommendedQuantity: 300, priority: 'Medium', priorityClass: 'medium' },
      { productName: 'Oil 1L', currentStock: 180, recommendedQuantity: 200, priority: 'Low', priorityClass: 'low' }
    ];
  }

  getTurnoverClass(ratio: number): string {
    return ratio > 6 ? 'high' : 'low';
  }

  updateForecast() {
    this.generateForecast();
  }

  generateForecast() {
    // Simulate forecast generation
    console.log(`Generating forecast for ${this.forecastPeriod} month(s)`);
    this.loadForecastingData();
  }
}