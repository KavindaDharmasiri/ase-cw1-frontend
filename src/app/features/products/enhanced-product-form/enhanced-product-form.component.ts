import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

interface ProductForm {
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  imageUrl: string;
  minStockLevel: number;
  sku: string;
  brand: string;
  purchasePrice: number;
  taxRate: number;
}

@Component({
  selector: 'app-enhanced-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-4">
      <h2>Enhanced Product Management</h2>
      
      <div class="card">
        <div class="card-header">
          <h5>Create/Edit Product</h5>
        </div>
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #productForm="ngForm">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Product Name *</label>
                  <input type="text" class="form-control" [(ngModel)]="product.name" 
                         name="name" required>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">SKU/Item Code *</label>
                  <input type="text" class="form-control" [(ngModel)]="product.sku" 
                         name="sku" required>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Brand</label>
                  <input type="text" class="form-control" [(ngModel)]="product.brand" 
                         name="brand">
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Category *</label>
                  <select class="form-control" [(ngModel)]="product.category" 
                          name="category" required>
                    <option value="">Select Category</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Food">Food</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="Household">Household</option>
                  </select>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Unit of Measure *</label>
                  <select class="form-control" [(ngModel)]="product.unit" 
                          name="unit" required>
                    <option value="">Select Unit</option>
                    <option value="pcs">Pieces</option>
                    <option value="kg">Kilograms</option>
                    <option value="liters">Liters</option>
                    <option value="boxes">Boxes</option>
                  </select>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Purchase Price (Rs.) *</label>
                  <input type="number" class="form-control" [(ngModel)]="product.purchasePrice" 
                         name="purchasePrice" step="0.01" required>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Selling Price (Rs.) *</label>
                  <input type="number" class="form-control" [(ngModel)]="product.price" 
                         name="price" step="0.01" required>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Tax Rate (%)</label>
                  <input type="number" class="form-control" [(ngModel)]="product.taxRate" 
                         name="taxRate" step="0.01" min="0" max="100">
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Reorder Level *</label>
                  <input type="number" class="form-control" [(ngModel)]="product.minStockLevel" 
                         name="minStockLevel" required>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Image URL</label>
                  <input type="url" class="form-control" [(ngModel)]="product.imageUrl" 
                         name="imageUrl">
                </div>
              </div>
            </div>
            
            <div class="mb-3">
              <label class="form-label">Description</label>
              <textarea class="form-control" [(ngModel)]="product.description" 
                        name="description" rows="3"></textarea>
            </div>
            
            <div class="d-flex gap-2">
              <button type="submit" class="btn btn-primary" [disabled]="!productForm.form.valid">
                Save Product
              </button>
              <button type="button" class="btn btn-secondary" (click)="resetForm()">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class EnhancedProductFormComponent implements OnInit {
  product: ProductForm = {
    name: '',
    description: '',
    category: '',
    price: 0,
    unit: '',
    imageUrl: '',
    minStockLevel: 0,
    sku: '',
    brand: '',
    purchasePrice: 0,
    taxRate: 0
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {}

  onSubmit() {
    if (this.isFormValid()) {
      this.productService.createProduct(this.product).subscribe({
        next: (response) => {
          alert('Product created successfully!');
          this.resetForm();
        },
        error: (error) => {
          alert('Error creating product: ' + error.message);
        }
      });
    }
  }

  resetForm() {
    this.product = {
      name: '',
      description: '',
      category: '',
      price: 0,
      unit: '',
      imageUrl: '',
      minStockLevel: 0,
      sku: '',
      brand: '',
      purchasePrice: 0,
      taxRate: 0
    };
  }

  private isFormValid(): boolean {
    return !!(this.product.name && this.product.sku && this.product.category && 
              this.product.unit && this.product.price > 0 && this.product.purchasePrice > 0);
  }
}