import {Injectable} from '@angular/core';
import {filter, first, map} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {Page} from '../../app-routing.module';
import {filterUndefined} from '../../util/FilterUndefined';
import {CarService} from '../car-service/car.service';
import {saveAs} from 'file-saver';
import {CanvasService} from '../canvas-service/canvas.service';

export enum Action {
  EXPORTIMG = 'Export Image',
  IMPORTIMG = 'Import Image',
  EXPORTSLIDERS = 'Export Values',
  IMPORTSLIDERS = 'Import Values',
  EXPORTCANVAS = 'Export Canvas',
  IMPORTCANVAS = 'Import Canvas',
  OUTPUT2CANVAS = 'Edit Output'
}

@Injectable({
  providedIn: 'root'
})
export class ActionService {

  private _activePage$ = this.router.events
    .pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: NavigationEnd) => {
        return event.urlAfterRedirects.replace('/', '') as Page;
      }),
      filterUndefined()
    );

  actions$ = this._activePage$.pipe(
    map(page => {
      const actions: Action[] = [];
      actions.push(Action.EXPORTIMG, Action.IMPORTIMG, Action.EXPORTSLIDERS, Action.IMPORTSLIDERS);
      if (page === Page.CANVAS) {
        actions.push(Action.EXPORTCANVAS, Action.IMPORTCANVAS, Action.OUTPUT2CANVAS);
      }
      return actions;
    })
  );

  constructor(private readonly router: Router, private readonly cariaService: CarService, private readonly canvasService: CanvasService) {
  }

  executeAction(item: Action) {
    switch (item) {
      case Action.EXPORTIMG:
        this.exportImage();
        break;
      case Action.IMPORTIMG:
        this.importImage();
        break;
      case Action.EXPORTSLIDERS:
        this.exportSliders();
        break;
      case Action.IMPORTSLIDERS:
        this.importSliders();
        break;
      case Action.EXPORTCANVAS:
        this.exportCanvas();
        break;
      case Action.IMPORTCANVAS:
        this.importCanvas();
        break;
      case Action.OUTPUT2CANVAS:
        this.outputToCanvas();
        break;
      default:
        break;
    }
  }

  exportImage() {
    this.cariaService.currentOutputBlob$.pipe(first()).subscribe(image => saveAs(image, 'output.png'));
  }

  importImage() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = () => {
      this.cariaService.updateValuesFromImage(input.files[0]);
    };

    input.click();
  }

  exportSliders() {
    this.cariaService.values$.pipe(first())
      .subscribe(values => {
        const valueBlob = new Blob([JSON.stringify(values)], {type: 'text/plain;charset=utf-8'});
        saveAs(valueBlob, 'values.caria');
      });
  }

  importSliders() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = () => {
      input.files[0].text().then(value => {
        this.cariaService.updateValues(JSON.parse(value));
      });
    };

    input.click();
  }

  outputToCanvas() {
    this.cariaService.currentOutputBlob$.pipe(first())
      .subscribe(blob => this.canvasService.updateImage(blob));
  }

  exportCanvas() {
    this.canvasService.activeImage$.pipe(first()).subscribe(image => saveAs(image, 'canvas.png'));
  }

  importCanvas() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = () => this.canvasService.updateImage(input.files[0]);

    input.click();
  }
}
