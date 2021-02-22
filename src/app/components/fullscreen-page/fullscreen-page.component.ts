import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {CarService} from '../../services/car-service/car.service';

@Component({
  selector: 'caria-fullscreen-page',
  templateUrl: './fullscreen-page.component.html',
  styleUrls: ['./fullscreen-page.component.scss']
})
export class FullscreenPageComponent {

  constructor(
    private router: Router,
    private readonly cariaService: CarService,
  ) {
  }

  generateNewOutput(): void {
    this.cariaService.randomizeValues();
  }

  startEditing(): void {
    this.router.navigate(['/slider']);
  }

}
