import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/states';
import { AuthService } from 'shared/services/auth.service';
import { CartService } from 'shared/services/cart.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  isFetching$;
  cartProducts$

  constructor(public afAuth: AuthService, private ngStore: Store<IAppState>, public cartService: CartService) {
    this.isFetching$ = ngStore.select('authentication', 'isFetching')
    this.cartProducts$ = ngStore.select('cartProducts', 'collection')
  }
  ngOnInit() {
    this.cartService.refreshProductsInCart()
  }

  logout() {
    this.afAuth.logout()
  }
}
