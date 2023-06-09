import { AuthenticationState } from './authentication/states';
import { ProductState } from './products/states';
import { CategoryState } from './categories/states';
import { CartState } from './cart/states';
import { OrderState } from './order/states';
import { authReducer } from './authentication/authentication';
import { productsReducer } from './products/products';
import { categoriesReducer } from './categories/categories';
import { cartReducer } from './cart/cart';
import { orderReducer } from './order/order';

export interface IAppState {
  authentication: AuthenticationState,
  products: ProductState,
  categories: CategoryState,
  cartProducts: CartState,
  orders: OrderState
}

export const reducersMapping = {
  authentication: authReducer,
  products: productsReducer,
  categories: categoriesReducer,
  cartProducts: cartReducer,
  orders: orderReducer
}
