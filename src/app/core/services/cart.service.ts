import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { CartItem, CartResponse, AddToCartRequest } from '../../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) {
    this.loadCart();
  }

  private get apiUrl(): string {
    return `${environment.apiUrl}/cart`;
  }

  getCartItems(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  addToCart(product: any, quantity: number = 1): Observable<any> {
    const request: AddToCartRequest = {
      productId: product.id,
      quantity: quantity
    };

    return this.http.post(`${this.apiUrl}/add`, request).pipe(
      tap(() => this.loadCartFromServer())
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${productId}`, { quantity }).pipe(
      tap(() => this.loadCartFromServer())
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/remove/${productId}`).pipe(
      tap(() => this.loadCartFromServer())
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => this.cartItems.next([]))
    );
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getCartItemCount(): Observable<number> {
    return this.cartItems.asObservable().pipe(
      map(items => items.reduce((count, item) => count + item.quantity, 0))
    );
  }

  private loadCart(): void {
    if (this.authService.isAuthenticated()) {
      this.loadCartFromServer();
    }
  }

  private loadCartFromServer(): void {
    console.log('Loading cart from server...');
    this.http.get<CartResponse[]>(this.apiUrl).subscribe({
      next: (cartItems) => {
        console.log('Cart loaded from server:', cartItems);
        const items: CartItem[] = cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          maxStock: item.product.unit
        }));
        this.cartItems.next(items);
      },
      error: (error) => {
        console.error('Error loading cart from server:', error);
        this.cartItems.next([]);
      }
    });
  }

  refreshCart(): void {
    if (this.authService.isAuthenticated()) {
      this.loadCartFromServer();
    }
  }
}