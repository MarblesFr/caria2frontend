import { createFeatureSelector, createSelector } from '@ngrx/store';
import {RootState} from '../root-state';
import {exploreFeatureKey, State} from './explore.state';

export const selectCariaState = createFeatureSelector<RootState, State>(exploreFeatureKey);

export const getCars = createSelector(
  selectCariaState,
  (state: State) => state.cars
);

export const getCar = createSelector(
  selectCariaState,
  (state: State, props: { index: number }) => state.cars[props.index]
);
