import {SLIDER_COUNT, VALUE_RANGE} from '../services/caria-service/caria.config';

export function randomValues(): number[] {
  return Array.from({length: SLIDER_COUNT}, () => Math.random() * VALUE_RANGE * 2 - VALUE_RANGE);
}

export function convertToActualSize(size: number) {
  return 30 * Math.pow(size + 0.3, 3);
}

export function convertFromActualSize(size: number) {
  return Math.pow(size / 30, 1 / 3) - 0.3;
}
