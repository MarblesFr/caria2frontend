import {Component, OnInit} from '@angular/core';
import {CanvasService} from '../../../services/canvas-service/canvas.service';
import {Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import {convertFromActualSize} from '../../../util/caria.util';

@Component({
  selector: 'caria-canvas-tools',
  templateUrl: './canvas-tools.component.html',
  styleUrls: ['./canvas-tools.component.scss']
})
export class CanvasToolsComponent implements OnInit {

  selectedColorIndex$: Observable<number>;

  arrayColors$: Observable<string[]>;

  brushSize$: Observable<number>;

  initialBrushValue: number;

  activeColor: string;

  constructor(private canvasService: CanvasService) { }

  ngOnInit(): void {
    this.brushSize$ = this.canvasService.size$.pipe(map(value => Math.round(value)));
    this.arrayColors$ = this.canvasService.colors$;
    this.selectedColorIndex$ = this.canvasService.activeColorIndex$;
    this.canvasService.activeColor$.subscribe(value => this.activeColor = value);
    this.brushSize$.pipe(
      take(1)
    ).subscribe(value => this.initialBrushValue = value);
  }

  clearCanvas() {
    this.canvasService.notifyClearCanvas();
  }

  changeActiveColorIndex(index: number){
    this.canvasService.updateActiveColorIndex(index);
  }

  updateColor(color: string) {
    this.canvasService.updateColor(color);
  }

  updateSize(size: number) {
    this.canvasService.updateSize(size);
  }

  undoLastCanvasStep() {
    this.canvasService.undoImage();
  }

  redoLastCanvasStep() {
    this.canvasService.redoImage();
  }

  updateColorTo(colorString: string){
    this.canvasService.updateColor(colorString);
  }

  convertFromActualSize(size: number){
    return convertFromActualSize(size);
  }
}
