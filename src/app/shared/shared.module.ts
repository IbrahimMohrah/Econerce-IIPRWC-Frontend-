import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoAngularMaterailModule } from '../DemoAngularMaterialModule';
import { RouterLink, RouterOutlet } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DemoAngularMaterailModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet
  ],
  exports:[
    CommonModule,
    DemoAngularMaterailModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink,
    RouterOutlet
  ]
})
export class SharedModule { }
