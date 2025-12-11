import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { SharedModule } from '../../../shared/shared.module';
import { UserStorageService } from '../../../services/stoarge/user-storage.service';
import { CartStorageService } from '../../../services/cart-storage.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  cartItems: any[] = [];
  order: any;
  isLoggedIn: boolean = false;

  couponForm!: FormGroup;

  constructor(private customerService: CustomerService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cartStorageService: CartStorageService,
    private router: Router){}

    ngOnInit(): void {
      this.couponForm = this.fb.group({
        code: [null, [Validators.required]]
      })
      this.isLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.getCart();
    }

    applyCoupon(){
      this.customerService.applyCoupon(this.couponForm.get(['code'])!.value).subscribe(res =>{
        this.snackbar.open("Coupon Applied Successfully", 'Close', {
          duration: 5000
        });
        this.getCart();
      }, error =>{
        this.snackbar.open(error.error, 'Close', {
          duration: 5000
        });
      })
    }


    getCart(){
      this.cartItems = [];
      
      if(this.isLoggedIn) {
        // Get cart from backend for logged-in users
        this.customerService.getCartByUserId().subscribe(res =>{
          this.order = res;
          res.cartItems.forEach(element => {
            element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
            this.cartItems.push(element);
          });
        })
      } else {
        // Get cart from localStorage for guest users
        const localCart = this.cartStorageService.getCart();
        localCart.forEach(item => {
          if(item.byteImg) {
            item.processedImg = 'data:image/jpeg;base64,' + item.byteImg;
          }
          this.cartItems.push(item);
        });
        
        // Calculate order details for guest users
        this.order = {
          totalAmount: this.cartStorageService.getTotalAmount(),
          amount: this.cartStorageService.getTotalAmount(),
          couponName: null
        };
      }
    }

    increaseQuantity(productId: any){
      if(this.isLoggedIn) {
        this.customerService.increaseProductQuantity(productId).subscribe(res =>{
          this.snackbar.open('Product quantity increased.', 'Close', { duration: 5000 });
          this.getCart();
        })
      } else {
        this.cartStorageService.increaseQuantity(productId);
        this.snackbar.open('Product quantity increased.', 'Close', { duration: 5000 });
        this.getCart();
      }
    }

    decreaseQuantity(productId: any, currentQuantity: number){
      if(this.isLoggedIn) {
        if(currentQuantity === 1) {
          this.customerService.removeItemFromCart(productId).subscribe(res =>{
            this.snackbar.open('Product removed from cart.', 'Close', { duration: 5000 });
            this.getCart();
          })
        } else {
          this.customerService.decreaseProductQuantity(productId).subscribe(res =>{
            this.snackbar.open('Product quantity decreased.', 'Close', { duration: 5000 });
            this.getCart();
          })
        }
      } else {
        if(currentQuantity === 1) {
          this.cartStorageService.removeItem(productId);
          this.snackbar.open('Product removed from cart.', 'Close', { duration: 5000 });
        } else {
          this.cartStorageService.decreaseQuantity(productId);
          this.snackbar.open('Product quantity decreased.', 'Close', { duration: 5000 });
        }
        this.getCart();
      }
    }

    placeOrder(){
      if(!this.isLoggedIn) {
        this.snackbar.open('Please login to place an order', 'Close', { duration: 5000 });
        this.router.navigateByUrl('/login');
        return;
      }
      this.dialog.open(PlaceOrderComponent);
    }

}
