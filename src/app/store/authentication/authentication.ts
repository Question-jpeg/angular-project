import { createActionGroup, createReducer, on, props } from '@ngrx/store';
import { AuthenticationState, initialAuthenticationState } from './states';

export const authActions = createActionGroup({
  source: 'authentication',
  events: {
    'Set Fetching': props<{ isFetching: boolean }>(),
  },
});

const setFetching = on(
  authActions.setFetching,
  (state: AuthenticationState, { isFetching }): AuthenticationState => ({
    ...state,
    isFetching,
  })
);

export const authReducer = createReducer(
  initialAuthenticationState,
  setFetching,
);
