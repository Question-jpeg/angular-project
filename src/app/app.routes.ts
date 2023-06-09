import { CartComponent } from './shopping/components/cart/cart.component';
import { HomeComponent } from './core/components/home/home.component';
import { ProductsComponent } from './shopping/components/products/products.component';
import { CheckOutComponent } from './shopping/components/check-out/check-out.component';
import { OrderSuccessComponent } from './shopping/components/order-success/order-success.component';
import { LoginComponent } from './core/components/login/login.component';
import { AdminProductsComponent } from './admin/components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/components/admin-orders/admin-orders.component';
import { OrdersComponent } from 'shared/components/orders/orders.component';
import { AuthGuardService } from 'shared/services/auth-guard.service';
import { AdminGuardService } from './admin/services/admin-guard.service';


interface Route {
  path: string;
  component: any;
  canActivate?: any[]
}

export const routes: Route[] = [
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AdminGuardService] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AdminGuardService] },
  { path: 'products', component: ProductsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuardService] },
  { path: 'order-success/:id', component: OrderSuccessComponent, canActivate: [AuthGuardService] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
];
