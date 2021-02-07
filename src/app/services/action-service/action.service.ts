import { Injectable } from '@angular/core';
import {filter, map} from 'rxjs/operators';
import {NavigationEnd, Router} from '@angular/router';
import {Page} from '../../app-routing.module';
import {filterUndefined} from '../../util/FilterUndefined';

export enum Action{
  EXPORTIMG = 'Export Image',
  IMPORTIMG = 'Import Image',
  EXPORTSLIDERS = 'Export Sliders',
  IMPORTSLIDERS = 'Import Sliders',
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
      actions.push(Action.EXPORTIMG, Action.IMPORTIMG);
      if (page === Page.SLIDER) {
        actions.push(Action.EXPORTSLIDERS, Action.IMPORTSLIDERS);
      }
      else if (page === Page.CANVAS) {
        actions.push(Action.EXPORTCANVAS, Action.IMPORTCANVAS, Action.OUTPUT2CANVAS);
      }
      return actions;
    })
  );

  constructor(private readonly router: Router) {}

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

  }

  importImage() {

  }

  exportSliders() {

  }

  importSliders() {

  }

  outputToCanvas() {

  }

  exportCanvas() {

  }

  importCanvas() {

  }
}
