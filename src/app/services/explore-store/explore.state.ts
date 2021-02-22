import {Car} from '../../models';

export const exploreFeatureKey = 'caria';

export interface State {
  cars: Car[];
}

export const initialState: State = {
  cars: [],
};
