import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { IAppState } from '../../store/states';
import { categoryActions } from '../../store/categories/categories';
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc } from 'firebase/firestore';
import { Category } from 'shared/models/categories';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private db: Firestore, private ngStore: Store<IAppState>) {}
  
  async refreshCategories() {
    this.ngStore.dispatch(categoryActions.setFetching({ isFetching: true }));

    const q = query(collection(this.db, 'categories'));
    const querySnapshot = await getDocs(q);
    const categories = querySnapshot.docs.map(
      (d) => ({ ...d.data(), id: d.id } as Category)
    );

    this.ngStore.dispatch(categoryActions.setFetching({ isFetching: false }));
    this.ngStore.dispatch(categoryActions.fetchCategories({ categories }));
  }

  async addCategory(data: Category){
    this.ngStore.dispatch(categoryActions.setFetching({ isFetching: true }));
    
    await addDoc(collection(this.db, 'categories'), data)
    this.refreshCategories()
  }

  async updateCategory(id: string, data: Category){
    this.ngStore.dispatch(categoryActions.setFetching({ isFetching: true }));

    await setDoc(doc(this.db, `/categories/${id}`), data)
    this.refreshCategories()
  }

  async deleteCategory(id: string) {
    this.ngStore.dispatch(categoryActions.setFetching({ isFetching: true }));
    
    await deleteDoc(doc(this.db, `/categories/${id}`))
    this.refreshCategories()
  }
}
