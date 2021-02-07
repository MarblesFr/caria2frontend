import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {CariaActions} from '../../services/caria-service';

@Component({
  selector: 'caria-fullscreen-page',
  templateUrl: './fullscreen-page.component.html',
  styleUrls: ['./fullscreen-page.component.scss']
})
export class FullscreenPageComponent {

  constructor(
    private router: Router,
    private readonly store$: Store,
  ) {
  }

  generateNewOutput(): void {
    this.store$.dispatch(CariaActions.randomizeValues());
  }

  startEditing(): void {
    this.router.navigate(['/slider']);
  }

}
