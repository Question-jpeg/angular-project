import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from 'app/store/states';
import { CartService } from 'shared/services/cart.service';
import { Subscription } from 'rxjs';
import { cartActions } from 'app/store/cart/cart';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnDestroy {
  products$;
  totalPrice = 0;
  isOwner = true;
  subscriptions: Subscription[] = [];

  productsTimeouts: any;

  constructor(
    private cartService: CartService,
    private ngStore: Store<IAppState>,
    private dialog: MatDialog
  ) {
    this.products$ = ngStore.select('cartProducts', 'collection');
    this.subscriptions.push(
      this.products$.subscribe((products) => {
        this.totalPrice = products.reduce(
          (previous, current) => previous + current.price * current.quantity,
          0
        );
      })
    );
  }

  deleteProduct(productId: string) {
    this.ngStore.dispatch(
      cartActions.setQuantity({
        productId,
        count: 0,
      })
    );
    this.cartService.deleteCartProduct(productId)
  }

  incrementQuantity(productId: string, count: number ) {
    this.ngStore.dispatch(
      cartActions.setQuantity({
        productId,
        count,
      })
    );
    this.cartService.incrementOnServer(productId, count)
  }

  

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteCartItemsDialog);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ngStore.dispatch(cartActions.fetchProducts({ products: [] }));
        this.cartService.deleteAll();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

@Component({
  selector: 'app-delete-cart-items-dialog',
  template: `
    <h1 style="padding: 40px 40px 0">Are you sure you want to clear all the items in your cart?</h1>
    <mat-dialog-actions style="padding-bottom: 15px; padding-right: 20px;" align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button color="warn" mat-button [mat-dialog-close]="true">Clear</button>
    </mat-dialog-actions>
  `,
})
export class DeleteCartItemsDialog {}
