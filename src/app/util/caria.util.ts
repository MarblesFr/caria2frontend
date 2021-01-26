import {SLIDER_COUNT, VALUE_RANGE} from '../services/caria-service/caria.config';

export function randomValues(): number[] {
  return Array.from({length: SLIDER_COUNT}, () => Math.random() * VALUE_RANGE * 2 - VALUE_RANGE);
}

export function convertToActualSize(size: number) {
  size += 0.3;
  return 30 * Math.pow(size, 3);
}

export function convertFromActualSize(size: number) {
  return Math.pow(size, 1 / 3) / 30 - 0.3;
}
