import {EventEmitter, Injectable} from '@angular/core';
import {convertToActualSize} from '../../util/caria.util';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {filterUndefined} from '../../util/FilterUndefined';

export enum Tools{
  PENCIL,
  ERASER,
  PICKER,
  FILL
}

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  clearCanvas = new EventEmitter();

  allImages$ = new BehaviorSubject<ImageData[]>([]);
  currentStep$ = new BehaviorSubject<number>(-1);
  activeImage$ = combineLatest([this.allImages$, this.currentStep$]).pipe(
    map(value => value[0][value[1]]),
    filterUndefined()
  );

  size$ = new BehaviorSubject<number>(3);
  colors$ = new BehaviorSubject<string[]>(['#000', '#000', '#000', '#000', '#000']);
  activeColorIndex$ = new BehaviorSubject<number>(0);
  activeColor$ = combineLatest([this.colors$, this.activeColorIndex$]).pipe(
    map(value => value[0][value[1]])
  );

  activeTool$ = new BehaviorSubject<Tools>(Tools.PENCIL);

  canUndo$ = this.currentStep$.pipe(
    map(value => value > 0)
  );

  canRedo$ = combineLatest([this.allImages$, this.currentStep$]).pipe(
    map(value => value[0].length - 1 > value[1])
  );

  constructor() {
  }

  notifyClearCanvas() {
    this.clearCanvas.emit();
  }

  updateImage(image: ImageData) {
    let images = this.allImages$.value;
    const currentStep = this.currentStep$.value;
    images = images.slice(0, currentStep + 1);
    images.push(image);
    this.currentStep$.next(currentStep + 1);
    this.allImages$.next(images);
  }

  undoImage() {
    const currentStep = this.currentStep$.value;
    if (currentStep > 0) {
      this.currentStep$.next(currentStep - 1);
    }
  }

  redoImage() {
    const images = this.allImages$.value;
    const currentStep = this.currentStep$.value;
    if (images.length - 1 > currentStep) {
      this.currentStep$.next(currentStep + 1);
    }
  }

  updateColor(color: string) {
    const colors = this.colors$.value;
    colors[this.activeColorIndex$.value] = color;
    this.colors$.next(colors);
  }

  updateActiveColorIndex(index: number) {
    this.activeColorIndex$.next(index);
  }

  updateSize(size: number) {
    this.size$.next(convertToActualSize(size));
  }

  updateActiveTool(tool: Tools) {
    this.activeTool$.next(tool);
  }
}
