import { createActionGroup, createReducer, on, props } from '@ngrx/store';
import { CartState, initialCartState } from './states';
import { CartProduct } from 'shared/models/products';

export const cartActions = createActionGroup({
  source: 'cart',
  events: {
    'Set Fetching': props<{ isFetching: boolean }>(),
    'Fetch products': props<{ products: CartProduct[] }>(),
    'Set Quantity': props<{
      productId: string;
      count: number;
    }>(),
    'Add Product': props<{ product: CartProduct }>(),
  },
});

const setFetching = on(
  cartActions.setFetching,
  (state: CartState, { isFetching }): CartState => ({
    ...state,
    isFetching,
  })
);

const fetchProducts = on(
  cartActions.fetchProducts,
  (state: CartState, { products }): CartState => ({
    ...state,
    collection: products,
  })
);

const setQuantity = on(
  cartActions.setQuantity,
  (state: CartState, { productId, count }): CartState => {
    let newCollection = [...state.collection];
    const index = newCollection.findIndex((p) => p.id === productId);
    if (count > 0) {
      const newProduct = { ...newCollection[index] };
      newProduct.quantity = count;
      newCollection[index] = newProduct;
    }
    else {
      newCollection = [...newCollection.slice(0, index), ...newCollection.slice(index+1)]
    }

    return { ...state, collection: newCollection };
  }
);

const addProduct = on(
  cartActions.addProduct,
  (state: CartState, { product }): CartState => ({
    ...state,
    collection: [...state.collection, product],
  })
);

export const cartReducer = createReducer(
  initialCartState,
  setFetching,
  fetchProducts,
  setQuantity,
  addProduct
);
