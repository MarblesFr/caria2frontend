import {Car} from '../../models';

export const exploreFeatureKey = 'caria';

export interface State {
  cars: Car[];
  viewCars: Car[];
  shadowLoaded: number;
}

export const initialState: State = {
  cars: [],
  viewCars: [],
  shadowLoaded: 0,
};
