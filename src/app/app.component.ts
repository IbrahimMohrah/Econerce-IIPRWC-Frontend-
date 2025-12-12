import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DemoAngularMaterailModule } from './DemoAngularMaterialModule';
import { UserStorageService } from './services/stoarge/user-storage.service';
import { CartStorageService } from './services/cart-storage.service';
import { CustomerService } from './customer/services/customer.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet, RouterLink,
    DemoAngularMaterailModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
   title = 'ecomweb';
  isCustomerLoggedIn : boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn : boolean = UserStorageService.isAdminLoggedIn();
  cartItemCount: number = 0;

  constructor(private router: Router, 
    private cartStorageService: CartStorageService,
    private customerService: CustomerService) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
      this.updateCartCount();
    })
    this.updateCartCount();
  }

  updateCartCount(): void {
    if (this.isCustomerLoggedIn) {
      // Get count from backend for logged-in users
      this.customerService.getCartByUserId().subscribe(res => {
        this.cartItemCount = res.cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
      }, error => {
        this.cartItemCount = 0;
      });
    } else {
      // Get count from localStorage for guest users
      this.cartItemCount = this.cartStorageService.getCartItemCount();
    }
  }

  logout() {
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }
}

