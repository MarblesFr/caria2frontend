import {SLIDER_COUNT} from './caria.config';

export const cariaFeatureKey = 'caria';

export interface State {
  values: number[];
}

export const initialState: State = {
  values: Array(SLIDER_COUNT).fill(0),
};
