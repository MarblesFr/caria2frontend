import {EventEmitter, Injectable} from '@angular/core';

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
    this.updateSize.emit(size);
  }

  notifyUpdateCanvas() {
    this.updateCanvas.emit();
  }

  notifyUndoLastStep() {
    this.undoLastStep.emit();
  }
}
