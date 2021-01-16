import {createAction, props} from '@ngrx/store';

export const updateValues = createAction('[Caria] Update Values', props<{ values: number[] }>());

export const updateValue = createAction('[Caria] Update Value', props<{ index: number, value: number }>());
