import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../services/stoarge/user-storage.service';
import { CartStorageService } from '../../services/stoarge/cart-storage.service';
import { environment } from '../../../environments/environment';

const BASIC_URL = environment.BASIC_URL;


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  
  constructor(private http: HttpClient, private cartStorage: CartStorageService) { }

  getAllProducts(): Observable<any>{
    return this.http.get(BASIC_URL + 'api/guest/products', {
      headers: this.createAuthorizationHeader(),
    }
  )
  }


  getAllProductsByName(name:any): Observable<any>{
    return this.http.get(BASIC_URL + `api/guest/search/${name}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

  addToCart(productId:any): Observable<any>{
    const cartDto = {
      productId : productId,
      userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/cart`, cartDto , {
      headers: this.createAuthorizationHeader(),
    })
  }

  increaseProductQuantity(productId:any): Observable<any>{
    const cartDto = {
      productId : productId,
      userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/addition`, cartDto , {
      headers: this.createAuthorizationHeader(),
    })
  }

  decreaseProductQuantity(productId:any): Observable<any>{
    const cartDto = {
      productId : productId,
      userId: UserStorageService.getUserId()
    }
    return this.http.post(BASIC_URL + `api/customer/deduction`, cartDto , {
      headers: this.createAuthorizationHeader(),
    })
  }
  
  getCartByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `api/customer/cart/${userId}` , {
      headers: this.createAuthorizationHeader(),
    })
  }


  applyCoupon(code:any): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `api/customer/coupon/${userId}/${code}` , {
      headers: this.createAuthorizationHeader(),
    })
  }

  placeOrder(orderDto:any): Observable<any>{
    orderDto.userId = UserStorageService.getUserId()
    return this.http.post(BASIC_URL + `api/customer/placeOrder`, orderDto , {
      headers: this.createAuthorizationHeader(),
    })
  }

  getOrdersByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId()
    return this.http.get(BASIC_URL + `api/customer/myOrders/${userId}` , {
      headers: this.createAuthorizationHeader(),
    })
  }

  getOrderedProducts(orderId:number): Observable<any>{
    return this.http.get(BASIC_URL + `api/customer/ordered-products/${orderId}` , {
      headers: this.createAuthorizationHeader(),
    })
  }

  giveReview(reviewDto:any): Observable<any>{
    return this.http.post(BASIC_URL + `api/customer/review`, reviewDto , {
      headers: this.createAuthorizationHeader(),
    })
  }

  getProductDetailById(productId: any) : Observable<any>{
    console.log("Service Product ID: " + productId);
    return this.http.get(BASIC_URL + `api/guest/product/${productId}` , {
      headers: this.createAuthorizationHeader(),
    })
  }

  addProductToWishlist(wishlistDto:any): Observable<any>{
    return this.http.post(BASIC_URL + `api/customer/wishlist`, wishlistDto , {
      headers: this.createAuthorizationHeader(),
    })
  }

  getWishlistByUserId(): Observable<any>{
    const userId = UserStorageService.getUserId();
    return this.http.get(BASIC_URL + `api/customer/wishlist/${userId}` , {
      headers: this.createAuthorizationHeader(),
    })
  }

  private createAuthorizationHeader(): HttpHeaders{
    return new HttpHeaders().set(
      'Authorization', 'Bearer ' + UserStorageService.getToken()
    )
  }

  // ===== GUEST CART COOKIE METHODS =====
  
  /**
   * Add product to guest cart (stored in cookies)
   */
  addToGuestCart(product: any): void {
    this.cartStorage.addToCart({
      productId: product.id,
      quantity: 1,
      price: product.price,
      productName: product.title || product.productName || ''
    });
  }

  /**
   * Get guest cart from cookies
   */
  getGuestCart(): Observable<any> {
    return this.cartStorage.cart$;
  }

  /**
   * Increase guest cart item quantity
   */
  increaseGuestCartQuantity(productId: number): void {
    const cart = this.cartStorage.getCart();
    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      this.cartStorage.updateQuantity(productId, item.quantity + 1);
    }
  }

  /**
   * Decrease guest cart item quantity
   */
  decreaseGuestCartQuantity(productId: number): void {
    const cart = this.cartStorage.getCart();
    const item = cart.items.find(i => i.productId === productId);
    if (item && item.quantity > 1) {
      this.cartStorage.updateQuantity(productId, item.quantity - 1);
    } else {
      this.removeFromGuestCart(productId);
    }
  }

  /**
   * Remove product from guest cart
   */
  removeFromGuestCart(productId: number): void {
    this.cartStorage.removeFromCart(productId);
  }

  /**
   * Clear entire guest cart
   */
  clearGuestCart(): void {
    this.cartStorage.clearCart();
  }

  /**
   * Get guest cart item count
   */
  getGuestCartItemCount(): number {
    return this.cartStorage.getItemCount();
  }

  /**
   * Get guest cart total
   */
  getGuestCartTotal(): number {
    return this.cartStorage.getCartTotal();
  }
}
