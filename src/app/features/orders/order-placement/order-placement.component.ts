import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../models/product.model';
import { OrderService } from '../../../core/services/order.service';
import { CreateOrderRequest } from '../../../models/order.model';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';

interface CartItem {
  product: Product;
  quantity: number;
  totalPrice: number;
}

@Component({
  selector: 'app-order-placement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductService, OrderService],
  template: `
    <div class="order-container">
      <h1>🛍️ Place New Order</h1>
      
      <div class="order-layout">
        <!-- Product Selection -->
        <div class="product-section">
          <h2>Select Products</h2>
          
          <div class="search-bar">
            <input type="text" placeholder="Search products..." 
                   [(ngModel)]="searchTerm" (input)="searchProducts()">
            <select [(ngModel)]="selectedCategory" (change)="filterByCategory()">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">{{category}}</option>
            </select>
          </div>

          <div class="products-grid">
            <div *ngFor="let product of filteredProducts" class="product-card">
              <h3>{{product.name}}</h3>
              <p class="category">{{product.category}}</p>
              <p class="price">\${{product.price}} per {{product.unit}}</p>
              <div class="add-to-cart">
                <input type="number" min="1" [(ngModel)]="product.orderQuantity" placeholder="Qty">
                <button (click)="addToCart(product)" [disabled]="!product.orderQuantity">Add to Cart</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Shopping Cart -->
        <div class="cart-section">
          <h2>Shopping Cart ({{cartItems.length}} items)</h2>
          
          <div *ngIf="cartItems.length === 0" class="empty-cart">
            <p>Your cart is empty</p>
          </div>

          <div *ngFor="let item of cartItems" class="cart-item">
            <div class="item-info">
              <h4>{{item.product.name}}</h4>
              <p>\${{item.product.price}} × {{item.quantity}} = \${{item.totalPrice}}</p>
            </div>
            <div class="item-actions">
              <input type="number" min="1" [(ngModel)]="item.quantity" (change)="updateCartItem(item)">
              <button class="remove-btn" (click)="removeFromCart(item)">Remove</button>
            </div>
          </div>

          <div *ngIf="cartItems.length > 0" class="cart-summary">
            <div class="total">
              <strong>Total: \${{getCartTotal()}}</strong>
            </div>
            
            <div class="delivery-info">
              <label>RDC Location:</label>
              <select [(ngModel)]="selectedRdc" required>
                <option value="">Select RDC</option>
                <option value="Colombo">Colombo RDC</option>
                <option value="Kandy">Kandy RDC</option>
                <option value="Galle">Galle RDC</option>
                <option value="Jaffna">Jaffna RDC</option>
              </select>
              
              <label>Delivery Address:</label>
              <textarea [(ngModel)]="deliveryAddress" placeholder="Enter delivery address" required></textarea>
            </div>

            <button class="place-order-btn" (click)="placeOrder()" 
                    [disabled]="!selectedRdc || !deliveryAddress">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .order-container { padding: 20px; }
    .order-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
    .search-bar { display: flex; gap: 10px; margin-bottom: 20px; }
    .search-bar input, .search-bar select { padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
    .product-card { border: 1px solid #ddd; border-radius: 8px; padding: 15px; }
    .product-card h3 { margin: 0 0 8px 0; }
    .category { color: #666; font-size: 12px; margin: 0; }
    .price { font-weight: bold; color: #2c3e50; margin: 8px 0; }
    .add-to-cart { display: flex; gap: 8px; align-items: center; }
    .add-to-cart input { width: 60px; padding: 4px; }
    .add-to-cart button { padding: 6px 12px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .cart-section { background: #f8f9fa; padding: 20px; border-radius: 8px; }
    .empty-cart { text-align: center; color: #666; padding: 40px; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #ddd; }
    .item-actions { display: flex; gap: 8px; align-items: center; }
    .item-actions input { width: 50px; padding: 4px; }
    .remove-btn { padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .cart-summary { margin-top: 20px; padding-top: 20px; border-top: 2px solid #ddd; }
    .total { font-size: 18px; margin-bottom: 15px; }
    .delivery-info label { display: block; margin: 10px 0 5px 0; font-weight: bold; }
    .delivery-info select, .delivery-info textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    .delivery-info textarea { height: 60px; resize: vertical; }
    .place-order-btn { width: 100%; padding: 12px; background: #27ae60; color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; margin-top: 15px; }
    .place-order-btn:disabled { background: #bdc3c7; cursor: not-allowed; }
  `]
})
export class OrderPlacementComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  cartItems: CartItem[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedRdc = '';
  deliveryAddress = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products.map(p => ({...p, orderQuantity: 1}));
        this.filteredProducts = [...this.products];
      },
      error: (error) => console.error('Error loading products:', error)
    });
  }

  loadCategories() {
    this.productService.getAllCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  searchProducts() {
    this.filterProducts();
  }

  filterByCategory() {
    this.filterProducts();
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = !this.selectedCategory || 
        product.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  addToCart(product: Product) {
    const existingItem = this.cartItems.find(item => item.product.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += product.orderQuantity || 1;
      existingItem.totalPrice = existingItem.quantity * existingItem.product.price;
    } else {
      this.cartItems.push({
        product: product,
        quantity: product.orderQuantity || 1,
        totalPrice: (product.orderQuantity || 1) * product.price
      });
    }
    
    product.orderQuantity = 1;
  }

  updateCartItem(item: CartItem) {
    item.totalPrice = item.quantity * item.product.price;
  }

  removeFromCart(item: CartItem) {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
    }
  }

  getCartTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }

  placeOrder() {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    
    const orderData: CreateOrderRequest = {
      customerId: userInfo.id,
      rdcLocation: this.selectedRdc,
      deliveryAddress: this.deliveryAddress,
      items: this.cartItems.map(item => ({
        productId: item.product.id || 0,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (order) => {
        Swal.fire('Success', 'Order placed successfully!', 'success');
        this.cartItems = [];
        this.selectedRdc = '';
        this.deliveryAddress = '';
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to place order', 'error');
        console.error('Order placement error:', error);
      }
    });
  }
}