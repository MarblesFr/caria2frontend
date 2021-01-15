import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { cariaFeatureKey } from './caria.state';
import * as fromCaria from './caria.reducer';

@NgModule({
  declarations: [],
  imports: [CommonModule, StoreModule.forFeature(cariaFeatureKey, fromCaria.reducer)],
})
export class CariaStoreModule {}
