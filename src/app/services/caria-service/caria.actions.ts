import {createAction, props} from '@ngrx/store';

export const updateValues = createAction('[Caria] Update Values', props<{ value: number[] }>());
