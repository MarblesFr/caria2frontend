import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {pairwise, switchMap, take, takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {CariaActions} from '../../../services/caria-service';
import {CariaService} from '../../../services/caria-service/caria.service';
import {CanvasService} from '../../../services/canvas-service/canvas.service';
import {Tools} from '../canvas-tools/canvas-tools.component';
import {rgbToHex} from '../../../util/caria.util';

@Component({
  selector: 'caria-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 1px solid #000; }']
})

export class CanvasComponent implements AfterViewInit, OnDestroy {

  downscaleWidthFactor: number = 2 * 1.1;

  private activeColor: string;

  constructor(
    private readonly store$: Store,
    private cariaService: CariaService,
    private canvasService: CanvasService) {
    this.onResize();
  }

  @ViewChild('canvas') public canvas: ElementRef;

  public canvaselement;
  public width = window.innerWidth / this.downscaleWidthFactor;

  public height = this.width / 3;
  private cx: CanvasRenderingContext2D;

  firstStepSubscription: Subscription;
  clearCanvasSubscription: Subscription;
  activeColorSubscription: Subscription;
  brushSizeSubscription: Subscription;
  activeImageSubscription: Subscription;
  currentToolSubscription: Subscription;

  public currentTool = Tools.PENCIL;
  public currentImage: ImageData;

  @HostListener('window:resize', ['$event'])
  onResize() {
    const newWidth = window.innerWidth / this.downscaleWidthFactor;
    let lineWidthBefore;
    let lineCapBefore;
    let strokeStyleBefore;

    if (this.cx != null) {
      lineWidthBefore = this.cx.lineWidth;
      lineCapBefore = this.cx.lineCap;
      strokeStyleBefore = this.cx.strokeStyle;
    }

    this.width = Math.round(newWidth);
    this.height = Math.round(this.width / 3);

    if (this.canvaselement != null && this.cx != null) {
      this.canvaselement.width = this.width;
      this.canvaselement.height = this.height;

      this.cx.fillStyle = '#FFF';
      this.cx.fillRect(0, 0, this.width, this.height);
      this.setImageToCanvas();
      this.cx.lineWidth = lineWidthBefore;
      this.cx.lineCap = lineCapBefore;
      this.cx.strokeStyle = strokeStyleBefore;
    }
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.cx.fillStyle = '#FFF';
    this.cx.fillRect(0, 0, this.width, this.height);
    this.canvaselement = canvasEl;
    this.captureEvents(canvasEl);

    this.firstStepSubscription = this.canvasService.currentStep$.pipe(
      take(1)
    ).subscribe(
      index => {
        if (index < 0) {
          this.canvasService.updateImage(this.cx.getImageData(0, 0, this.width, this.height));
        }
      }
    );

    this.clearCanvasSubscription = this.canvasService.clearCanvas.subscribe(() => this.clearCanvas());
    this.activeColorSubscription = this.canvasService.activeColor$.subscribe((color) => this.changeColor(color));
    this.brushSizeSubscription = this.canvasService.size$.subscribe((size) => this.changeBrushSize(size));
    this.activeImageSubscription = this.canvasService.activeImage$.subscribe((image) => this.updateImage(image));
    this.currentToolSubscription = this.canvasService.updateTool.subscribe((tool) => this.updateTool(tool));
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap(() => {
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              pairwise(),
            );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };
        if (this.currentTool === Tools.ERASER)
        {
          this.cx.strokeStyle = '#FFF';
          this.drawOnCanvas(prevPos, currentPos);
        }
        else if (this.currentTool === Tools.PENCIL){
          this.cx.strokeStyle = this.activeColor;
          this.drawOnCanvas(prevPos, currentPos);
        }
      });
    fromEvent(canvasEl, 'mouseup').subscribe((res: MouseEvent) => {
      const rect = canvasEl.getBoundingClientRect();
      const position = {
        x: res.clientX - rect.left,
        y: res.clientY - rect.top
      };
      if (this.currentTool === Tools.ERASER)
      {
        this.cx.strokeStyle = '#FFF';
        this.drawPointOnCanvas(position);
      }
      else if (this.currentTool === Tools.PENCIL){
        this.cx.strokeStyle = this.activeColor;
        this.drawPointOnCanvas(position);
      }
      this.saveCurrentCanvasState();
    });
    fromEvent(canvasEl, 'mousedown').subscribe((res: MouseEvent) => {
      if (this.currentTool === Tools.PICKER) {
        const rect = canvasEl.getBoundingClientRect();
        const position = {
          x: res.clientX - rect.left,
          y: res.clientY - rect.top
        };
        const pixel = this.cx.getImageData(position.x, position.y, 1, 1);
        const data = pixel.data;
        this.canvasService.updateColor(rgbToHex(data[0], data[1], data[2]));
      }
    });
  }

  private drawPointOnCanvas(position: { x: number, y: number }){
    if (!this.cx){
      return;
    }

    this.cx.beginPath();

    if (position){
      this.cx.moveTo(position.x, position.y);
      this.cx.lineTo(position.x, position.y);
      this.cx.stroke();
    }
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y);
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }
  }

  public clearCanvas() {
    this.cx.fillRect(0, 0, this.width, this.height);
    this.saveCurrentCanvasState();
  }

  public changeColor(colorCodeString: string) {
    this.activeColor = colorCodeString;
    this.cx.strokeStyle = this.activeColor;
  }

  public changeBrushSize(brushSize: number) {
    this.cx.lineWidth = brushSize;
  }

  public updateOutput() {
    this.canvaselement.toBlob(blob => {
      this.cariaService.getValuesFromImage(blob).subscribe(
        values => this.store$.dispatch(CariaActions.updateValues({values}))
      );
    });
  }

  public saveCurrentCanvasState() {
    this.canvasService.updateImage(this.cx.getImageData(0, 0, this.width, this.height));
  }

  public updateImage(imageData: ImageData) {
    this.currentImage = imageData;
    this.setImageToCanvas();
    this.updateOutput();
  }

  private setImageToCanvas() {
    createImageBitmap(this.currentImage).then(renderer =>
      this.cx.drawImage(renderer, 0, 0, this.width, this.height)
    );
  }

  private updateTool(tool: Tools) {
    this.currentTool = tool;
  }

  ngOnDestroy(): void {
    this.firstStepSubscription.unsubscribe();
    this.clearCanvasSubscription.unsubscribe();
    this.activeColorSubscription.unsubscribe();
    this.brushSizeSubscription.unsubscribe();
    this.activeImageSubscription.unsubscribe();
    this.currentToolSubscription.unsubscribe();
  }
}
