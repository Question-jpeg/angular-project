
import { Timestamp } from 'firebase/firestore';
import { CartProduct } from 'shared/models/products';

export interface Order {
    id?: string,
    userId?: string,
    name: string,
    address: string,
    city: string,
    items?: CartProduct[],
    date?: Timestamp | Date
}