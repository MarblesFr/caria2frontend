import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {CariaActions, CariaSelectors} from '../../../services/caria-service';
import {SLIDER_COUNT, VALUE_RANGE} from '../../../services/caria-service/caria.config';

@Component({
  selector: 'caria-slider-window',
  templateUrl: './slider-window.component.html',
  styleUrls: ['./slider-window.component.scss']
})
export class SliderWindowComponent implements OnInit {

  SLIDER_COUNT = SLIDER_COUNT;
  VALUE_RANGE = VALUE_RANGE;

  pages = 4;
  currentPage = 0;

  @Input()
  values$: Observable<number[]>;

  constructor(
    private readonly store$: Store
  ) { }

  ngOnInit(): void {
    this.values$ = this.store$.select(CariaSelectors.getValues);
  }

  updateSlider(index: number, value: number): void {
    this.store$.dispatch(CariaActions.updateValue({ index, value }));
  }

  previousPage(): void {
    this.currentPage -= 1;
    if (this.currentPage < 0) {
      this.currentPage = this.pages - 1;
    }
  }

  nextPage(): void {
    this.currentPage += 1;
    if (this.currentPage > this.pages - 1) {
      this.currentPage = 0;
    }
  }
}
