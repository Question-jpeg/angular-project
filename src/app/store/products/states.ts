
import { Product } from 'shared/models/products';

export interface ProductState {
    collection: Product[],
    isFetching: boolean
}

export const initialProductState: ProductState = {
    collection: [],
    isFetching: false
}