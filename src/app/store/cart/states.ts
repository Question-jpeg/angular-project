
import { CartProduct } from 'shared/models/products';

export interface CartState {
    collection: CartProduct[],
    isFetching: boolean
}

export const initialCartState: CartState = {
    collection: [],
    isFetching: false
}