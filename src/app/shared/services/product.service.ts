import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Query,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { Subject } from 'rxjs';
import { IAppState } from '../../store/states';
import { Product } from 'shared/models/products';
import { productsActions } from '../../store/products/products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private db: Firestore,
    private ngStore: Store<IAppState>,
  ) {}

  async refreshProducts() {
    this.ngStore.dispatch(productsActions.setFetching({ isFetching: true }));

    const products = await this.getProducts();
    this.ngStore.dispatch(productsActions.setFetching({ isFetching: false }));
    this.ngStore.dispatch(productsActions.fetchProducts({ products }));
  }

  async updateProduct(id: string, data: Product) {
    this.ngStore.dispatch(productsActions.setFetching({ isFetching: true }));

    await setDoc(doc(this.db, `/products/${id}`), data);
    this.refreshProducts();
  }

  async deleteProduct(id: string) {
    this.ngStore.dispatch(productsActions.setFetching({ isFetching: true }));

    await deleteDoc(doc(this.db, `/products/${id}`));
    this.refreshProducts();
  }

  async addProduct(data: Product) {
    this.ngStore.dispatch(productsActions.setFetching({ isFetching: true }));

    await addDoc(collection(this.db, 'products'), data);
    this.refreshProducts();
  }

  async getProducts() {
    const q = query(collection(this.db, 'products'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (d) => ({ ...d.data(), id: d.id } as Product)
    );
  }
}
