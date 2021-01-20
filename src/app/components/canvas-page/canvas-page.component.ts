import {Component, OnInit, ViewChild} from '@angular/core';
import {CanvasComponent} from '../canvas/canvas.component';

@Component({
  selector: 'caria-canvas-page',
  templateUrl: './canvas-page.component.html',
  styleUrls: ['./canvas-page.component.css']
})
export class CanvasPageComponent implements OnInit {

  constructor() { }

  @ViewChild(CanvasComponent) canvasComponent: CanvasComponent;

  ngOnInit(): void {
  }

  clearCanvasActually($event: any){
    this.canvasComponent.clearCanvas();
  }

  changeCanvasColorActually(colorCodeString: string) {
    this.canvasComponent.changeColor(colorCodeString);
  }

  changeCanvasSizeActually(brushSize: number) {
    this.canvasComponent.changeBrushSize(brushSize);
  }

  updateCanvasActually($event: any) {
    this.canvasComponent.updateOutput();
  }

  undoLastCanvasStepActually($event: any) {
    this.canvasComponent.undoLastStep();
  }
}
