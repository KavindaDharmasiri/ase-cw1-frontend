import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { Inventory } from '../../../models/inventory.model';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [InventoryService],
  template: `
    <div class="inventory-container">
      <div class="header">
        <h1>📦 Inventory Tracking</h1>
        <div class="rdc-selector" *ngIf="userRole === 'HEAD_OFFICE_MANAGER'">
          <select [(ngModel)]="selectedRdc" (change)="loadInventory()">
            <option value="">All RDCs</option>
            <option value="Colombo">Colombo RDC</option>
            <option value="Kandy">Kandy RDC</option>
            <option value="Galle">Galle RDC</option>
            <option value="Jaffna">Jaffna RDC</option>
          </select>
        </div>
      </div>

      <div class="alerts" *ngIf="lowStockItems.length > 0">
        <div class="alert alert-warning">
          <h3>⚠️ Low Stock Alert</h3>
          <p>{{lowStockItems.length}} items are below minimum stock level</p>
        </div>
      </div>

      <div class="inventory-grid">
        <div *ngFor="let item of inventoryItems" class="inventory-card" 
             [ngClass]="{'low-stock': item.currentStock <= item.product.minStockLevel}">
          <div class="product-info">
            <h3>{{item.product.name}}</h3>
            <p class="category">{{item.product.category}}</p>
            <p class="rdc">📍 {{item.rdcLocation}} RDC</p>
          </div>
          
          <div class="stock-info">
            <div class="stock-level">
              <span class="current">{{item.currentStock}}</span>
              <span class="unit">{{item.product.unit}}</span>
            </div>
            <div class="stock-details">
              <small>Reserved: {{item.reservedStock}}</small>
              <small>Available: {{item.currentStock - item.reservedStock}}</small>
              <small>Min Level: {{item.product.minStockLevel}}</small>
            </div>
          </div>
          
          <div class="actions">
            <button class="btn btn-sm" (click)="updateStock(item)">Update Stock</button>
            <button class="btn btn-sm" (click)="transferStock(item)" 
                    *ngIf="userRole === 'HEAD_OFFICE_MANAGER' || userRole === 'RDC_STAFF'">Transfer</button>
          </div>
        </div>
      </div>

      <!-- Update Stock Modal -->
      <div *ngIf="showUpdateModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Update Stock - {{selectedItem?.product?.name}}</h2>
          <form (ngSubmit)="saveStockUpdate()">
            <label>Current Stock: {{selectedItem?.currentStock}}</label>
            <input type="number" [(ngModel)]="newStockLevel" name="stock" required min="0">
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Update</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Transfer Stock Modal -->
      <div *ngIf="showTransferModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Transfer Stock - {{selectedItem?.product?.name}}</h2>
          <form (ngSubmit)="saveStockTransfer()">
            <label>From: {{selectedItem?.rdcLocation}} RDC</label>
            <select [(ngModel)]="transferToRdc" name="toRdc" required>
              <option value="">Select Destination RDC</option>
              <option value="Colombo">Colombo RDC</option>
              <option value="Kandy">Kandy RDC</option>
              <option value="Galle">Galle RDC</option>
              <option value="Jaffna">Jaffna RDC</option>
            </select>
            <input type="number" placeholder="Quantity to Transfer" 
                   [(ngModel)]="transferQuantity" name="quantity" required min="1" 
                   [max]="getAvailableStock()">
            <small>Available: {{getAvailableStock()}}</small>
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Transfer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inventory-container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .rdc-selector select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .alerts { margin-bottom: 20px; }
    .alert { padding: 12px; border-radius: 4px; }
    .alert-warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
    .inventory-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
    .inventory-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .inventory-card.low-stock { border-color: #e74c3c; background: #fdf2f2; }
    .product-info h3 { margin: 0 0 4px 0; }
    .category { color: #666; font-size: 12px; margin: 0; }
    .rdc { color: #007bff; font-size: 12px; margin: 8px 0; }
    .stock-info { margin: 12px 0; }
    .stock-level { display: flex; align-items: baseline; gap: 4px; }
    .current { font-size: 24px; font-weight: bold; color: #333; }
    .unit { color: #666; font-size: 14px; }
    .stock-details { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
    .stock-details small { color: #666; font-size: 11px; }
    .actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .btn-primary { background: #007bff; color: white; }
    .btn-sm { padding: 4px 8px; background: #f8f9fa; border: 1px solid #ddd; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 400px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal label, .modal input, .modal select { display: block; width: 100%; margin-bottom: 12px; }
    .modal input, .modal select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal small { color: #666; font-size: 12px; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
  `]
})
export class InventoryComponent implements OnInit {
  inventoryItems: Inventory[] = [];
  lowStockItems: Inventory[] = [];
  selectedRdc = '';
  userRole = '';
  showUpdateModal = false;
  showTransferModal = false;
  selectedItem: Inventory | null = null;
  newStockLevel = 0;
  transferToRdc = '';
  transferQuantity = 0;

