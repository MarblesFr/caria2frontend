import {createAction, props} from '@ngrx/store';
import {Car} from '../../models';

export const loadCars = createAction('[Explore] Load Cars');
export const loadCarsSuccess = createAction('[Explore] Load Car Success', props<{ cars: Car[] }>());
export const loadCarsFailed = createAction('[Explore] Load Car Failed');

export const initCars = createAction('[Explore] Init Cars');

export const loadCurrentCar = createAction('[Explore] Load Current Car');
export const loadCurrentSuccess = createAction('[Explore] Load Current Car Success', props<{ car: Car }>());

export const loadInitialCars = createAction('[Explore] Load N Cars', props<{ amount: number }>());
export const loadInitialCarsSuccess = createAction('[Explore] Load N Car Success', props<{ cars: Car[] }>());
export const loadInitialCarsFailed = createAction('[Explore] Load N Car Failed', props<{ amount: number }>());

export const setAsActive = createAction('[Explore] Set Car as Active', props<{ index: number }>());
export const setAsActiveSuccess = createAction('[Explore] Set Car as Active Success');
export const setAsActiveFailed = createAction('[Explore] Set Car as Active Failed');
