import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductService],
  template: `
    <div class="products-container">
      <div class="header">
        <h1>📦 Product Management</h1>
        <button class="btn btn-primary" (click)="showAddModal()">Add Product</button>
      </div>

      <div class="filters">
        <input type="text" placeholder="Search products..." [(ngModel)]="searchTerm" (input)="searchProducts()">
        <select [(ngModel)]="selectedCategory" (change)="filterByCategory()">
          <option value="">All Categories</option>
          <option *ngFor="let category of categories" [value]="category">{{category}}</option>
        </select>
      </div>

      <div class="products-grid">
        <div *ngIf="filteredProducts.length === 0" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No Products Found</h3>
          <p>No products are available. Click "Add Product" to get started.</p>
        </div>
        <div *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-image">
            <img [src]="product.imageUrl || 'https://via.placeholder.com/200x150?text=No+Image'" 
                 [alt]="product.name" class="product-img">
          </div>
          <div class="product-content">
            <h3>{{product.name}}</h3>
            <p class="category"><strong>Category:</strong> {{product.category}}</p>
            <p class="description"><strong>Description:</strong> {{product.description}}</p>
            <div class="product-details">
              <span class="price"><strong>Price:</strong> \${{product.price}}</span>
              <span class="unit">per {{product.unit}}</span>
            </div>
            <div class="stock-info">
              <span class="min-stock"><strong>Min Stock:</strong> {{product.minStockLevel}}</span>
            </div>
            <div class="actions">
              <button class="btn btn-sm" (click)="editProduct(product)">Edit</button>
              <button class="btn btn-sm btn-danger" (click)="deleteProduct(product.id!)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add/Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h2>{{isEditing ? 'Edit' : 'Add'}} Product</h2>
          <form (ngSubmit)="saveProduct()">
            <label>Product Name *</label>
            <input type="text" placeholder="Enter product name" [(ngModel)]="currentProduct.name" name="name" required>
            
            <label>SKU/Item Code</label>
            <input type="text" placeholder="Auto-generated if empty" [(ngModel)]="currentProduct.sku" name="sku">
            
            <label>Brand</label>
            <input type="text" placeholder="Enter brand name (optional)" [(ngModel)]="currentProduct.brand" name="brand">
            
            <label>Description</label>
            <textarea placeholder="Enter product description" [(ngModel)]="currentProduct.description" name="description"></textarea>
            
            <label>Category *</label>
            <select [(ngModel)]="currentProduct.category" name="category" required>
              <option value="">Select Category</option>
              <option *ngFor="let category of categories" [value]="category">{{category}}</option>
            </select>
            
            <label>Selling Price *</label>
            <input type="number" placeholder="Enter selling price" [(ngModel)]="currentProduct.price" name="price" step="0.01" required>
            
            <label>Purchase Price</label>
            <input type="number" placeholder="Auto-calculated if empty" [(ngModel)]="currentProduct.purchasePrice" name="purchasePrice" step="0.01">
            
            <label>Tax Rate (%)</label>
            <input type="number" placeholder="0" [(ngModel)]="currentProduct.taxRate" name="taxRate" step="0.01" min="0" max="100">
            
            <label>Unit *</label>
            <select [(ngModel)]="currentProduct.unit" name="unit" required>
              <option value="">Select Unit</option>
              <option value="pcs">Pieces</option>
              <option value="kg">Kilograms</option>
              <option value="liters">Liters</option>
              <option value="boxes">Boxes</option>
            </select>
            
            <label>Image</label>
            <input type="file" accept="image/*" (change)="onImageSelected($event)" name="image">
            <div *ngIf="selectedImage || imagePreview" class="image-preview">
              <img [src]="imagePreview" alt="Preview" class="preview-img">
              <button type="button" class="btn-remove" (click)="removeImage()">×</button>
            </div>
            <input type="url" placeholder="Or enter image URL" [(ngModel)]="currentProduct.imageUrl" name="imageUrl">
            
            <label>Minimum Stock Level *</label>
            <input type="number" placeholder="Enter minimum stock level" [(ngModel)]="currentProduct.minStockLevel" name="minStock" required>
            
            <div class="modal-actions">
              <button type="button" class="btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-container { padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filters { display: flex; gap: 10px; margin-bottom: 20px; }
    .filters input, .filters select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
    .product-card { border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .product-image { width: 100%; height: 200px; overflow: hidden; }
    .product-img { width: 100%; height: 100%; object-fit: cover; }
    .product-content { padding: 16px; }
    .product-card h3 { margin: 0 0 8px 0; color: #333; font-size: 18px; }
    .category { color: #666; font-size: 12px; margin: 0 0 8px 0; }
    .description { color: #777; font-size: 14px; margin-bottom: 12px; }
    .product-details { display: flex; justify-content: space-between; margin-bottom: 8px; }
    .price { font-weight: bold; color: #007bff; }
    .unit { color: #666; font-size: 12px; }
    .stock-info { margin-bottom: 12px; }
    .min-stock { font-size: 12px; color: #666; }
    .actions { display: flex; gap: 8px; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-danger { background: #dc3545; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; }
    .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; padding: 24px; border-radius: 8px; width: 400px; max-width: 90vw; }
    .modal h2 { margin: 0 0 16px 0; }
    .modal input, .modal textarea, .modal select { width: 100%; padding: 8px; margin-bottom: 4px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
    .modal label { display: block; font-weight: 500; margin-bottom: 4px; margin-top: 8px; color: #333; }
    .modal input[type="file"] { margin-bottom: 8px; }
    .image-preview { position: relative; display: inline-block; margin: 8px 0; }
    .preview-img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
    .btn-remove { position: absolute; top: -8px; right: -8px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 12px; }
    .modal textarea { height: 80px; resize: vertical; }
    .empty-state { text-align: center; padding: 60px 20px; color: #666; grid-column: 1 / -1; }
    .empty-icon { font-size: 4rem; margin-bottom: 1rem; }
    .empty-state h3 { margin: 0 0 0.5rem 0; color: #333; }
    .empty-state p { margin: 0; }
  `]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  searchTerm = '';
  selectedCategory = '';
  showModal = false;
  isEditing = false;
  currentProduct: Product = this.getEmptyProduct();
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(private productService: ProductService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    console.log('Loading products...');
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Products loaded:', products);
        console.log('Assigning to this.products');
        this.products = products;
        this.filteredProducts = [...products];
        this.cdr.detectChanges();
        console.log('After assignment - products:', this.products);
        console.log('After assignment - filteredProducts:', this.filteredProducts);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        Swal.fire('Error', 'Failed to load products. Please check your connection.', 'error');
      }
    });
  }

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  searchProducts() {
    if (this.searchTerm.trim()) {
      this.productService.searchProducts(this.searchTerm).subscribe({
        next: (products) => this.filteredProducts = products,
        error: (error) => console.error('Error searching products:', error)
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  filterByCategory() {
    if (this.selectedCategory) {
      this.productService.getProductsByCategory(this.selectedCategory).subscribe({
        next: (products) => this.filteredProducts = products,
        error: (error) => console.error('Error filtering products:', error)
      });
    } else {
      this.filteredProducts = this.products;
    }
  }

  showAddModal() {
    this.isEditing = false;
    this.currentProduct = this.getEmptyProduct();
    this.showModal = true;
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.currentProduct = { ...product };
    this.selectedImage = null;
    this.imagePreview = product.imageUrl || null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedImage = null;
    this.imagePreview = null;
    this.currentProduct = this.getEmptyProduct();
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.currentProduct.imageUrl = '';
  }

  saveProduct() {
    if (this.selectedImage) {
      // Upload image first
      this.productService.uploadImage(this.selectedImage).subscribe({
        next: (response) => {
          this.currentProduct.imageUrl = response.imageUrl;
          this.saveProductData();
        },
        error: (error) => {
          Swal.fire('Error', 'Failed to upload image', 'error');
        }
      });
    } else {
      this.saveProductData();
    }
  }

  private saveProductData() {
    if (this.isEditing) {
      this.productService.updateProduct(this.currentProduct.id!, this.currentProduct).subscribe({
        next: (updatedProduct) => {
          this.closeModal();
          this.loadProducts();
          Swal.fire('Success', 'Product updated successfully', 'success');
        },
        error: (error) => Swal.fire('Error', 'Failed to update product', 'error')
      });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe({
        next: (newProduct) => {
          this.closeModal();
          this.loadProducts();
          Swal.fire('Success', 'Product created successfully', 'success');
        },
        error: (error) => Swal.fire('Error', 'Failed to create product', 'error')
      });
    }
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(id).subscribe({
          next: (response) => {
            // Remove from local arrays immediately
            this.products = this.products.filter(p => p.id !== id);
            this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
            this.cdr.detectChanges();
            Swal.fire('Deleted', 'Product deleted successfully', 'success');
          },
          error: (error) => {
            console.error('Delete error:', error);
            Swal.fire('Error', 'Failed to delete product', 'error');
          }
        });
      }
    });
  }

  private getEmptyProduct(): Product {
    return {
      name: '',
      description: '',
      category: '',
      price: 0,
      unit: '',
      imageUrl: '',
      minStockLevel: 0
    };
  }
}