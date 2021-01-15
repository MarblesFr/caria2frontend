import {Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {CariaActions, CariaSelectors} from '../../../services/caria-service';
import {SLIDER_COUNT} from '../../../services/caria-service/caria.config';

@Component({
  selector: 'caria-slider-window',
  templateUrl: './slider-window.component.html',
  styleUrls: ['./slider-window.component.scss']
})
export class SliderWindowComponent implements OnInit {

  SLIDER_COUNT = SLIDER_COUNT;

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
}
