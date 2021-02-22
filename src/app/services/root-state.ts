import {exploreFeatureKey} from './explore-store/explore.state';
import {ExploreState} from './explore-store';

export interface RootState {
  [exploreFeatureKey]: ExploreState.State;
}

export const rootInitialState: RootState = {
  [exploreFeatureKey]: ExploreState.initialState
};
