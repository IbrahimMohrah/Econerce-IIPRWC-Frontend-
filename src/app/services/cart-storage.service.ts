import { Injectable } from '@angular/core';

const CART_KEY = 'ecom-guest-cart';

export interface CartItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  processedImg?: string;
  byteImg?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartStorageService {

  constructor() { }

  // Get cart from localStorage
  getCart(): CartItem[] {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  // Save cart to localStorage
  saveCart(cart: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  // Add item to cart
  addToCart(product: any): void {
    const cart = this.getCart();
    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        byteImg: product.byteImg
      });
    }

    this.saveCart(cart);
  }

  // Increase quantity
  increaseQuantity(productId: number): void {
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    
    if (item) {
      item.quantity++;
      this.saveCart(cart);
    }
  }

  // Decrease quantity
  decreaseQuantity(productId: number): void {
    const cart = this.getCart();
    const item = cart.find(i => i.productId === productId);
    
    if (item && item.quantity > 1) {
      item.quantity--;
      this.saveCart(cart);
    }
  }

  // Remove item from cart
  removeItem(productId: number): void {
    let cart = this.getCart();
    cart = cart.filter(item => item.productId !== productId);
    this.saveCart(cart);
  }

  // Clear cart
  clearCart(): void {
    localStorage.removeItem(CART_KEY);
  }

  // Get total amount
  getTotalAmount(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Get cart item count
  getCartItemCount(): number {
    const cart = this.getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}
