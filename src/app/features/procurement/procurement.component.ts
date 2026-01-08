import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProcurementService } from '../../core/services/procurement.service';
import { SupplierService } from '../../core/services/supplier.service';
import { PurchaseOrder, POStatus } from '../../models/purchase-order.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-procurement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="procurement">
      <div class="header">
        <h1>📋 Purchase Orders</h1>
        <button class="btn btn-primary" (click)="openAddModal()">Create Purchase Order</button>
      </div>

      <div class="filters">
        <select [(ngModel)]="selectedStatus" (change)="filterByStatus()">
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SENT">Sent</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PARTIALLY_RECEIVED">Partially Received</option>
          <option value="RECEIVED">Received</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div class="po-grid">
        <div *ngIf="purchaseOrders.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <h3>No Purchase Orders Found</h3>
          <p>Create purchase orders to manage procurement from suppliers.</p>
        </div>
        <div *ngFor="let po of purchaseOrders" class="po-card">
          <div class="po-header">
            <h3>{{po.poNumber}}</h3>
            <span class="status-badge" [class]="'status-' + po.status.toLowerCase()">{{po.status}}</span>
          </div>
          <div class="po-details">
            <p><strong>Supplier:</strong> {{po.supplier?.name || 'N/A'}}</p>
            <p><strong>Total:</strong> LKR {{po.totalAmount | number:'1.2-2'}}</p>
            <p><strong>Order Date:</strong> {{po.orderDate | date:'short'}}</p>
            <p><strong>Expected Delivery:</strong> {{po.expectedDeliveryDate | date:'short'}}</p>
          </div>
          <div class="po-actions">
            <button class="btn btn-sm btn-info" (click)="viewPO(po)">View</button>
            <button *ngIf="po.status === 'PENDING'" class="btn btn-sm btn-success" (click)="updateStatus(po.id!, 'SENT')">Send</button>
            <button *ngIf="po.status === 'SENT'" class="btn btn-sm btn-primary" (click)="updateStatus(po.id!, 'CONFIRMED')">Confirm</button>
          </div>
        </div>
      </div>

      <!-- Add PO Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Create Purchase Order</h2>
          <form (ngSubmit)="savePO()">
            <label>Supplier *</label>
            <select [(ngModel)]="currentPO.supplier" name="supplier" required>
              <option value="">Select Supplier</option>
              <option *ngFor="let supplier of suppliers" [ngValue]="supplier">{{supplier.name}}</option>
            </select>
            
            <label>Expected Delivery Date</label>
            <input type="datetime-local" [(ngModel)]="currentPO.expectedDeliveryDate" name="expectedDate">
            
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Create</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .procurement { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filters { margin-bottom: 20px; }
    .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .po-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .po-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .po-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .po-header h3 { margin: 0; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-pending { background: #ffc107; color: #212529; }
    .status-sent { background: #17a2b8; color: white; }
    .status-confirmed { background: #28a745; color: white; }
    .status-received { background: #6f42c1; color: white; }
    .status-cancelled { background: #dc3545; color: white; }
    .po-details p { margin: 4px 0; }
    .po-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 500px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal select { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 600; margin-bottom: 4px; margin-top: 8px; color: #495057; font-size: 14px; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class ProcurementComponent implements OnInit {
  purchaseOrders: PurchaseOrder[] = [];
  suppliers: any[] = [];
  showModal = false;
  selectedStatus = '';
  currentPO: any = { supplier: null, expectedDeliveryDate: null };

  constructor(private procurementService: ProcurementService, private supplierService: SupplierService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadPurchaseOrders();
    this.loadSuppliers();
  }

  loadPurchaseOrders() {
    this.procurementService.getAllPurchaseOrders().subscribe({
      next: (orders) => {
        this.purchaseOrders = orders;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading purchase orders:', error)
    });
  }

  loadSuppliers() {
    this.supplierService.getAllSuppliers().subscribe({
      next: (suppliers) => {
        this.suppliers = suppliers;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading suppliers:', error)
    });
  }

  filterByStatus() {
    if (this.selectedStatus) {
      this.procurementService.getPurchaseOrdersByStatus(this.selectedStatus as POStatus).subscribe({
        next: (orders) => this.purchaseOrders = orders,
        error: (error) => console.error('Error filtering orders:', error)
      });
    } else {
      this.loadPurchaseOrders();
    }
  }

  openAddModal() {
    this.currentPO = { supplier: null, expectedDeliveryDate: null };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePO() {
    const poData = {
      supplierId: this.currentPO.supplier?.id,
      expectedDeliveryDate: this.currentPO.expectedDeliveryDate
    };
    
    this.procurementService.createPurchaseOrder(poData).subscribe({
      next: () => {
        this.closeModal();
        this.loadPurchaseOrders();
        Swal.fire('Success', 'Purchase order created successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to create purchase order', 'error')
    });
  }

  updateStatus(id: number, status: string) {
    this.procurementService.updatePurchaseOrderStatus(id, status as POStatus).subscribe({
      next: () => {
        this.loadPurchaseOrders();
        Swal.fire('Success', 'Status updated successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to update status', 'error')
    });
  }

  viewPO(po: PurchaseOrder) {
    Swal.fire({
      title: po.poNumber,
      html: `
        <p><strong>Supplier:</strong> ${po.supplier?.name || 'N/A'}</p>
        <p><strong>Total:</strong> LKR ${po.totalAmount}</p>
        <p><strong>Status:</strong> ${po.status}</p>
        <p><strong>Order Date:</strong> ${new Date(po.orderDate).toLocaleDateString()}</p>
      `,
      icon: 'info'
    });
  }
}