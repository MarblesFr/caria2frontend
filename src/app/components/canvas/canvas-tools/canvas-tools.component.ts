import {Component, OnInit} from '@angular/core';
import {CanvasService} from '../../../services/canvas-service/canvas.service';

@Component({
  selector: 'caria-canvas-tools',
  templateUrl: './canvas-tools.component.html',
  styleUrls: ['./canvas-tools.component.scss']
})
export class CanvasToolsComponent implements OnInit {

  public selectedColorIndex = 0;

  public arrayColors: string[] = ['#000000', '#000000', '#000000', '#000000', '#000000'];

  public color: any;

  public brushSize: number;

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
  }

  clearCanvas() {
    this.canvasService.notifyClearCanvas();
  }

  changeSelectedColor(colorArrayIndex: number){
    this.selectedColorIndex = colorArrayIndex;
    this.updateColor();
  }

  updateColor() {
    this.canvasService.notifyUpdateColor(this.arrayColors[this.selectedColorIndex]);
  }

  updateSize(size: number) {
    this.brushSize = size;
    this.canvasService.notifyUpdateSize(this.brushSize);
  }

  updateCanvasOutput() {
    this.canvasService.notifyUpdateCanvas();
  }

  undoLastCanvasStep() {
    this.canvasService.notifyUndoLastStep();
  }

  updateColorTo(colorString: string){
    this.canvasService.notifyUpdateColor(colorString);
  }
}