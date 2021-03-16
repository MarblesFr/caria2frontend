import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {CanvasService, Tool} from '../../../services/canvas-service/canvas.service';
import {Observable, Subject} from 'rxjs';
import {map, take, takeUntil} from 'rxjs/operators';
import {convertFromActualSize} from '../../../util/caria.util';
import {AbstractControl, FormControl} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'caria-canvas-tools',
  templateUrl: './canvas-tools.component.html',
  styleUrls: ['./canvas-tools.component.scss']
})
export class CanvasToolsComponent implements OnInit, OnDestroy {

  disabled = false;
  touchUi = false;
  public color: ThemePalette = 'primary';
  colorCtr: AbstractControl = new FormControl(null);

  Tool = Tool;

  activeTool$: Observable<Tool>;

  canUndo: boolean;
  canRedo: boolean;

  selectedColorIndex$: Observable<number>;

  arrayColors$: Observable<string[]>;

  brushSize$: Observable<number>;

  initialBrushValue: number;

  activeColor: string;

  private readonly unsubscribe$ = new Subject<void>();

  constructor(private canvasService: CanvasService, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.canvasService.canUndo$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.canUndo = value;
      this.changeDetectorRef.detectChanges();
    });
    this.canvasService.canRedo$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
      this.canRedo = value;
      this.changeDetectorRef.detectChanges();
    });
    this.activeTool$ = this.canvasService.activeTool$;
    this.brushSize$ = this.canvasService.size$.pipe(map(value => Math.round(value)));
    this.arrayColors$ = this.canvasService.colors$;
    this.selectedColorIndex$ = this.canvasService.activeColorIndex$;
    this.canvasService.activeColor$.pipe(takeUntil(this.unsubscribe$)).subscribe(value => this.activeColor = value);
    this.brushSize$.pipe(
      takeUntil(this.unsubscribe$),
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

  convertFromActualSize(size: number){
    return convertFromActualSize(size);
  }

  updateCurrentTool(tool: Tool){
    this.canvasService.updateActiveTool(tool);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
