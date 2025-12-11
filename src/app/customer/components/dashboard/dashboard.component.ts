import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../../services/customer.service';
import { SharedModule } from '../../../shared/shared.module';
import { UserStorageService } from '../../../services/stoarge/user-storage.service';
import { CartStorageService } from '../../../services/cart-storage.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  products: any[] = [];
  searchProductForm!: FormGroup;
  isLoggedIn: boolean = false;

  constructor(private customerService: CustomerService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cartStorageService: CartStorageService){}

  ngOnInit(){
    this.isLoggedIn = UserStorageService.isCustomerLoggedIn();
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    })
  }

  getAllProducts(){
    this.products = [];
    this.customerService.getAllProducts().subscribe(res =>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  submitForm(){
    this.products = [];
    const title = this.searchProductForm.get('title')!.value;
    this.customerService.getAllProductsByName(title).subscribe(res =>{
      res.forEach(element => {
        element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
        this.products.push(element);
      });
      console.log(this.products)
    })
  }

  addToCart(id:any){
    if(this.isLoggedIn) {
      // Add to backend cart for logged-in users
      this.customerService.addToCart(id).subscribe(res =>{
        this.snackBar.open("Product added to cart successfully", "Close", { duration: 5000 })
      })
    } else {
      // Add to localStorage cart for guest users
      const product = this.products.find(p => p.id === id);
      if(product) {
        this.cartStorageService.addToCart(product);
        this.snackBar.open("Product added to cart successfully", "Close", { duration: 5000 })
      }
    }
  }
}
