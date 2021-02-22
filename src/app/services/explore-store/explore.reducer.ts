import {createReducer, on} from '@ngrx/store';
import {initialState, State} from './explore.state';
import {loadCarSuccess} from './explore.actions';

const exploreReducer = createReducer(
  initialState,
  on(loadCarSuccess, (state: State, action) => {
    const cars = state.cars.slice();
    cars.push(action.car);
    return { cars };
  }),
);

export function reducer(state: State | undefined, action): State {
  return exploreReducer(state, action);
}
