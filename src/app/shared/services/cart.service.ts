import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  doc,
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { CartProduct } from 'shared/models/products';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/states';
import { cartActions } from '../../store/cart/cart';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartId$ = new ReplaySubject(1);
  cartId = '';
  productsTimeouts: { [key: string]: any };

  constructor(private db: Firestore, private ngStore: Store<IAppState>) {
    this.getCartId();
  }

  async refreshProductsInCart() {
    this.ngStore.dispatch(cartActions.setFetching({ isFetching: true }));

    const sub = this.cartId$.subscribe(async (cartId) => {
      const products: CartProduct[] = (
        await getDocs(query(collection(this.db, `carts/${cartId}/products`)))
      ).docs.map((d) => d.data() as CartProduct);
      this.ngStore.dispatch(cartActions.fetchProducts({ products }));
      this.ngStore.dispatch(cartActions.setFetching({ isFetching: false }));
      sub.unsubscribe();
    });
  }

  addProduct(product: CartProduct) {
    this.preventOperationOnProduct(
      product.id!,
      setTimeout(() => {
        setDoc(
          doc(this.db, `carts/${this.cartId}/products/${product.id}`),
          product
        );
      }, 0)
    );
  }

  deleteCartProduct(productId: string) {
    this.preventOperationOnProduct(
      productId!,
      setTimeout(() => {
        deleteDoc(doc(this.db, `/carts/${this.cartId}/products/${productId}`));
      }, 0)
    );
  }

  async deleteAll() {
    Object.values(this.productsTimeouts ?? {}).forEach((timeout) =>
      clearTimeout(timeout)
    );
    const docs = (
      await getDocs(collection(this.db, `carts/${this.cartId}/products`))
    ).docs;
    for (let d of docs) {
      deleteDoc(d.ref);
    }
  }

  preventOperationOnProduct(productId: string, productTimeout: any) {
    if (!this.productsTimeouts)
      this.productsTimeouts = { [productId]: productTimeout };
    else {
      const timeoutRef = this.productsTimeouts[productId];
      if (timeoutRef) clearTimeout(timeoutRef);
      this.productsTimeouts[productId] = productTimeout;
    }
  }

  incrementOnServer(productId: string, count: number) {
    if (count <= 0) this.deleteCartProduct(productId);
    else {
      this.preventOperationOnProduct(
        productId,
        setTimeout(() => {
          this.setQuantity(productId, count);
        }, 2000)
      );
    }
  }

  async setQuantity(productId: string, x: number) {
    const docRef = doc(this.db, `/carts/${this.cartId}/products/${productId}/`);

    await updateDoc(docRef, { quantity: x });
  }

  async getCartId() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
      cartId = await this.createCart();
      localStorage.setItem('cartId', cartId);
    }
    this.cartId$.next(cartId);
    this.cartId = cartId;
  }

  async createCart() {
    const created = await addDoc(collection(this.db, 'carts'), {});
    return created.id;
  }
}
