import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProcurementService } from '../../core/services/procurement.service';
import { SupplierService } from '../../core/services/supplier.service';
import { PurchaseOrder, POStatus } from '../../models/purchase-order.model';
import { environment } from '../../../environments/environment';
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
          <option value="ISSUED">Issued</option>
          <option value="RECEIVED">Received</option>
          <option value="CLOSED">Closed</option>
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
            <p><strong>Supplier:</strong> {{po.supplierName}}</p>
            <p><strong>Total:</strong> LKR {{po.totalAmount | number:'1.2-2'}}</p>
            <p><strong>Order Date:</strong> {{po.orderDate | date:'short'}}</p>
            <p><strong>Expected Delivery:</strong> {{po.expectedDeliveryDate | date:'short'}}</p>
          </div>
          <div class="po-actions">
            <button class="btn btn-sm btn-info" (click)="viewPO(po)">View</button>
            <!-- RDC Staff can mark ISSUED orders as RECEIVED -->
            <button *ngIf="po.status === 'ISSUED' && userRole === 'RDC_STAFF'" 
                    class="btn btn-sm btn-success" (click)="markAsReceived(po.id!)">Mark as Received</button>
            <!-- Head Office Manager can close RECEIVED orders -->
            <button *ngIf="po.status === 'RECEIVED' && userRole === 'HEAD_OFFICE_MANAGER'" 
                    class="btn btn-sm btn-secondary" (click)="updateStatus(po.id!, 'CLOSED')">Close PO</button>
            <!-- Head Office Manager can cancel ISSUED orders -->
            <button *ngIf="po.status === 'ISSUED' && userRole === 'HEAD_OFFICE_MANAGER'" 
                    class="btn btn-sm btn-danger" (click)="updateStatus(po.id!, 'CANCELLED')">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Add PO Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Create Purchase Order</h2>
          <form (ngSubmit)="savePO()">
            <label>Supplier *</label>
            <select [(ngModel)]="currentPO.supplierId" name="supplierId" required>
              <option value="">Select Supplier</option>
              <option *ngFor="let supplier of suppliers" [value]="supplier.id">{{supplier.name}}</option>
            </select>
            
            <label>Expected Delivery Date</label>
            <input type="date" [(ngModel)]="currentPO.expectedDeliveryDate" name="expectedDate">
            
            <h3>Items</h3>
            <div *ngFor="let item of currentPO.items; let i = index" class="item-row">
              <select [(ngModel)]="item.productId" [name]="'product_' + i" required>
                <option value="">Select Product</option>
                <option *ngFor="let product of products" [value]="product.id">{{product.name}}</option>
              </select>
              <input type="number" [(ngModel)]="item.quantity" [name]="'qty_' + i" placeholder="Qty" required>
              <input type="number" [(ngModel)]="item.purchasePrice" [name]="'price_' + i" placeholder="Price" step="0.01" required>
              <button type="button" (click)="removeItem(i)" class="btn btn-danger btn-sm">×</button>
            </div>
            <button type="button" (click)="addItem()" class="btn btn-secondary btn-sm">Add Item</button>
            
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
    .status-issued { background: #ffc107; color: #212529; }
    .status-received { background: #28a745; color: white; }
    .status-closed { background: #6f42c1; color: white; }
    .status-cancelled { background: #dc3545; color: white; }
    .po-details p { margin: 4px 0; }
    .po-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-success { background: #28a745; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 600px; max-width: 90vw; }
    .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; margin-bottom: 8px; align-items: center; }
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
  currentPO: any = { supplierId: null, expectedDeliveryDate: null, items: [{ productId: null, quantity: null, purchasePrice: null }] };
  products: any[] = [];
  userRole = '';

  constructor(private procurementService: ProcurementService, private supplierService: SupplierService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.getUserRole();
    this.loadPurchaseOrders();
    this.loadSuppliers();
    this.loadProducts();
  }

  getUserRole() {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      this.userRole = user.role || '';
    }
  }

  loadProducts() {
    this.http.get<any[]>(`${environment.apiUrl}${environment.endpoints.products.base}`)
      .subscribe({
        next: (products) => {
          this.products = products;
          console.log('Loaded products:', products);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading products from API:', error);
          // Fallback to mock data if API fails
          this.products = [
            { id: 1, name: 'Rice 1kg' },
            { id: 2, name: 'Sugar 1kg' },
            { id: 3, name: 'Flour 1kg' },
            { id: 4, name: 'Oil 1L' },
            { id: 5, name: 'Tea 100g' },
            { id: 6, name: 'Salt 1kg' }
          ];
        }
      });
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
    this.http.get<any[]>(`${environment.apiUrl}${environment.endpoints.suppliers.base}`)
      .subscribe({
        next: (suppliers) => {
          this.suppliers = suppliers;
          console.log('Loaded suppliers:', suppliers);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading suppliers from API:', error);
          // Fallback to mock data if API fails
          this.suppliers = [
            { id: 1, name: 'ABC Suppliers Ltd' },
            { id: 2, name: 'XYZ Trading Co' },
            { id: 3, name: 'Best Foods Supplier' }
          ];
        }
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
    this.currentPO = { supplierId: null, expectedDeliveryDate: null, items: [{ productId: null, quantity: null, purchasePrice: null }] };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePO() {
    this.procurementService.createPurchaseOrder(this.currentPO).subscribe({
      next: (response) => {
        this.closeModal();
        this.loadPurchaseOrders();
        Swal.fire({
          title: 'Success!',
          text: 'Purchase order created successfully',
          icon: 'success',
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        console.error('Error creating purchase order:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create purchase order. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  addItem() {
    this.currentPO.items.push({ productId: null, quantity: null, purchasePrice: null });
  }

  removeItem(index: number) {
    if (this.currentPO.items.length > 1) {
      this.currentPO.items.splice(index, 1);
    }
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

  markAsReceived(id: number) {
    Swal.fire({
      title: 'Mark as Received?',
      text: 'This will update the PO status to RECEIVED. This action should be done after creating a GRN.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, mark as received'
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStatus(id, 'RECEIVED');
      }
    });
  }

  viewPO(po: PurchaseOrder) {
    Swal.fire({
      title: po.poNumber,
      html: `
        <p><strong>Supplier:</strong> ${po.supplierName}</p>
        <p><strong>Total:</strong> LKR ${po.totalAmount}</p>
        <p><strong>Status:</strong> ${po.status}</p>
        <p><strong>Order Date:</strong> ${new Date(po.orderDate).toLocaleDateString()}</p>
      `,
      icon: 'info'
    });
  }
}