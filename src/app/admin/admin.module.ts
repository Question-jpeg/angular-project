import { NgModule } from '@angular/core';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { CategoryDetailsComponent, ConfirmDeleteCategoryDialog } from './components/category-details/category-details.component';
import { ConfirmDeleteProductDialog, ProductDetailsComponent } from './components/product-details/product-details.component';
import { SharedModule } from 'shared/shared.module';

@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminOrdersComponent,
    CategoryDetailsComponent,
    ProductDetailsComponent,
    ConfirmDeleteProductDialog,
    ConfirmDeleteCategoryDialog,
  ],
  imports: [SharedModule],
})

export class AdminModule {}
