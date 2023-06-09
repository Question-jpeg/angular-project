import { createActionGroup, createReducer, on, props } from '@ngrx/store';
import { ProductState, initialProductState } from './states';
import { Product } from 'shared/models/products';

export const productsActions = createActionGroup({
  source: 'products',
  events: {
    'Set Fetching': props<{ isFetching: boolean }>(),
    'Fetch products': props<{ products: Product[] }>(),
  },
});

const setFetching = on(
  productsActions.setFetching,
  (state: ProductState, { isFetching }): ProductState => ({
    ...state,
    isFetching,
  })
);

const fetchProducts = on(
  productsActions.fetchProducts,
  (state: ProductState, { products }): ProductState => ({
    ...state,
    collection: products,
  })
);

export const productsReducer = createReducer(
  initialProductState,
  setFetching,
  fetchProducts
);
