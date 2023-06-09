import { Order } from 'shared/models/order';
export interface OrderState {
  collection: Order[];
  isFetching: boolean;
}

export const initialOrderState = {
  collection: [],
  isFetching: false,
};
