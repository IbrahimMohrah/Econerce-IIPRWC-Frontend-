import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, provideRouter } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { CouponsComponent } from './components/coupons/coupons.component';
import { OrdersComponent } from './components/orders/orders.component';
import { PostCategoryComponent } from './components/post-category/post-category.component';
import { PostCouponComponent } from './components/post-coupon/post-coupon.component';
import { PostProductFaqComponent } from './components/post-product-faq/post-product-faq.component';
import { PostProductComponent } from './components/post-product/post-product.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';

export const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent },
  { path: 'category', component: PostCategoryComponent },
  { path: 'product', component: PostProductComponent },
  { path: 'product/:productId', component: UpdateProductComponent },
  { path: 'post-coupon', component: PostCouponComponent },
  { path: 'coupons', component: CouponsComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'faq/:productId', component: PostProductFaqComponent },
  { path: 'analytics', component: AnalyticsComponent },
  
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers:[provideRouter(routes)]
})
export class AdminModule { }
