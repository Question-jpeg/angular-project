import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from 'shared/components/product-card/product-card.component';
import { OrdersComponent } from 'shared/components/orders/orders.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatModule } from './mat.module';

@NgModule({
  declarations: [ProductCardComponent, OrdersComponent],
  imports: [CommonModule, MatModule, RouterModule, ReactiveFormsModule],
  exports: [
    ProductCardComponent,
    OrdersComponent,
    CommonModule,
    MatModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
