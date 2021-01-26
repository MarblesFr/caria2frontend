import {EventEmitter, Injectable} from '@angular/core';
import {convertToActualSize} from '../../util/caria.util';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  clearCanvas = new EventEmitter();
  updateColor = new EventEmitter<string>();
  updateSize = new EventEmitter<number>();
  updateCanvas = new EventEmitter();
  undoLastStep = new EventEmitter();

  constructor() {
  }

  notifyClearCanvas() {
    this.clearCanvas.emit();
  }

  notifyUpdateColor(color: string) {
    this.updateColor.emit(color);
  }

  notifyUpdateSize(size: number) {
    this.updateSize.emit(convertToActualSize(size));
  }

  notifyUpdateCanvas() {
    this.updateCanvas.emit();
  }

  notifyUndoLastStep() {
    this.undoLastStep.emit();
  }
}
