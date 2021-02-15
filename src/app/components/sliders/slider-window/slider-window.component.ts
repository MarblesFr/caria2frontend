import {Component} from '@angular/core';
import {SLIDER_COUNT, VALUE_RANGE} from '../../../services/caria-service/caria.config';
import {CariaService} from '../../../services/caria-service/caria.service';

@Component({
  selector: 'caria-slider-window',
  templateUrl: './slider-window.component.html',
  styleUrls: ['./slider-window.component.scss']
})
export class SliderWindowComponent {

  SLIDER_COUNT = SLIDER_COUNT;
  VALUE_RANGE = VALUE_RANGE;

  pages = 4;
  currentPage = 0;

  values$ = this.cariaService.values$;

  constructor(
    private readonly cariaService: CariaService
  ) {
  }

  updateSlider(index: number, value: number): void {
    this.cariaService.updateValue(index, value);
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
