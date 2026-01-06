import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockTransferService } from '../../core/services/stock-transfer.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { StockTransfer, TransferRequest } from '../../models/stock-transfer.model';
import { Product } from '../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [StockTransferService, ProductService],
  template: `
    <div class="transfer-container">
      <h1>📦 Stock Transfer Management</h1>
      
      <div class="actions-bar">
        <button class="btn btn-primary" (click)="showRequestForm = !showRequestForm">
          + Request Transfer
        </button>
        <select [(ngModel)]="statusFilter" (change)="filterTransfers()">
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <!-- Request Transfer Form -->
      <div *ngIf="showRequestForm" class="request-form">
        <h3>Request Stock Transfer</h3>
        <form (ngSubmit)="submitTransferRequest()">
          <select [(ngModel)]="transferRequest.productId" name="product" required>
            <option value="">Select Product</option>
            <option *ngFor="let product of products" [value]="product.id">
              {{product.name}} - {{product.category}}
            </option>
          </select>
          
          <select [(ngModel)]="transferRequest.fromRdc" name="fromRdc" required>
            <option value="">From RDC</option>
            <option value="Colombo">Colombo RDC</option>
            <option value="Kandy">Kandy RDC</option>
            <option value="Galle">Galle RDC</option>
            <option value="Jaffna">Jaffna RDC</option>
          </select>
          
          <select [(ngModel)]="transferRequest.toRdc" name="toRdc" required>
            <option value="">To RDC</option>
            <option value="Colombo">Colombo RDC</option>
            <option value="Kandy">Kandy RDC</option>
            <option value="Galle">Galle RDC</option>
            <option value="Jaffna">Jaffna RDC</option>
          </select>
          
          <input type="number" [(ngModel)]="transferRequest.quantity" name="quantity" 
                 placeholder="Quantity" min="1" required>
          
          <textarea [(ngModel)]="transferRequest.reason" name="reason" 
                    placeholder="Reason for transfer" required></textarea>
          
          <div class="form-actions">
            <button type="button" (click)="showRequestForm = false">Cancel</button>
            <button type="submit">Submit Request</button>
          </div>
        </form>
      </div>

      <!-- Transfer List -->
      <div class="transfers-grid">
        <div *ngFor="let transfer of filteredTransfers" class="transfer-card" 
             [ngClass]="'status-' + transfer.status.toLowerCase()">
          <div class="transfer-header">
            <h3>Transfer #{{transfer.id}}</h3>
            <span class="status-badge">{{transfer.status}}</span>
          </div>
          
          <div class="transfer-details">
            <p><strong>Product:</strong> {{transfer.product.name}}</p>
            <p><strong>From:</strong> {{transfer.fromRdc}} → <strong>To:</strong> {{transfer.toRdc}}</p>
            <p><strong>Quantity:</strong> {{transfer.quantity}}</p>
            <p><strong>Requested:</strong> {{formatDate(transfer.requestDate)}}</p>
            <p><strong>Reason:</strong> {{transfer.reason}}</p>
            <p *ngIf="transfer.notes"><strong>Notes:</strong> {{transfer.notes}}</p>
          </div>

          <div class="transfer-actions" *ngIf="userRole === 'HEAD_OFFICE_MANAGER' && transfer.status === 'PENDING'">
            <button (click)="approveTransfer(transfer.id)" class="btn-approve">Approve</button>
            <button (click)="rejectTransfer(transfer.id)" class="btn-reject">Reject</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .transfer-container { padding: 20px; }
    .actions-bar { display: flex; gap: 15px; margin-bottom: 20px; align-items: center; }
    .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #3498db; color: white; }
    .request-form { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .request-form form { display: grid; gap: 15px; max-width: 500px; }
    .request-form select, .request-form input, .request-form textarea { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
    .form-actions { display: flex; gap: 10px; }
    .transfers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .transfer-card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; background: white; }
    .transfer-card.status-pending { border-left: 4px solid #f39c12; }
    .transfer-card.status-approved { border-left: 4px solid #3498db; }
    .transfer-card.status-completed { border-left: 4px solid #27ae60; }
    .transfer-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #ecf0f1; color: #2c3e50; }
    .transfer-details p { margin: 5px 0; }
    .transfer-actions { display: flex; gap: 10px; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee; }
    .btn-approve { background: #27ae60; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-reject { background: #e74c3c; color: white; padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; }
  `]
})
export class StockTransferComponent implements OnInit {
  transfers: StockTransfer[] = [];
  filteredTransfers: StockTransfer[] = [];
  products: Product[] = [];
  statusFilter = '';
  showRequestForm = false;
  userRole = '';

  transferRequest: TransferRequest = {
    productId: 0,
    fromRdc: '',
    toRdc: '',
    quantity: 1,
    reason: '',
    requestedById: 0
  };

  constructor(
    private stockTransferService: StockTransferService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    this.loadTransfers();
    this.loadProducts();
    
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    this.transferRequest.requestedById = userInfo.id;
  }

  loadTransfers() {
    this.stockTransferService.getAllTransfers().subscribe({
      next: (transfers) => {
        this.transfers = transfers;
        this.filteredTransfers = [...this.transfers];
      },
      error: (error) => console.error('Error loading transfers:', error)
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: (error) => console.error('Error loading products:', error)
    });
  }

  filterTransfers() {
    if (this.statusFilter) {
      this.filteredTransfers = this.transfers.filter(t => t.status === this.statusFilter);
    } else {
      this.filteredTransfers = [...this.transfers];
    }
  }

  submitTransferRequest() {
    this.stockTransferService.requestTransfer(this.transferRequest).subscribe({
      next: (transfer) => {
        Swal.fire('Success', 'Transfer request submitted successfully', 'success');
        this.showRequestForm = false;
        this.loadTransfers();
        this.resetForm();
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to submit transfer request', 'error');
        console.error('Error submitting transfer request:', error);
      }
    });
  }

  approveTransfer(transferId: number) {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    this.stockTransferService.approveTransfer(transferId, userInfo.id, 'Approved').subscribe({
      next: (transfer) => {
        Swal.fire('Success', 'Transfer approved successfully', 'success');
        this.loadTransfers();
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to approve transfer', 'error');
        console.error('Error approving transfer:', error);
      }
    });
  }

  rejectTransfer(transferId: number) {
    // Implementation for reject transfer
    Swal.fire('Info', 'Reject functionality to be implemented', 'info');
  }

  resetForm() {
    this.transferRequest = {
      productId: 0,
      fromRdc: '',
      toRdc: '',
      quantity: 1,
      reason: '',
      requestedById: this.transferRequest.requestedById
    };
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}