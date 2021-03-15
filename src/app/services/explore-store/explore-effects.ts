import {Injectable} from '@angular/core';
import {CarService} from '../car-service/car.service';
import {Store} from '@ngrx/store';
import {RootState} from '../root-state';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  loadCarsFailed,
  loadCars,
  loadCarsSuccess,
  setAsActive,
  setAsActiveFailed,
  setAsActiveSuccess,
  loadNCars,
  loadNCarsSuccess, loadNCarsFailed
} from './explore.actions';
import {catchError, concatMap, first, map, tap} from 'rxjs/operators';
import {ADD_AMOUNT} from './explore.config';
import {randomValues} from '../../util/caria.util';
import {Car} from '../../models';
import {getCar} from './explore.selectors';
import {of} from 'rxjs';


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
      map(() => loadCars())
    )
  );

  loadNCars$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadNCars),
      map((params) => Array.from({length: params.amount}, () => randomValues())),
      concatMap((values) =>
        this.carService.multipleValuesToCars(values).pipe(
          map((cars) => loadNCarsSuccess({ cars })),
          catchError(() => of(loadNCarsFailed({ amount: values.length })))
        )
      )
    )
  );

  loadNCarsFailed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadNCarsFailed),
      map((params) => loadNCars(params))
    )
  );

  setAsActive$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setAsActive),
      concatMap((params) =>
        this.store$.select(getCar, { index: params.index }).pipe(first(),
          tap((car: Car) => this.carService.updateValues(car.values.slice())),
          map(() => setAsActiveSuccess()),
          catchError(() => of(setAsActiveFailed()))
        )
      )
    )
  );
}
