import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../models/cart.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cart-container fade-in">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
        <p *ngIf="cartItems.length === 0">Your cart is empty</p>
      </div>

      <div class="cart-content" *ngIf="cartItems.length > 0">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartItems">
            <img [src]="item.imageUrl || '/assets/product-placeholder.png'" [alt]="item.name" class="item-image">
            <div class="item-details">
              <h3>{{item.name}}</h3>
              <p class="item-price">Rs. {{item.price | number:'1.2-2'}}</p>
            </div>
            <div class="quantity-controls">
              <button (click)="decreaseQuantity(item)" class="qty-btn">-</button>
              <span>{{item.quantity}}</span>
              <button (click)="increaseQuantity(item)" [disabled]="item.quantity >= item.maxStock" class="qty-btn">+</button>
            </div>
            <div class="item-total">
              Rs. {{(item.price * item.quantity) | number:'1.2-2'}}
            </div>
            <button class="remove-btn" (click)="removeItem(item.id)">×</button>
          </div>
        </div>

        <div class="cart-summary">
          <div class="delivery-address">
            <h3>Delivery Address</h3>
            <div class="address-options">
              <label class="address-option">
                <input type="radio" [(ngModel)]="useUserAddress" [value]="true" name="addressType">
                <span>Use my registered address</span>
              </label>
              <div class="user-address" *ngIf="useUserAddress">
                <p>{{userAddress}}</p>
              </div>
              
              <label class="address-option">
                <input type="radio" [(ngModel)]="useUserAddress" [value]="false" name="addressType">
                <span>Use different address</span>
              </label>
              <div class="custom-address" *ngIf="!useUserAddress">
                <textarea [(ngModel)]="customAddress" placeholder="Enter delivery address" rows="3"></textarea>
              </div>
            </div>
          </div>
          
          <div class="summary-row">
            <span>Subtotal ({{getTotalItems()}} items):</span>
            <span>Rs. {{getTotal() | number:'1.2-2'}}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>Rs. {{getTotal() | number:'1.2-2'}}</span>
          </div>
          <div class="cart-actions">
            <button class="continue-shopping" routerLink="/product-catalog">Continue Shopping</button>
            <button class="checkout-btn" (click)="proceedToCheckout()">Proceed to Checkout</button>
          </div>
        </div>
      </div>

      <div class="empty-cart" *ngIf="cartItems.length === 0">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started</p>
        <button class="browse-btn" routerLink="/product-catalog">Browse Products</button>
      </div>
    </div>
  `,
  styles: [`
    .cart-container { padding: 40px; max-width: 1200px; margin: 0 auto; }
    .cart-header h1 { margin: 0 0 8px 0; color: var(--gray-800); }
    .cart-content { display: grid; grid-template-columns: 2fr 1fr; gap: 40px; margin-top: 32px; }
    .cart-item { display: grid; grid-template-columns: 80px 1fr auto auto auto; gap: 16px; align-items: center; padding: 20px; background: white; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); margin-bottom: 16px; }
    .item-image { width: 80px; height: 80px; object-fit: cover; border-radius: var(--border-radius-md); }
    .item-details h3 { margin: 0 0 4px 0; font-size: 16px; color: var(--gray-800); }
    .item-price { margin: 0; color: var(--primary-blue); font-weight: 600; }
    .quantity-controls { display: flex; align-items: center; gap: 12px; }
    .quantity-controls button { width: 32px; height: 32px; border: 1px solid var(--gray-300); background: white; border-radius: 4px; cursor: pointer; }
    .remove-btn { width: 32px; height: 32px; border: none; background: var(--red-50); color: var(--red-600); border-radius: 4px; cursor: pointer; }
    .cart-summary { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); height: fit-content; }
    .delivery-address { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid var(--gray-200); }
    .delivery-address h3 { margin: 0 0 12px 0; }
    .address-option { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; cursor: pointer; }
    .user-address, .custom-address { margin: 8px 0 16px 24px; }
    .user-address p { margin: 0; color: var(--gray-600); font-size: 14px; }
    .custom-address textarea { width: 100%; padding: 8px; border: 1px solid var(--gray-300); border-radius: 4px; resize: vertical; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .summary-row.total { border-top: 1px solid var(--gray-200); padding-top: 12px; font-weight: 600; font-size: 18px; }
    .cart-actions { margin-top: 24px; display: flex; flex-direction: column; gap: 12px; }
    .continue-shopping { padding: 12px 24px; border: 1px solid var(--gray-300); background: white; color: var(--gray-700); border-radius: var(--border-radius-md); cursor: pointer; text-decoration: none; text-align: center; }
    .checkout-btn { padding: 12px 24px; background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green)); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-weight: 600; }
    .empty-cart { text-align: center; padding: 80px 40px; }
    .browse-btn { margin-top: 24px; padding: 12px 32px; background: var(--primary-blue); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; }
  `]
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  useUserAddress = true;
  userAddress = '';
  customAddress = '';

  constructor(private cartService: CartService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    console.log('Cart component initialized');
    console.log('User authenticated:', this.cartService['authService'].isAuthenticated());
    this.loadUserAddress();
    this.cartService.refreshCart();
    this.cartService.getCartItems().subscribe(items => {
      console.log('Cart items received:', items);
      this.cartItems = items;
      this.cdr.detectChanges();
    });
  }

  private loadUserAddress() {
    this.cartService['http'].get(`${this.cartService['apiUrl']}/user-address`, { responseType: 'text' }).subscribe({
      next: (address: string) => {
        this.userAddress = address;
      },
      error: () => {
        this.userAddress = 'No address on file';
      }
    });
  }

  updateQuantity(productId: number, quantity: number) {
    // Update UI immediately
    const item = this.cartItems.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
    
    this.cartService.updateQuantity(productId, quantity).subscribe({
      next: () => console.log('Quantity updated'),
      error: (error) => {
        console.error('Error updating quantity:', error);
        // Revert UI change on error
        this.cartService.refreshCart();
      }
    });
  }

  increaseQuantity(item: CartItem) {
    if (item.quantity < item.maxStock) {
      this.updateQuantity(item.id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity === 1) {
      Swal.fire({
        title: 'Remove Item?',
        text: 'Do you want to remove this item from cart?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.removeItem(item.id);
        }
      });
    } else {
      this.updateQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(productId: number) {
    // Update UI immediately
    this.cartItems = this.cartItems.filter(item => item.id !== productId);
    
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        console.log('Item removed');
        // Refresh cart to ensure sync with backend
        this.cartService.refreshCart();
      },
      error: (error) => {
        console.error('Error removing item:', error);
        // Revert UI change on error
        this.cartService.refreshCart();
      }
    });
  }

  getTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getTotalItems(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  proceedToCheckout() {
    // Save selected delivery address
    const selectedAddress = this.useUserAddress ? this.userAddress : this.customAddress;
    localStorage.setItem('selected_delivery_address', selectedAddress);
    
    this.router.navigate(['/checkout']);
  }
}