  constructor(
    private inventoryService: InventoryService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    if (this.userRole === 'RDC_STAFF') {
      this.selectedRdc = 'Colombo'; // Default RDC for staff
    }
    // Load inventory and low stock items
    this.loadInventory();
    this.loadLowStockItems();
  }

  loadInventory() {
    if (this.selectedRdc) {
      this.inventoryService.getInventoryByRdc(this.selectedRdc).subscribe({
        next: (items) => {
          this.inventoryItems = items;
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error loading inventory:', error)
      });
    } else if (this.userRole === 'HEAD_OFFICE_MANAGER') {
      this.inventoryService.getAllInventory().subscribe({
        next: (items) => {
          this.inventoryItems = items;
          this.cdr.detectChanges();
        },
        error: (error) => console.error('Error loading inventory:', error)
      });
    }
  }

  loadLowStockItems() {
    if (this.selectedRdc) {
      this.inventoryService.getLowStockItemsByRdc(this.selectedRdc).subscribe({
        next: (items) => this.lowStockItems = items,
        error: (error) => console.error('Error loading low stock items:', error)
      });
    } else if (this.userRole === 'HEAD_OFFICE_MANAGER') {
      this.inventoryService.getLowStockItems().subscribe({
        next: (items) => this.lowStockItems = items,
        error: (error) => console.error('Error loading low stock items:', error)
      });
    }
  }

  updateStock(item: Inventory) {
    this.selectedItem = item;
    this.newStockLevel = item.currentStock;
    this.showUpdateModal = true;
  }

  transferStock(item: Inventory) {
    this.selectedItem = item;
    this.transferToRdc = '';
    this.transferQuantity = 0;
    this.showTransferModal = true;
  }

  closeModal() {
    this.showUpdateModal = false;
    this.showTransferModal = false;
    this.selectedItem = null;
  }

  saveStockUpdate() {
    if (this.selectedItem && this.selectedItem.product.id) {
      this.inventoryService.updateStock(
        this.selectedItem.product.id,
        this.selectedItem.rdcLocation,
        this.newStockLevel
      ).subscribe({
        next: () => {
          Swal.fire('Success', 'Stock updated successfully', 'success');
          this.loadInventory();
          this.closeModal();
        },
        error: (error) => Swal.fire('Error', 'Failed to update stock', 'error')
      });
    }
  }

  saveStockTransfer() {
    if (this.selectedItem && this.selectedItem.product.id) {
      this.inventoryService.transferStock(
        this.selectedItem.product.id,
        this.selectedItem.rdcLocation,
        this.transferToRdc,
        this.transferQuantity
      ).subscribe({
        next: () => {
          Swal.fire('Success', 'Stock transferred successfully', 'success');
          this.loadInventory();
          this.closeModal();
        },
        error: (error) => Swal.fire('Error', 'Failed to transfer stock', 'error')
      });
    }
  }

  getAvailableStock(): number {
    if (!this.selectedItem) return 0;
    return (this.selectedItem.currentStock || 0) - (this.selectedItem.reservedStock || 0);
  }
}