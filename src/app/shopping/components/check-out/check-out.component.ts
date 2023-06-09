import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { CartProduct } from 'shared/models/products';
import { IAppState } from 'app/store/states';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Order } from 'shared/models/order';
import { OrderService } from 'shared/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css'],
})
export class CheckOutComponent implements OnDestroy {
  cartItems$;
  cartItems: CartProduct[] = [];
  subscriptions: Subscription[] = [];

  form = new FormGroup({
    name: new FormControl('', { validators: [Validators.required] }),
    address: new FormControl('', { validators: [Validators.required] }),
    city: new FormControl('', { validators: [Validators.required] }),
  });

  constructor(
    private ngStore: Store<IAppState>,
    private orderService: OrderService,
    private router: Router
  ) {
    this.cartItems$ = ngStore.select('cartProducts', 'collection');
    this.subscriptions.push(
      this.cartItems$.subscribe((cps) => (this.cartItems = cps))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  async submit() {
    const orderId = await this.orderService.createOrder({
      ...this.form.value,
      items: this.cartItems,
    } as Order);
    this.router.navigate([`/order-success/${orderId}`])
  }

  getTotalPrice() {
    return this.cartItems.reduce(
      (previous, current) => previous + current.price * current.quantity,
      0
    );
  }
}
