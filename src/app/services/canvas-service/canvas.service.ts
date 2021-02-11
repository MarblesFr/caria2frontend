import {EventEmitter, Injectable} from '@angular/core';
import {convertToActualSize} from '../../util/caria.util';
import {BehaviorSubject, combineLatest} from 'rxjs';
import {map} from 'rxjs/operators';
import {filterUndefined} from '../../util/FilterUndefined';

export enum Tool{
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

  private _allImages$ = new BehaviorSubject<ImageData[]>([]);
  allImages$ = this._allImages$.asObservable();

  private _currentStep$ = new BehaviorSubject<number>(-1);
  currentStep$ = this._currentStep$.asObservable();

  activeImage$ = combineLatest([this.allImages$, this.currentStep$]).pipe(
    map(value => value[0][value[1]]),
    filterUndefined()
  );

  private _size$ = new BehaviorSubject<number>(3);
  size$ = this._size$.asObservable();

  private _colors$ = new BehaviorSubject<string[]>(['#000', '#000', '#000', '#000', '#000']);
  colors$ = this._colors$.asObservable();

  private _activeColorIndex$ = new BehaviorSubject<number>(0);
  activeColorIndex$ = this._activeColorIndex$.asObservable();

  activeColor$ = combineLatest([this.colors$, this.activeColorIndex$]).pipe(
    map(value => value[0][value[1]])
  );

  private _activeTool$ = new BehaviorSubject<Tool>(Tool.PENCIL);
  activeTool$ = this._activeTool$.asObservable();

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
    let images = this._allImages$.value;
    const currentStep = this._currentStep$.value;
    images = images.slice(0, currentStep + 1);
    images.push(image);
    this._currentStep$.next(currentStep + 1);
    this._allImages$.next(images);
  }

  undoImage() {
    const currentStep = this._currentStep$.value;
    if (currentStep > 0) {
      this._currentStep$.next(currentStep - 1);
    }
  }

  redoImage() {
    const images = this._allImages$.value;
    const currentStep = this._currentStep$.value;
    if (images.length - 1 > currentStep) {
      this._currentStep$.next(currentStep + 1);
    }
  }

  updateColor(color: string) {
    const colors = this._colors$.value;
    colors[this._activeColorIndex$.value] = color;
    this._colors$.next(colors);
  }

  updateActiveColorIndex(index: number) {
    this._activeColorIndex$.next(index);
  }

  updateSize(size: number) {
    this._size$.next(convertToActualSize(size));
  }

  updateActiveTool(tool: Tool) {
    this._activeTool$.next(tool);
  }
}
