import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {RootState} from '../../services/root-state';
import {ExploreActions, ExploreSelectors} from '../../services/explore-store';
import {CarService} from "../../services/car-service/car.service";
import {subscribeOn} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'caria-fullscreen-page',
  templateUrl: './fullscreen-page.component.html',
  styleUrls: ['./fullscreen-page.component.scss']
})
export class FullscreenPageComponent implements OnInit{
  selector = '.scroll-container';

  constructor(
    private router: Router,
    private readonly store$: Store<RootState>,
    private carService: CarService
  ) {
  }

  cars$ = this.store$.select(ExploreSelectors.getCars);
  activeCar$ = this.carService.activeCar$;

  generateNewOutput() {
    this.store$.dispatch(ExploreActions.loadCars());
  }

  setActive(index: number) {
    this.store$.dispatch(ExploreActions.setAsActive({ index }));
  }

  ngOnInit(): void {
    this.store$.dispatch(ExploreActions.initCars());
  }
}
