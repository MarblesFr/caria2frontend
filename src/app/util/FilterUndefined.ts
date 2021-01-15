import { OperatorFunction } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export function filterUndefined<R>(): OperatorFunction<R | undefined | null, R> {
  return (input$) =>
    input$.pipe(
      filter((value) => !!value),
      map((value) => value as R)
    );
}
