import { ModuleWithProviders, NgModule } from '@angular/core';
import {INITIAL_STATE, StoreModule} from '@ngrx/store';
import {ExploreStoreModule} from './explore-store';
import {rootInitialState} from './root-state';

@NgModule({
  declarations: [],
  imports: [
    ExploreStoreModule,
    StoreModule.forRoot({})
  ],
})
export class RootStoreModule {
  static forRoot(): ModuleWithProviders<RootStoreModule> {
    return {
      ngModule: RootStoreModule,
      providers: [
        {
          provide: INITIAL_STATE,
          useValue: rootInitialState,
        },
      ],
    };
  }
}
