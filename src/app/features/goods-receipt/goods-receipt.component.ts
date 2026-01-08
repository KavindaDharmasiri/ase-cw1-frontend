import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { GoodsReceiptService } from '../../core/services/goods-receipt.service';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-goods-receipt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="goods-receipt">
      <div class="header">
        <h1>📦 Goods Receipt Notes</h1>
        <button class="btn btn-primary" (click)="openAddModal()">Create GRN</button>
      </div>

      <div class="grn-grid">
        <div *ngIf="grns.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No Goods Receipt Notes Found</h3>
          <p>Create GRNs to record received goods from suppliers.</p>
        </div>
        <div *ngFor="let grn of grns" class="grn-card">
          <div class="grn-header">
            <h3>{{grn.grnNumber}}</h3>
            <span class="date-badge">{{grn.deliveryReceiveDate | date:'short'}}</span>
          </div>
          <div class="grn-details">
            <p><strong>PO Number:</strong> {{grn.poNumber || 'N/A'}}</p>
            <p><strong>RDC:</strong> {{grn.rdcName || 'N/A'}}</p>
<!--            <p><strong>Received By:</strong> {{grn.receivedBy || 'System'}}</p>-->
<!--            <p><strong>Items:</strong> {{grn.items?.length || 0}}</p>-->
          </div>
          <div class="grn-actions">
            <button class="btn btn-sm btn-info" (click)="viewGRN(grn)">View Details</button>
          </div>
        </div>
      </div>

      <!-- Add GRN Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>Create Goods Receipt Note</h2>
          <form (ngSubmit)="saveGRN()">
            <label>Purchase Order *</label>
            <select [(ngModel)]="currentGRN.poId" name="poId" (change)="onPOSelected()" required>
              <option value="">Select Purchase Order</option>
              <option *ngFor="let po of purchaseOrders" [value]="po.id">{{po.poNumber}} - {{po.supplierName}}</option>
            </select>

            <label>RDC *</label>
            <select [(ngModel)]="currentGRN.rdcId" name="rdcId" required>
              <option value="">Select RDC</option>
              <option *ngFor="let rdc of rdcs" [value]="rdc.id">{{rdc.name}}</option>
            </select>

            <label>Delivery Date *</label>
            <input type="date" [(ngModel)]="currentGRN.deliveryDate" name="deliveryDate" required>

            <label>Warehouse Location</label>
            <input type="text" [(ngModel)]="currentGRN.warehouseLocation" name="warehouseLocation" placeholder="e.g., Zone A, Rack 1">

            <h3>Items Received</h3>
            <div *ngFor="let item of currentGRN.items; let i = index" class="item-row">
              <div class="product-info">
                <strong>{{item.productName || 'Select Product'}}</strong>
                <select [(ngModel)]="item.productId" [name]="'product_' + i" *ngIf="!item.productName" required>
                  <option value="">Select Product</option>
                  <option *ngFor="let product of products" [value]="product.id">{{product.name}}</option>
                </select>
              </div>
              <input type="number" [(ngModel)]="item.orderedQuantity" [name]="'ordered_' + i" placeholder="Ordered" readonly class="readonly-input">
              <input type="number" [(ngModel)]="item.deliveredQuantity" [name]="'delivered_' + i" placeholder="Delivered" required>
              <input type="number" [(ngModel)]="item.damagedQuantity" [name]="'damaged_' + i" placeholder="Damaged" value="0">
              <input type="text" [(ngModel)]="item.batchNumber" [name]="'batch_' + i" placeholder="Batch #">
              <input type="date" [(ngModel)]="item.expiryDate" [name]="'expiry_' + i">
            </div>

            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Create GRN</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .goods-receipt { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .grn-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .grn-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background: white; }
    .grn-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .grn-header h3 { margin: 0; }
    .date-badge { background: #17a2b8; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
    .grn-details p { margin: 4px 0; }
    .grn-actions { display: flex; gap: 8px; margin-top: 12px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-info { background: #17a2b8; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 800px; max-width: 90vw; }
    .item-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px; align-items: center; font-size: 12px; }
    .product-info { display: flex; flex-direction: column; }
    .product-info strong { color: #495057; margin-bottom: 4px; font-size: 13px; }
    .readonly-input { background-color: #f8f9fa; color: #6c757d; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal select, .modal textarea { width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 600; margin-bottom: 4px; margin-top: 8px; color: #495057; font-size: 14px; }
    .modal textarea { height: 80px; resize: vertical; }
    .modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class GoodsReceiptComponent implements OnInit {
  grns: any[] = [];
  purchaseOrders: any[] = [];
  showModal = false;
  currentGRN: any = {
    poId: null,
    rdcId: null,
    deliveryDate: null,
    warehouseLocation: '',
    items: [{ productId: null, orderedQuantity: 0, deliveredQuantity: null, damagedQuantity: 0, batchNumber: '', expiryDate: null }]
  };
  rdcs: any[] = [];
  products: any[] = [];

  constructor(private goodsReceiptService: GoodsReceiptService, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadGRNs();
    this.loadPurchaseOrders();
    this.loadRDCs();
    this.loadProducts();
  }

  loadGRNs() {
    this.goodsReceiptService.getAllGoodsReceiptNotes().subscribe({
      next: (grns) => {
        this.grns = grns;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading GRNs:', error)
    });
  }

  loadPurchaseOrders() {
    // Load ISSUED purchase orders that can be received
    this.http.get<any[]>(`${environment.apiUrl}${environment.endpoints.procurement.base}/purchase-orders`)
      .subscribe({
        next: (orders) => {
          // Filter only ISSUED orders for GRN creation
          this.purchaseOrders = orders.filter(po => po.status === 'ISSUED');
          console.log('Loaded purchase orders for GRN:', this.purchaseOrders);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading purchase orders:', error);
          this.purchaseOrders = [];
        }
      });
  }

  loadRDCs() {
    this.http.get<any[]>(`${environment.apiUrl}/rdcs`)
      .subscribe({
        next: (rdcs) => {
          this.rdcs = rdcs;
          console.log('Loaded RDCs:', rdcs);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error loading RDCs:', error);
          // Fallback mock data
          this.rdcs = [
            { id: 1, name: 'Colombo RDC' },
            { id: 2, name: 'Kandy RDC' },
            { id: 3, name: 'Galle RDC' }
          ];
        }
      });
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
          console.error('Error loading products:', error);
          // Fallback mock data
          this.products = [
            { id: 1, name: 'Rice 1kg' },
            { id: 2, name: 'Sugar 1kg' },
            { id: 3, name: 'Flour 1kg' }
          ];
        }
      });
  }

  openAddModal() {
    this.currentGRN = {
      poId: null,
      rdcId: null,
      deliveryDate: null,
      warehouseLocation: '',
      items: [{ productId: null, orderedQuantity: 0, deliveredQuantity: null, damagedQuantity: 0, batchNumber: '', expiryDate: null }]
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onPOSelected() {
    if (this.currentGRN.poId) {
      // Find selected PO and load its items
      const selectedPO = this.purchaseOrders.find(po => po.id == this.currentGRN.poId);
      if (selectedPO) {
        console.log('Selected PO:', selectedPO);

        // Fetch PO details from backend
        this.http.get<any>(`${environment.apiUrl}${environment.endpoints.procurement.base}/purchase-orders/${this.currentGRN.poId}`)
          .subscribe({
            next: (poDetails) => {
              console.log('PO Details with items:', poDetails);

              // Auto-populate items from PO using new DTO structure
              this.currentGRN.items = poDetails.items?.map((item: any) => ({
                productId: item.productId,
                productName: item.productName,
                orderedQuantity: item.orderedQuantity,
                deliveredQuantity: null, // User must enter
                damagedQuantity: 0,
                batchNumber: '',
                expiryDate: null
              })) || [];

              // If no items from API, create empty item
              if (this.currentGRN.items.length === 0) {
                this.currentGRN.items = [{
                  productId: null,
                  productName: '',
                  orderedQuantity: 0,
                  deliveredQuantity: null,
                  damagedQuantity: 0,
                  batchNumber: '',
                  expiryDate: null
                }];
              }

              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error('Error loading PO details:', error);
              // Fallback to empty item
              this.currentGRN.items = [{
                productId: null,
                productName: '',
                orderedQuantity: 0,
                deliveredQuantity: null,
                damagedQuantity: 0,
                batchNumber: '',
                expiryDate: null
              }];
            }
          });
      }
    } else {
      // Reset items when no PO selected
      this.currentGRN.items = [{
        productId: null,
        productName: '',
        orderedQuantity: 0,
        deliveredQuantity: null,
        damagedQuantity: 0,
        batchNumber: '',
        expiryDate: null
      }];
    }
  }

  saveGRN() {
    console.log('Saving GRN:', this.currentGRN);
    this.goodsReceiptService.createGoodsReceiptNote(this.currentGRN).subscribe({
      next: (response) => {
        console.log('GRN created successfully:', response);
        this.closeModal();
        this.loadGRNs();
        Swal.fire({
          title: 'Success!',
          text: 'Goods Receipt Note created successfully',
          icon: 'success',
          confirmButtonColor: '#28a745'
        });
      },
      error: (error) => {
        console.error('Error creating GRN:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to create GRN. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }
    });
  }

  viewGRN(grn: any) {
    this.goodsReceiptService.getGoodsReceiptNoteById(grn.id).subscribe({
      next: (grnDetails) => {
        Swal.fire({
          title: grnDetails.grnNumber,
          html: `
            <p><strong>PO Number:</strong> ${grnDetails.poNumber || 'N/A'}</p>
            <p><strong>RDC:</strong> ${grnDetails.rdcName || 'N/A'}</p>
            <p><strong>Delivery Date:</strong> ${new Date(grnDetails.deliveryReceiveDate).toLocaleDateString()}</p>
            <p><strong>Warehouse Location:</strong> ${grnDetails.warehouseLocation || 'N/A'}</p>
            <p><strong>Items Count:</strong> ${grnDetails.items?.length || 0}</p>
          `,
          icon: 'info',
          width: 600
        });
      },
      error: (error) => {
        console.error('Error loading GRN details:', error);
        Swal.fire('Error', 'Failed to load GRN details', 'error');
      }
    });
  }
}
