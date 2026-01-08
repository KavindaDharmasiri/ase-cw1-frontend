import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ProductPricing {
  id?: number;
  productId: number;
  productName: string;
  pricePerUnit: number;
  taxPercentage: number;
  promotionalPrice?: number;
  discountPercentage?: number;
  effectiveDate?: string;
  expiryDate?: string;
  status: string;
}

@Component({
  selector: 'app-pricing-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>💰 Pricing & Promotions Management</h2>
      
      <div class="card">
        <div class="card-header d-flex justify-content-between">
          <h5>Product Pricing</h5>
          <button class="btn btn-primary btn-sm" (click)="showAddModal()">Set Pricing</button>
        </div>
        <div class="card-body">
          <table class="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Tax %</th>
                <th>Promo Price</th>
                <th>Effective Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pricing of pricingList">
                <td>{{pricing.productName}}</td>
                <td>Rs. {{pricing.pricePerUnit}}</td>
                <td>{{pricing.taxPercentage}}%</td>
                <td>
                  <span *ngIf="pricing.promotionalPrice" class="text-success">
                    Rs. {{pricing.promotionalPrice}}
                  </span>
                  <span *ngIf="!pricing.promotionalPrice" class="text-muted">-</span>
                </td>
                <td>{{pricing.effectiveDate | date:'short'}}</td>
                <td>{{pricing.expiryDate | date:'short'}}</td>
                <td>
                  <span class="badge" [ngClass]="{
                    'bg-success': pricing.status === 'ACTIVE',
                    'bg-warning': pricing.status === 'INACTIVE'
                  }">
                    {{pricing.status}}
                  </span>
                </td>
                <td>
                  <button class="btn btn-sm btn-outline-primary" (click)="editPricing(pricing)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-content">
            <div class="modal-header">
              <h5>{{isEditing ? 'Edit' : 'Set'}} Pricing</h5>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="savePricing()">
                <div class="mb-3">
                  <label class="form-label">Product *</label>
                  <select class="form-control" [(ngModel)]="currentPricing.productId" name="productId" required>
                    <option value="">Select Product</option>
                    <option value="1">Coca Cola 330ml</option>
                    <option value="2">Pepsi 330ml</option>
                  </select>
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Price per Unit *</label>
                      <input type="number" class="form-control" [(ngModel)]="currentPricing.pricePerUnit" 
                             name="pricePerUnit" step="0.01" required>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Tax % *</label>
                      <input type="number" class="form-control" [(ngModel)]="currentPricing.taxPercentage" 
                             name="taxPercentage" step="0.01" required>
                    </div>
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Promotional Price</label>
                  <input type="number" class="form-control" [(ngModel)]="currentPricing.promotionalPrice" 
                         name="promotionalPrice" step="0.01">
                </div>
                
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Effective Date</label>
                      <input type="datetime-local" class="form-control" [(ngModel)]="currentPricing.effectiveDate" 
                             name="effectiveDate">
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Expiry Date</label>
                      <input type="datetime-local" class="form-control" [(ngModel)]="currentPricing.expiryDate" 
                             name="expiryDate">
                    </div>
                  </div>
                </div>
                
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
                  <button type="submit" class="btn btn-primary">Save Pricing</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-dialog {
      background: white;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 20px;
    }
  `]
})
export class PricingManagementComponent implements OnInit {
  pricingList: ProductPricing[] = [];
  showModal = false;
  isEditing = false;
  currentPricing: ProductPricing = this.getEmptyPricing();

  ngOnInit() {
    this.loadPricing();
  }

  loadPricing() {
    this.pricingList = [];
  }

  showAddModal() {
    this.isEditing = false;
    this.currentPricing = this.getEmptyPricing();
    this.showModal = true;
  }

  editPricing(pricing: ProductPricing) {
    this.isEditing = true;
    this.currentPricing = { ...pricing };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePricing() {
    this.currentPricing.productName = this.currentPricing.productId === 1 ? 'Coca Cola 330ml' : 'Pepsi 330ml';
    
    if (this.isEditing) {
      const index = this.pricingList.findIndex(p => p.id === this.currentPricing.id);
      if (index !== -1) {
        this.pricingList[index] = { ...this.currentPricing };
      }
    } else {
      this.currentPricing.id = Date.now();
      this.pricingList.push({ ...this.currentPricing });
    }
    
    this.closeModal();
  }

  private getEmptyPricing(): ProductPricing {
    return {
      productId: 0,
      productName: '',
      pricePerUnit: 0,
      taxPercentage: 0,
      status: 'ACTIVE'
    };
  }
}