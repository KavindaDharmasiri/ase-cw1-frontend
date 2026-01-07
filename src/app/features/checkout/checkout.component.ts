import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../models/cart.model';
import { PaymentService, PaymentRequest } from '../../core/services/payment.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [OrderService, PaymentService],
  template: `
    <div class="checkout-container fade-in">
      <h1>Checkout</h1>
      
      <div class="checkout-content">
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="order-items">
            <div class="order-item" *ngFor="let item of cartItems">
              <span>{{item.name}} x {{item.quantity}}</span>
              <span>Rs. {{(item.price * item.quantity) | number:'1.2-2'}}</span>
            </div>
          </div>
          <div class="order-total">
            <strong>Total: Rs. {{getTotal() | number:'1.2-2'}}</strong>
          </div>
          <div class="estimated-delivery">
            <p><strong>Estimated Delivery:</strong> {{getEstimatedDeliveryDate()}}</p>
          </div>
        </div>

        <div class="payment-section">
          <h2>Payment Method</h2>
          <div class="payment-methods">
            <label class="payment-option">
              <input type="radio" [(ngModel)]="paymentMethod" value="ONLINE" name="payment">
              <span>Online Payment</span>
            </label>
            <label class="payment-option">
              <input type="radio" [(ngModel)]="paymentMethod" value="CASH_ON_DELIVERY" name="payment">
              <span>Cash on Delivery</span>
            </label>
          </div>

          <div class="card-details" *ngIf="paymentMethod === 'ONLINE'">
            <h3>Card Details</h3>
            <div class="form-group">
              <label>Cardholder Name</label>
              <input type="text" [(ngModel)]="cardDetails.cardholderName" placeholder="John Doe">
            </div>
            <div class="form-group">
              <label>Card Number</label>
              <input type="text" [(ngModel)]="cardDetails.cardNumber" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Expiry Date</label>
                <input type="text" [(ngModel)]="cardDetails.expiryDate" placeholder="MM/YY" maxlength="5">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="text" [(ngModel)]="cardDetails.cvv" placeholder="123" maxlength="3">
              </div>
            </div>
          </div>

          <div class="checkout-actions">
            <button class="back-btn" (click)="goBack()">Back to Cart</button>
            <button class="place-order-btn" (click)="placeOrder()" [disabled]="isProcessing">
              {{isProcessing ? 'Processing...' : 'Place Order'}}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checkout-container { padding: 40px; max-width: 1000px; margin: 0 auto; }
    .checkout-content { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 32px; }
    .order-summary, .payment-section { background: white; padding: 24px; border-radius: var(--border-radius-lg); box-shadow: var(--shadow-sm); }
    .order-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--gray-200); }
    .order-total { margin-top: 16px; padding-top: 16px; border-top: 2px solid var(--gray-300); font-size: 18px; }
    .estimated-delivery { margin-top: 12px; padding: 12px; background: #f8f9fa; border-radius: 6px; }
    .estimated-delivery p { margin: 0; color: #28a745; font-weight: 500; }
    .payment-methods { margin: 16px 0; }
    .payment-option { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; cursor: pointer; }
    .card-details { margin-top: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 4px; font-weight: 600; }
    .form-group input { width: 100%; padding: 12px; border: 1px solid var(--gray-300); border-radius: var(--border-radius-md); }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .checkout-actions { display: flex; gap: 16px; margin-top: 32px; }
    .back-btn { flex: 1; padding: 12px; border: 1px solid var(--gray-300); background: white; border-radius: var(--border-radius-md); cursor: pointer; }
    .place-order-btn { flex: 2; padding: 12px; background: linear-gradient(135deg, var(--primary-blue), var(--secondary-green)); color: white; border: none; border-radius: var(--border-radius-md); cursor: pointer; font-weight: 600; }
    .place-order-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: CartItem[] = [];
  paymentMethod: 'ONLINE' | 'CASH_ON_DELIVERY' = 'CASH_ON_DELIVERY';
  isProcessing = false;
  
  cardDetails = {
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      if (items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });
  }

  getTotal(): number {
    return this.cartService.getCartTotal();
  }

  getEstimatedDeliveryDate(): string {
    const deliveryDays = this.getDeliveryDaysForLocation();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private getDeliveryDaysForLocation(): number {
    const baseDays = this.getLocationBaseDays();
    const inventoryDelay = this.getInventoryProcessingDays();
    return baseDays + inventoryDelay;
  }

  private getLocationBaseDays(): number {
    const address = this.getDeliveryAddress().toLowerCase();
    
    if (address.includes('colombo') || address.includes('gampaha') || address.includes('kalutara')) {
      return 2; // Western Province - 2 days
    } else if (address.includes('kandy') || address.includes('matale') || address.includes('nuwara eliya')) {
      return 3; // Central Province - 3 days
    } else if (address.includes('galle') || address.includes('matara') || address.includes('hambantota')) {
      return 4; // Southern Province - 4 days
    } else if (address.includes('jaffna') || address.includes('vavuniya') || address.includes('mannar')) {
      return 7; // Northern Province - 7 days
    } else {
      return 5; // Default - 5 days
    }
  }

  private getInventoryProcessingDays(): number {
    let maxProcessingDays = 0;
    
    for (const item of this.cartItems) {
      // Check stock levels and add processing time
      if (item.maxStock < 10) {
        maxProcessingDays = Math.max(maxProcessingDays, 3); // Low stock - 3 extra days
      } else if (item.maxStock < 50) {
        maxProcessingDays = Math.max(maxProcessingDays, 1); // Medium stock - 1 extra day
      }
      // High stock (50+) - no extra processing time
    }
    
    return maxProcessingDays;
  }

  private getDeliveryAddress(): string {
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    return userInfo.address || 'colombo'; // Default to Colombo
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  placeOrder() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    const selectedAddress = this.getSelectedDeliveryAddress();
    
    const userId = userInfo.id;
    if (!userId) {
      alert('User not logged in. Please login first.');
      this.router.navigate(['/login']);
      this.isProcessing = false;
      return;
    }
    
    // Create order first
    const orderData = {
      customerId: userId,
      rdcLocation: 'Colombo RDC',
      deliveryAddress: selectedAddress,
      totalAmount: this.getTotal(),
      estimatedDeliveryDays: this.getDeliveryDaysForLocation(),
      customerPhone: userInfo.phone || '+94 77 123 4567',
      storeName: userInfo.fullName || 'Store Name',
      items: this.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (response: any) => {
        console.log('Order created:', response);
        
        Swal.fire({
          title: 'Order Placed Successfully!',
          text: response.message,
          icon: 'success',
          confirmButtonText: 'Continue'
        }).then(() => {
          // Clear cart and navigate
          this.cartService.clearCart().subscribe();
          this.router.navigate(['/orders'], { queryParams: { success: true } });
        });
        
        this.isProcessing = false;
      },
      error: (error) => {
        this.isProcessing = false;
        const errorMessage = error.error?.message || 'Failed to place order. Please try again.';
        Swal.fire({
          title: 'Order Failed',
          text: errorMessage,
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      }
    });
  }

  private getSelectedDeliveryAddress(): string {
    // Get address selection from cart (if available) or use user's address
    const cartSelection = localStorage.getItem('selected_delivery_address');
    if (cartSelection) {
      return cartSelection;
    }
    
    const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
    return userInfo.address || '123 Main St, Colombo';
  }
}