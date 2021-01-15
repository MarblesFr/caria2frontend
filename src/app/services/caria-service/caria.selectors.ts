import { createFeatureSelector, createSelector } from '@ngrx/store';
import {RootState} from '../root-state';
import {cariaFeatureKey, State} from './caria.state';

export const selectCariaState = createFeatureSelector<RootState, State>(cariaFeatureKey);

export const getValues = createSelector(
  selectCariaState,
  (state: State) => state.values
);
