import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {RootState} from '../../services/root-state';
import {ExploreActions, ExploreSelectors} from '../../services/explore-store';

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
  ) {
  }

  cars$ = this.store$.select(ExploreSelectors.getCars);

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
