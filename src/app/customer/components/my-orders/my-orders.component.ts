import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.scss'
})
export class MyOrdersComponent {
  myOrders:any;

  constructor(private customerService: CustomerService){}

  ngOnInit(){
    this.getMyOrders();
  }

  getMyOrders(){
    this.customerService.getOrdersByUserId().subscribe(res =>{
      this.myOrders = res;
    })
  }

}
