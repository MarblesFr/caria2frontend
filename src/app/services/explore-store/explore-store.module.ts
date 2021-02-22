import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { exploreFeatureKey } from './explore.state';
import * as fromCaria from './explore.reducer';
import {EffectsModule} from '@ngrx/effects';
import {ExploreEffects} from './explore-effects';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(exploreFeatureKey, fromCaria.reducer), EffectsModule.forFeature([ExploreEffects])],
})
export class ExploreStoreModule {}
