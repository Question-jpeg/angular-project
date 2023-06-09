import { createActionGroup, on, props, createReducer } from '@ngrx/store';
import { Order } from 'shared/models/order';
import { initialOrderState, OrderState } from './states';

export const orderActions = createActionGroup({
  source: 'order',
  events: {
    'Fetch Orders': props<{ orders: Order[] }>(),
    'Add Order': props<{ order: Order }>(),
  },
});

const fetchOrders = on(
  orderActions.fetchOrders,
  (state: OrderState, { orders }): OrderState => ({
    ...state,
    collection: orders,
  })
);

const addOrder = on(
  orderActions.addOrder,
  (state: OrderState, { order }): OrderState => ({
    ...state,
    collection: [...state.collection, order],
  })
);

export const orderReducer = createReducer(
  initialOrderState,
  fetchOrders,
  addOrder
);
