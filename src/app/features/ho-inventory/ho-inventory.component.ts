import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ho-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ho-inventory">
      <div class="header">
        <h1>Multi-RDC Inventory Overview</h1>
        <div class="filters">
          <select [(ngModel)]="selectedRdc" class="filter-select">
            <option value="">All RDCs</option>
            <option *ngFor="let rdc of rdcs" [value]="rdc">{{rdc}}</option>
          </select>
          <select [(ngModel)]="selectedCategory" class="filter-select">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories" [value]="cat">{{cat}}</option>
          </select>
        </div>
      </div>

      <div class="inventory-summary">
        <div class="summary-card">
          <h3>Total Inventory Value</h3>
          <div class="value">Rs. {{totalInventoryValue | number}}</div>
        </div>
        <div class="summary-card">
          <h3>Low Stock Items</h3>
          <div class="value alert">{{lowStockCount}}</div>
        </div>
        <div class="summary-card">
          <h3>Overstock Items</h3>
          <div class="value warning">{{overstockCount}}</div>
        </div>
        <div class="summary-card">
          <h3>Transfer Requests</h3>
          <div class="value">{{transferRequests}}</div>
        </div>
      </div>

      <div class="inventory-grid">
        <div class="inventory-table">
          <h2>Stock Levels by RDC</h2>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Colombo RDC</th>
                <th>Kandy RDC</th>
                <th>Galle RDC</th>
                <th>Total Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of inventoryData">
                <td>{{item.product}}</td>
                <td>{{item.category}}</td>
                <td [class]="getStockClass(item.colombo)">{{item.colombo}}</td>
                <td [class]="getStockClass(item.kandy)">{{item.kandy}}</td>
                <td [class]="getStockClass(item.galle)">{{item.galle}}</td>
                <td>{{item.total}}</td>
                <td>
                  <span class="status-badge" [class]="item.status">{{item.status}}</span>
                </td>
                <td>
                  <button class="action-btn" (click)="approveTransfer(item)">Transfer</button>
                  <button class="action-btn" (click)="setThreshold(item)">Threshold</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="transfer-panel">
          <h2>Pending Transfer Approvals</h2>
          <div class="transfer-list">
            <div class="transfer-item" *ngFor="let transfer of pendingTransfers">
              <div class="transfer-header">
                <h4>{{transfer.product}}</h4>
                <span class="transfer-qty">{{transfer.quantity}} units</span>
              </div>
              <div class="transfer-details">
                <div class="route">{{transfer.from}} → {{transfer.to}}</div>
                <div class="reason">{{transfer.reason}}</div>
                <div class="requested-by">Requested by: {{transfer.requestedBy}}</div>
              </div>
              <div class="transfer-actions">
                <button class="approve-btn" (click)="approveTransferRequest(transfer)">Approve</button>
                <button class="reject-btn" (click)="rejectTransferRequest(transfer)">Reject</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="threshold-settings">
        <h2>Stock Threshold Management</h2>
        <div class="threshold-grid">
          <div class="threshold-card" *ngFor="let threshold of thresholds">
            <h4>{{threshold.category}}</h4>
            <div class="threshold-controls">
              <label>Minimum Stock:</label>
              <input type="number" [(ngModel)]="threshold.minimum" class="threshold-input">
              <label>Reorder Level:</label>
              <input type="number" [(ngModel)]="threshold.reorder" class="threshold-input">
              <button class="update-btn" (click)="updateThreshold(threshold)">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ho-inventory {
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

    .filters {
      display: flex;
      gap: 1rem;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
    }

    .inventory-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .summary-card .value {
      font-size: 2rem;
      font-weight: bold;
      margin-top: 0.5rem;
    }

    .value.alert { color: #ef4444; }
    .value.warning { color: #f59e0b; }

    .inventory-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .inventory-table {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }

    th {
      background: #f9fafb;
      font-weight: 600;
    }

    .stock-low { color: #ef4444; font-weight: bold; }
    .stock-medium { color: #f59e0b; }
    .stock-high { color: #10b981; }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-badge.normal { background: #dcfce7; color: #166534; }
    .status-badge.low { background: #fee2e2; color: #991b1b; }
    .status-badge.overstock { background: #fef3c7; color: #92400e; }

    .action-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 0.5rem;
      font-size: 0.8rem;
    }

    .transfer-panel {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .transfer-item {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }

    .transfer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .transfer-qty {
      background: #dbeafe;
      color: #1e40af;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
    }

    .transfer-details {
      margin-bottom: 1rem;
      font-size: 0.9rem;
      color: #6b7280;
    }

    .transfer-actions {
      display: flex;
      gap: 0.5rem;
    }

    .approve-btn {
      background: #10b981;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .reject-btn {
      background: #ef4444;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
    }

    .threshold-settings {
      background: white;
      border-radius: 10px;
      padding: 1.5rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .threshold-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    }

    .threshold-card {
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 1rem;
    }

    .threshold-controls {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 0.5rem;
      align-items: center;
      margin-top: 0.5rem;
    }

    .threshold-input {
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 4px;
    }

    .update-btn {
      grid-column: span 2;
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.5rem;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 0.5rem;
    }
  `]
})
export class HoInventoryComponent implements OnInit {
  selectedRdc = '';
  selectedCategory = '';
  
  rdcs = ['Colombo RDC', 'Kandy RDC', 'Galle RDC'];
  categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports'];
  
  totalInventoryValue = 8950000;
  lowStockCount = 23;
  overstockCount = 8;
  transferRequests = 5;

  inventoryData = [
    { product: 'Samsung TV 55"', category: 'Electronics', colombo: 45, kandy: 12, galle: 8, total: 65, status: 'low' },
    { product: 'Nike Running Shoes', category: 'Sports', colombo: 120, kandy: 85, galle: 95, total: 300, status: 'normal' },
    { product: 'Garden Tools Set', category: 'Home & Garden', colombo: 200, kandy: 180, galle: 220, total: 600, status: 'overstock' }
  ];

  pendingTransfers = [
    { product: 'Samsung TV 55"', quantity: 10, from: 'Colombo RDC', to: 'Galle RDC', reason: 'Low stock alert', requestedBy: 'Galle RDC Manager' },
    { product: 'Nike Running Shoes', quantity: 25, from: 'Galle RDC', to: 'Kandy RDC', reason: 'High demand', requestedBy: 'Kandy RDC Manager' }
  ];

  thresholds = [
    { category: 'Electronics', minimum: 20, reorder: 50 },
    { category: 'Sports', minimum: 30, reorder: 75 },
    { category: 'Home & Garden', minimum: 40, reorder: 100 }
  ];

  ngOnInit(): void {}

  getStockClass(stock: number): string {
    if (stock < 20) return 'stock-low';
    if (stock < 50) return 'stock-medium';
    return 'stock-high';
  }

  approveTransfer(item: any): void {
    console.log('Approving transfer for:', item.product);
  }

  setThreshold(item: any): void {
    console.log('Setting threshold for:', item.product);
  }

  approveTransferRequest(transfer: any): void {
    console.log('Approving transfer request:', transfer);
  }

  rejectTransferRequest(transfer: any): void {
    console.log('Rejecting transfer request:', transfer);
  }

  updateThreshold(threshold: any): void {
    console.log('Updating threshold:', threshold);
  }
}