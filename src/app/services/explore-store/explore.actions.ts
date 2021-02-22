import {createAction, props} from '@ngrx/store';
import {Car} from '../../models';

export const loadCars = createAction('[Explore] Load Cars');
export const loadCarSuccess = createAction('[Explore] Load Car Success', props<{ car: Car }>());
export const loadCarFailed = createAction('[Explore] Load Car Failed', props<{ car: Car }>());

export const setAsActive = createAction('[Explore] Set Car as Active', props<{ index: number }>());
export const setAsActiveSuccess = createAction('[Explore] Set Car as Active Success');
export const setAsActiveFailed = createAction('[Explore] Set Car as Active Failed');
