import {createReducer, on} from '@ngrx/store';
import {randomizeValues, updateValue, updateValues} from './caria.actions';
import {initialState, State} from './caria.state';
import {randomValues} from '../../util/caria.util';

const cariaReducer = createReducer(
  initialState,
  on(updateValues, (state: State, action) => {
    return {values: action.values};
  }),
  on(updateValue, (state: State, action) => {
    const values = state.values.slice();
    values[action.index] = action.value;
    return {values};
  }),
  on(randomizeValues, () => {
    return {values: randomValues()};
  }),
);

export function reducer(state: State | undefined, action): State {
  return cariaReducer(state, action);
}
