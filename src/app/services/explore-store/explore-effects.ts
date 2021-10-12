import {Injectable} from '@angular/core';
import {CarService} from '../car-service/car.service';
import {Store} from '@ngrx/store';
import {RootState} from '../root-state';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  initCars,
  loadCars,
  loadCarsFailed,
  loadCarsSuccess, loadCurrentCar, loadCurrentSuccess,
  loadInitialCars,
  loadInitialCarsFailed,
  loadInitialCarsSuccess,
  setAsActive,
  setAsActiveFailed,
  setAsActiveSuccess
} from './explore.actions';
import {catchError, concatMap, delay, first, map, tap, withLatestFrom} from 'rxjs/operators';
import {ADD_AMOUNT, INITIAL_LOAD_AMOUNT, MAX_LOAD_AMOUNT} from './explore.config';
import {randomValues} from '../../util/caria.util';
import {Car} from '../../models';
import {getCar} from './explore.selectors';
import {of} from 'rxjs';
import {ExploreSelectors} from './index';


@Injectable()
export class ExploreEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store$: Store<RootState>,
    private readonly carService: CarService,
  ) {}

  loadCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCars),
      map(() => Array.from({length: ADD_AMOUNT}, () => randomValues())),
      concatMap((values) =>
        this.carService.multipleValuesToCars(values).pipe(
          map((cars) => loadCarsSuccess({ cars })),
          catchError(() => of(loadCarsFailed()))
        )
      )
    )
  );

  loadCarsFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCarsFailed),
      delay(5000),
      map(() => loadCars())
    )
  );

  initCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initCars),
      concatMap(() => this.store$.select(ExploreSelectors.getCars).pipe(first())),
      map((cars) => {
        if (cars.length === 0) {
          return loadInitialCars({amount: INITIAL_LOAD_AMOUNT});
        }
        else {
          return loadCurrentCar();
        }
      })
    )
  );

  loadCurrentCar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentCar),
      withLatestFrom(this.carService.values$, this.carService.currentOutput$),
      tap(() => this.carService.setActive(0)),
      map(([, values, url]) => loadCurrentSuccess({ car: {values, url}}))
    )
  );

  loadInitialCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInitialCars),
      withLatestFrom(this.carService.values$),
      map(([params, values]) => [values].concat(Array.from({length: params.amount - 1}, () => randomValues()))),
      concatMap((values) =>
        this.carService.multipleValuesToCars(values).pipe(
          map((cars) => loadInitialCarsSuccess({ cars })),
          catchError(() => of(loadInitialCarsFailed({ amount: MAX_LOAD_AMOUNT })))
        )
      )
    )
  );

  loadInitialCarsFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadInitialCarsFailed),
      delay(5000),
      map((params) => loadInitialCars(params))
    )
  );

  setAsActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setAsActive),
      concatMap((params) =>
        this.store$.select(getCar, { index: params.index }).pipe(
          first(),
          tap((car: Car) => {
            this.carService.updateValues(car.values.slice());
            this.carService.setActive(params.index);
          }),
          map(() => setAsActiveSuccess()),
          catchError(() => of(setAsActiveFailed()))
        )
      )
    )
  );
}
