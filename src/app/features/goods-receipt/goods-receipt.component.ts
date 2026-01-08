import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoodsReceiptService } from '../../core/services/goods-receipt.service';
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
            <span class="date-badge">{{grn.receivedDate | date:'short'}}</span>
          </div>
          <div class="grn-details">
            <p><strong>PO Number:</strong> {{grn.purchaseOrder?.poNumber || 'N/A'}}</p>
            <p><strong>RDC:</strong> {{grn.rdc?.name || 'N/A'}}</p>
            <p><strong>Received By:</strong> {{grn.receivedBy}}</p>
            <p><strong>Items:</strong> {{grn.items?.length || 0}}</p>
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
            <select [(ngModel)]="currentGRN.purchaseOrder" name="po" required>
              <option value="">Select Purchase Order</option>
              <option *ngFor="let po of purchaseOrders" [ngValue]="po">{{po.poNumber}}</option>
            </select>
            
            <label>Received By *</label>
            <input type="text" [(ngModel)]="currentGRN.receivedBy" name="receivedBy" required>
            
            <label>Remarks</label>
            <textarea [(ngModel)]="currentGRN.remarks" name="remarks" placeholder="Any remarks about the receipt"></textarea>
            
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
    .modal { background: white; padding: 24px; border-radius: 8px; width: 500px; max-width: 90vw; }
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
  currentGRN: any = { purchaseOrder: null, receivedBy: '', remarks: '' };

  constructor(private goodsReceiptService: GoodsReceiptService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadGRNs();
    this.loadPurchaseOrders();
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
    // Load confirmed purchase orders
    this.purchaseOrders = []; // Placeholder
  }

  openAddModal() {
    this.currentGRN = { purchaseOrder: null, receivedBy: '', remarks: '' };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveGRN() {
    this.goodsReceiptService.createGoodsReceiptNote(this.currentGRN).subscribe({
      next: () => {
        this.closeModal();
        this.loadGRNs();
        Swal.fire('Success', 'Goods Receipt Note created successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to create GRN', 'error')
    });
  }

  viewGRN(grn: any) {
    Swal.fire({
      title: grn.grnNumber,
      html: `
        <p><strong>PO Number:</strong> ${grn.purchaseOrder?.poNumber || 'N/A'}</p>
        <p><strong>Received Date:</strong> ${new Date(grn.receivedDate).toLocaleDateString()}</p>
        <p><strong>Received By:</strong> ${grn.receivedBy}</p>
        <p><strong>Items Count:</strong> ${grn.items?.length || 0}</p>
        <p><strong>Remarks:</strong> ${grn.remarks || 'None'}</p>
      `,
      icon: 'info',
      width: 600
    });
  }
}