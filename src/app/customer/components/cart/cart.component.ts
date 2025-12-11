import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { CartStorageService } from '../../../services/stoarge/cart-storage.service';
import { PlaceOrderComponent } from '../place-order/place-order.component';
import { SharedModule } from '../../../shared/shared.module';
import { UserStorageService } from '../../../services/stoarge/user-storage.service';
import { forkJoin } from 'rxjs';

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
  isGuest: boolean = false;

  couponForm!: FormGroup;

  constructor(private customerService: CustomerService,
    private cartStorage: CartStorageService,
    private snackbar: MatSnackBar,
    private fb: FormBuilder,
    public dialog: MatDialog,){}

    ngOnInit(): void {
      this.couponForm = this.fb.group({
        code: [null, [Validators.required]]
      })
      const userId = UserStorageService.getUserId();
      this.isGuest = userId == null || userId === '';
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
      
      // If guest, use cookie-based cart storage
      if (this.isGuest) {
        // Initial load from cookie (BehaviorSubject current value)
        this.updateGuestCartView(this.cartStorage.getCart());
        // Keep in sync with subsequent changes
        this.cartStorage.cart$.subscribe(cart => this.updateGuestCartView(cart));
        return;
      }

      // If user is logged in, fetch from server
      // if (UserStorageService.getUserId() == null){
      //   const guestId = UserStorageService.getGuestId();
      //   this.customerService.getCartAsGuest(guestId).subscribe(res =>{
      //     this.order = res;
      //     res.cartItems.forEach((element: any) => {
      //       element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
      //       this.cartItems.push(element);
      //     });
      //   }
      //   )
      //   return;
      // }

      // getGuestId generate id for guest user
      
      this.customerService.getCartByUserId().subscribe(res =>{
        this.order = res;
        res.cartItems.forEach(element => {
          element.processedImg = 'data:image/jpeg;base64,' + element.returnedImg;
          this.cartItems.push(element);
        });
      })
    }

    increaseQuantity(productId: any){
      if (this.isGuest) {
        this.customerService.increaseGuestCartQuantity(productId);
        this.snackbar.open('Product quantity increased.', 'Close', { duration: 5000 });
        return;
      }

      this.customerService.increaseProductQuantity(productId).subscribe(res =>{
        this.snackbar.open('Product quantity increased.', 'Close', { duration: 5000 });
        this.getCart();
      })
    }

    decreaseQuantity(productId: any){
      if (this.isGuest) {
        this.customerService.decreaseGuestCartQuantity(productId);
        this.snackbar.open('Product quantity decreased.', 'Close', { duration: 5000 });
        return;
      }

      this.customerService.decreaseProductQuantity(productId).subscribe(res =>{
        this.snackbar.open('Product quantity decreased.', 'Close', { duration: 5000 });
        this.getCart();
      })
    }

    private updateGuestCartView(cart: any): void {
      // Empty cart
      if (!cart?.items?.length) {
        this.cartItems = [];
        this.order = {
          cartItems: [],
          totalAmount: 0,
          amount: 0,
          discount: 0,
          couponName: null
        };
        return;
      }

      // Fetch product details for each item so we can show images/names from DB
      const productRequests = cart.items.map(item =>
        this.customerService.getProductDetailById(item.productId)
      );

      forkJoin(productRequests).subscribe(products => {
        this.cartItems = cart.items.map((item, idx) => {
          const product = products[idx];
          const name = product?.title || product?.productName || item.productName || '';
          const price = product?.price ?? item.price;
          const imgBase = product?.returnedImg || product?.byteImg || null;

          return {
            productId: item.productId,
            productName: name,
            quantity: item.quantity,
            price,
            title: name,
            returnedImg: imgBase,
            processedImg: imgBase ? `data:image/jpeg;base64,${imgBase}` : null
          };
        });

        const total = this.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        this.order = {
          cartItems: this.cartItems,
          totalAmount: total,
          amount: total,
          discount: 0,
          couponName: null
        };
      }, _err => {
        // Fallback: use cookie data if API fails
        this.cartItems = cart.items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          title: item.productName,
          returnedImg: null,
          processedImg: null
        }));
        const total = this.cartItems.reduce((sum, i) => sum + (i.price * i.quantity), 0);
        this.order = {
          cartItems: this.cartItems,
          totalAmount: total,
          amount: total,
          discount: 0,
          couponName: null
        };
      });
    }

    placeOrder(){
      this.dialog.open(PlaceOrderComponent);
    }

}
