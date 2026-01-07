import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../models/product.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductService],
  template: `
    <div class="catalog-container">
      <div class="catalog-header">
        <h1>🛍️ Product Catalog</h1>
        <div class="search-filters">
          <input type="text" [(ngModel)]="searchTerm" (input)="filterProducts()" 
                 placeholder="Search products..." class="search-input">
          <select [(ngModel)]="categoryFilter" (change)="filterProducts()" class="category-filter">
            <option value="">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">{{category}}</option>
          </select>
        </div>
      </div>

      <div class="products-grid">
        <div *ngFor="let product of filteredProducts" class="product-card">
          <div class="product-image">
            <img [src]="product.imageUrl || '/assets/default-product.png'" 
                 [alt]="product.name" onerror="this.src='/assets/default-product.png'">
          </div>
          
          <div class="product-info">
            <h3>{{product.name}}</h3>
            <p class="product-description">{{product.description}}</p>
            <div class="product-details">
              <span class="price">\${{product.price}}</span>
              <span class="unit">per {{product.unit}}</span>
              <div class="stock-info">
                <span class="stock" [class.low-stock]="product.unit <= 10" [class.out-of-stock]="product.unit === 0">
                  {{product.unit > 0 ? product.unit + ' in stock' : 'Out of stock'}}
                </span>
              </div>
            </div>
          </div>

          <div class="product-actions" *ngIf="product.unit > 0">
            <div class="quantity-selector">
              <button (click)="decreaseQuantity(product)" class="qty-btn">-</button>
              <input type="number" [(ngModel)]="product.selectedQuantity" 
                     [max]="product.unit" min="1" class="qty-input">
              <button (click)="increaseQuantity(product)" [disabled]="product.selectedQuantity >= product.unit" class="qty-btn">+</button>
            </div>
            <button (click)="addToCart(product)" [disabled]="product.selectedQuantity > product.unit" class="btn-add-cart">
              Add to Cart
            </button>
          </div>
          
          <div class="product-actions out-of-stock" *ngIf="product.unit === 0">
            <span class="out-of-stock-text">Out of Stock</span>
          </div>
        </div>
      </div>

      <div *ngIf="filteredProducts.length === 0" class="no-products">
        <p>No products found matching your criteria.</p>
      </div>

      <div *ngIf="cartItemCount > 0" class="cart-summary">
        <h3>Cart ({{cartItemCount}} items)</h3>
        <div class="cart-total">Total: \${{getCartTotal()}}</div>
        <button (click)="proceedToCheckout()" class="btn-checkout">
          View Cart
        </button>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container { padding: 20px; }
    .catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .search-filters { display: flex; gap: 15px; }
    .search-input, .category-filter { padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
    .search-input { width: 300px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .product-card { border: 1px solid #ddd; border-radius: 12px; overflow: hidden; background: white; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s; }
    .product-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .product-image { height: 200px; overflow: hidden; }
    .product-image img { width: 100%; height: 100%; object-fit: cover; }
    .product-info { padding: 15px; }
    .product-info h3 { margin-bottom: 8px; color: #333; }
    .product-description { color: #666; font-size: 14px; margin-bottom: 10px; }
    .product-details { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .price { font-size: 18px; font-weight: bold; color: #27ae60; }
    .unit { color: #666; font-size: 12px; }
    .product-actions { padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
    .quantity-selector { display: flex; align-items: center; gap: 5px; }
    .qty-btn { width: 30px; height: 30px; border: 1px solid #ddd; background: white; cursor: pointer; border-radius: 4px; }
    .qty-input { width: 60px; text-align: center; border: 1px solid #ddd; border-radius: 4px; padding: 5px; }
    .btn-add-cart { background: #3498db; color: white; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; }
    .btn-add-cart:hover { background: #2980b9; }
    .cart-summary { position: fixed; bottom: 20px; right: 20px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); min-width: 250px; }
    .cart-total { font-size: 18px; font-weight: bold; margin: 10px 0; }
    .btn-checkout { width: 100%; background: #27ae60; color: white; padding: 12px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
    .no-products { text-align: center; padding: 40px; color: #666; }
    .stock { font-size: 12px; color: #27ae60; font-weight: 500; }
    .low-stock { color: #f39c12; }
    .out-of-stock { color: #e74c3c; }
    .stock-info { margin-top: 5px; }
    .qty-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-add-cart:disabled { opacity: 0.5; cursor: not-allowed; background: #bdc3c7; }
    .out-of-stock-text { color: #e74c3c; font-weight: bold; text-align: center; width: 100%; }
  `]
})
export class ProductCatalogComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  searchTerm = '';
  categoryFilter = '';
  cartItemCount = 0;

  constructor(
    private productService: ProductService,
    public cartService: CartService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.cartService.getCartItems().subscribe(items => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products.map(p => ({...p, selectedQuantity: 1}));
        this.filteredProducts = [...this.products];
        this.categories = [...new Set(products.map(p => p.category).filter(Boolean))];
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.categoryFilter || product.category === this.categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }

  increaseQuantity(product: any) {
    if (product.selectedQuantity < product.unit) {
      product.selectedQuantity++;
    }
  }

  decreaseQuantity(product: any) {
    if (product.selectedQuantity > 1) {
      product.selectedQuantity--;
    }
  }

  addToCart(product: any) {
    if (product.selectedQuantity > product.unit) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Quantity',
        text: `Only ${product.unit} items available in stock`
      });
      return;
    }
    
    this.cartService.addToCart(product, product.selectedQuantity).subscribe({
      next: () => {
        this.notificationService.addLocalNotification({
          title: 'Added to Cart',
          message: `${product.name} (${product.selectedQuantity}) added to cart`,
          type: 'ORDER',
          isRead: false
        });
        
        Swal.fire({
          icon: 'success',
          title: 'Added to Cart!',
          text: `${product.name} (${product.selectedQuantity}) added to cart`,
          timer: 1500,
          showConfirmButton: false
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add item to cart'
        });
      }
    });
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  proceedToCheckout() {
    this.cartService.getCartItems().subscribe(items => {
      if (items.length === 0) return;
      
      Swal.fire({
        title: 'Proceed to Checkout?',
        text: `Total: $${this.getCartTotal()}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Go to Cart'
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/cart';
        }
      });
    });
  }

  placeOrder() {
    // This method is no longer needed as we use cart service
  }
}