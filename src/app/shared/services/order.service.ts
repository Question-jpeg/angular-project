import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Firestore } from '@angular/fire/firestore';
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  where,
  query,
} from 'firebase/firestore';
import { Order } from 'shared/models/order';
import { IAppState } from '../../store/states';
import { orderActions } from '../../store/order/order';
import { AuthService } from './auth.service';
import { CartService } from './cart.service';
import { cartActions } from 'app/store/cart/cart';
import { IUser } from 'shared/models/auth';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  user$;

  constructor(
    private db: Firestore,
    private ngStore: Store<IAppState>,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.user$ = authService.firebaseUser$;
  }

  async createOrder(order: Order) {
    this.ngStore.dispatch(cartActions.fetchProducts({ products: [] }));
    this.cartService.deleteAll();

    const userId = this.authService.firebaseUser?.id;

    const currentDate = new Date();

    const id = (
      await addDoc(collection(this.db, 'orders'), {
        ...order,
        userId,
        date: currentDate,
      })
    ).id;

    const completeOrder = { ...order, id, userId, date: currentDate };
    this.ngStore.dispatch(orderActions.addOrder({ order: completeOrder }));

    return id;
  }

  refreshAllOrders() {
    console.log('admin mode orders called');
    
    const sub = this.user$.subscribe(async (user) => {
      if (user?.isAdmin) {
        const docs = (await getDocs(collection(this.db, 'orders'))).docs.map(
          (d) => d.data()
        );
        this.ngStore.dispatch(orderActions.fetchOrders({orders: docs as Order[]}))
      }
      sub.unsubscribe();
    });
  }

  refreshOrders() {
    console.log('user mode orders called');
    
    const sub = this.user$.subscribe(async (user) => {
      const userId = user?.id;
      const docs = (
        await getDocs(
          query(collection(this.db, 'orders'), where('userId', '==', userId))
        )
      ).docs.map((d) => d.data());

      this.ngStore.dispatch(
        orderActions.fetchOrders({ orders: docs as Order[] })
      );
      sub.unsubscribe();
    });
  }
}
