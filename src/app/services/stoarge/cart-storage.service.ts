import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  productId: number;
  quantity: number;
  price: number;
  productName: string;
  processedImg?: string;
}

export interface GuestCart {
  items: CartItem[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartStorageService {
  private readonly CART_COOKIE_KEY = 'guest_cart';
  private readonly CART_EXPIRY_DAYS = 30;
  private cartSubject = new BehaviorSubject<GuestCart>({ items: [], total: 0 });
  
  public cart$ = this.cartSubject.asObservable();

  constructor(private cookieService: CookieService) {
    this.loadCartFromCookie();
  }

  /**
   * Load guest cart from cookie
   */
  private loadCartFromCookie(): void {
    const cartData = this.cookieService.get(this.CART_COOKIE_KEY);
    if (cartData) {
      try {
        const cart: GuestCart = JSON.parse(decodeURIComponent(cartData));
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Error loading cart from cookie:', error);
        this.clearCart();
      }
    }
  }

  /**
   * Save guest cart to cookie
   */
  private saveCartToCookie(cart: GuestCart): void {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + this.CART_EXPIRY_DAYS);
    this.cookieService.set(
      this.CART_COOKIE_KEY,
      encodeURIComponent(JSON.stringify(cart)),
      expiryDate,
      '/'
    );
  }

  /**
   * Get current guest cart
   */
  getCart(): GuestCart {
    return this.cartSubject.value;
  }

  /**
   * Add item to guest cart
   */
  addToCart(item: CartItem): void {
    // Avoid storing large payloads (e.g., base64 images) in cookies
    const sanitized: CartItem = { ...item };
    delete (sanitized as any).processedImg;

    const cart = this.getCart();
    const existingItem = cart.items.find(i => i.productId === sanitized.productId);

    if (existingItem) {
      existingItem.quantity += sanitized.quantity;
    } else {
      cart.items.push(sanitized);
    }

    this.updateCartTotal(cart);
    this.cartSubject.next(cart);
    this.saveCartToCookie(cart);
  }

  /**
   * Remove item from guest cart
   */
  removeFromCart(productId: number): void {
    const cart = this.getCart();
    cart.items = cart.items.filter(i => i.productId !== productId);
    
    this.updateCartTotal(cart);
    this.cartSubject.next(cart);
    this.saveCartToCookie(cart);
  }

  /**
   * Update item quantity in guest cart
   */
  updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart();
    const item = cart.items.find(i => i.productId === productId);

    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.updateCartTotal(cart);
        this.cartSubject.next(cart);
        this.saveCartToCookie(cart);
      }
    }
  }

  /**
   * Get cart item count
   */
  getItemCount(): number {
    return this.getCart().items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Get cart total price
   */
  getCartTotal(): number {
    return this.getCart().total;
  }

  /**
   * Clear entire guest cart
   */
  clearCart(): void {
    this.cartSubject.next({ items: [], total: 0 });
    this.cookieService.delete(this.CART_COOKIE_KEY, '/');
  }

  /**
   * Recalculate cart total
   */
  private updateCartTotal(cart: GuestCart): void {
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }
}
