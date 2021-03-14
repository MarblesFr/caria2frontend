import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'caria-slider-page',
  templateUrl: './slider-page.component.html',
  styleUrls: ['./slider-page.component.scss']
})
export class SliderPageComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }



  changeSliderValue(valueAsNumber: number) {
    const el = document.getElementById('slider-card');
    let scrollLeftPx;
    scrollLeftPx = el.offsetWidth / 90 * valueAsNumber;
    el.scrollLeft = scrollLeftPx;
  }
}
