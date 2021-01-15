import { ModuleWithProviders, NgModule } from '@angular/core';
import {INITIAL_STATE, StoreModule} from '@ngrx/store';
import {CariaStoreModule} from './caria-service';
import {rootInitialState} from './root-state';

@NgModule({
  declarations: [],
  imports: [
    CariaStoreModule,
    StoreModule.forRoot({}),
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
