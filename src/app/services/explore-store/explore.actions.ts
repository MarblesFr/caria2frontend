import {createAction, props} from '@ngrx/store';
import {Car} from '../../models';

export const loadCars = createAction('[Explore] Load Cars');
export const loadCarsSuccess = createAction('[Explore] Load Car Success', props<{ cars: Car[] }>());
export const loadCarsFailed = createAction('[Explore] Load Car Failed');

export const loadNCars = createAction('[Explore] Load N Cars', props<{ amount: number }>());
export const loadNCarsSuccess = createAction('[Explore] Load N Car Success', props<{ cars: Car[] }>());
export const loadNCarsFailed = createAction('[Explore] Load N Car Failed', props<{ amount: number }>());

export const setAsActive = createAction('[Explore] Set Car as Active', props<{ index: number }>());
export const setAsActiveSuccess = createAction('[Explore] Set Car as Active Success');
export const setAsActiveFailed = createAction('[Explore] Set Car as Active Failed');
