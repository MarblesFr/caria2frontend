import {SLIDER_COUNT, VALUE_RANGE} from '../services/caria-service/caria.config';

export function randomValues(): number[] {
  return Array.from({length: SLIDER_COUNT}, () => Math.random() * VALUE_RANGE * 2 - VALUE_RANGE);
}
