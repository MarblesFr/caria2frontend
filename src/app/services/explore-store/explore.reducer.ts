import {createReducer, on} from '@ngrx/store';
import {initialState, State} from './explore.state';
import {loadCars, loadCarsSuccess} from './explore.actions';
import {ADD_AMOUNT} from './explore.config';
import {Car} from '../../models';

const exploreReducer = createReducer(
  initialState,
  on(loadCars, (state: State) => {
    return toShownCarsState(state.cars, state.shadowLoaded + ADD_AMOUNT);
  }),
  on(loadCarsSuccess, (state: State, action) => {
    let cars = state.cars.slice();
    cars = cars.concat(action.cars);
    return toShownCarsState(cars, state.shadowLoaded - ADD_AMOUNT);
  }),
);

function toShownCarsState(cars: Car[], shadowLoaded: number): State {
  return {
    cars,
    shadowLoaded,
    viewCars: cars.concat(Array.from({length: shadowLoaded}, () => {
      return {
        values: [],
        url: '../../../assets/loading-icon.png'
      };
    }))
  };
}

export function reducer(state: State | undefined, action): State {
  return exploreReducer(state, action);
}
