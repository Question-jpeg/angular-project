import { NgModule } from '@angular/core';
import { CartComponent, DeleteCartItemsDialog } from './components/cart/cart.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { ProductsComponent } from './components/products/products.component';
import { SharedModule } from 'shared/shared.module';

@NgModule({
  declarations: [
    CartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    ProductsComponent,
    DeleteCartItemsDialog,
  ],
  imports: [SharedModule],
})
export class ShoppingModule {}
