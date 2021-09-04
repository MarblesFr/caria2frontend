import {createReducer, on} from '@ngrx/store';
import {initialState, State} from './explore.state';
import {
  loadCars,
  loadCarsFailed,
  loadCarsSuccess,
  loadCurrentSuccess,
  loadInitialCars,
  loadInitialCarsFailed,
  loadInitialCarsSuccess
} from './explore.actions';
import {ADD_AMOUNT, MAX_LOAD_AMOUNT} from './explore.config';
import {Car} from '../../models';

const exploreReducer = createReducer(
  initialState,
  on(loadCars, (state: State) => {
    return toShownCarsState(state.cars, state.shadowLoaded + ADD_AMOUNT);
  }),
  on(loadCarsSuccess, (state: State, action) => {
    let cars = state.cars.slice();
    cars = cars.concat(action.cars);
    return toShownCarsState(cars, state.shadowLoaded - action.cars.length);
  }),
  on(loadCarsFailed, (state: State) => {
    return toShownCarsState(state.cars, state.shadowLoaded - MAX_LOAD_AMOUNT);
  }),
  on(loadInitialCars, (state: State, action) => {
    return toShownCarsState(state.cars, state.shadowLoaded + action.amount);
  }),
  on(loadCurrentSuccess, (state: State, action) => {
    let cars = state.cars.slice(1);
    cars = [action.car].concat(cars);
    return toShownCarsState(cars, state.shadowLoaded);
  }),
  on(loadInitialCarsSuccess, (state: State, action) => {
    let cars = state.cars.slice();
    cars = cars.concat(action.cars);
    return toShownCarsState(cars, state.shadowLoaded - action.cars.length);
  }),
  on(loadInitialCarsFailed, (state: State, action) => {
    return toShownCarsState(state.cars, state.shadowLoaded - action.amount);
  }),
);

function toShownCarsState(cars: Car[], shadowLoaded: number): State {
  return {
    cars,
    shadowLoaded,
    viewCars: cars.concat(Array.from({length: shadowLoaded}, () => {
      return {
        values: [],
        url: 'assets/loading-car.png'
      };
    }))
  };
}

export function reducer(state: State | undefined, action): State {
  return exploreReducer(state, action);
}
