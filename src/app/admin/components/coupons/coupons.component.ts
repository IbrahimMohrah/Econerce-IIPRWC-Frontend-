import { Component } from '@angular/core';
import { AdminService } from '../../service/admin.service';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent {
  coupons: any;

  constructor(private adminService: AdminService) { }

  ngOnInit(){
    this.getCoupons();
  }

  getCoupons(){
    this.adminService.getCoupons().subscribe(res =>{
      this.coupons = res;
    })
  }

}
