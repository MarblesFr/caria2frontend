import {createReducer, on} from '@ngrx/store';
import {updateValues} from './caria.actions';
import {initialState, State} from './caria.state';

const cariaReducer = createReducer(
  initialState,
  on(updateValues, (state: State, action) => {
    return {values: action.value};
  })
);

export function reducer(state: State | undefined, action): State {
  return cariaReducer(state, action);
}
