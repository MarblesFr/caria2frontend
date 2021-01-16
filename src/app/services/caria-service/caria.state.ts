import {randomValues} from '../../util/caria.util';

export const cariaFeatureKey = 'caria';

export interface State {
  values: number[];
}

export const initialState: State = {
  values: randomValues(),
};
