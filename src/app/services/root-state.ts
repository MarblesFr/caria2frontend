import {cariaFeatureKey} from './caria-service/caria.state';
import {CariaState} from './caria-service';

export interface RootState {
  [cariaFeatureKey]: CariaState.State;
}

export const rootInitialState: RootState = {
  [cariaFeatureKey]: CariaState.initialState
};
