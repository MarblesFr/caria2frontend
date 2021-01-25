import {
  Component, Input, ElementRef, AfterViewInit, ViewChild, HostListener, OnInit
} from '@angular/core';
import {fromEvent, Observable} from 'rxjs';
import {switchMap, takeUntil, pairwise} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {CariaActions} from '../../../services/caria-service';
import {CariaService} from '../../../services/caria-service/caria.service';
import {CanvasService} from '../../../services/canvas-service/canvas.service';

@Component({
  selector: 'caria-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 1px solid #000; }']
})

export class CanvasComponent implements OnInit, AfterViewInit {

  downscaleWidthFactor: number = 2 * 1.1;

  constructor(
    private readonly store$: Store,
    private cariaService: CariaService,
    private canvasService: CanvasService) {
    this.onResize();
  }

  @ViewChild('canvas') public canvas: ElementRef;
  public canvaselement;

  @Input() public width = window.innerWidth / this.downscaleWidthFactor;
  @Input() public height = window.innerWidth / 3;

  private cx: CanvasRenderingContext2D;

  public canvasStates: ImageData[] = [];

  public currentCanvasStateStep = 0;


  ngOnInit(): void {
    this.canvasService.clearCanvas.subscribe(() => this.clearCanvas());
    this.canvasService.updateColor.subscribe((color) => this.changeColor(color));
    this.canvasService.updateSize.subscribe((size) => this.changeBrushSize(size));
    this.canvasService.updateCanvas.subscribe(() => this.updateOutput());
    this.canvasService.undoLastStep.subscribe(() => this.undoLastStep());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    const newWidth = window.innerWidth / this.downscaleWidthFactor;
    let lineWidthBefore;
    let lineCapBefore;
    let strokeStyleBefore;
    let canvasImg: HTMLImageElement;

    // set
    if (this.cx != null) {
      lineWidthBefore = this.cx.lineWidth;
      lineCapBefore = this.cx.lineCap;
      strokeStyleBefore = this.cx.strokeStyle;
    }

    // update
    this.width = newWidth;
    this.height = this.width / 3;

    // apply scaling
    if (this.canvaselement != null && this.cx != null) {
      canvasImg = new Image(this.canvaselement.width, this.canvaselement.height);
      this.canvaselement.toBlob(blob => {
        const imageFile = new File([blob], 'image.png', { type: 'image/png', lastModified: Date.now() });
        canvasImg.src = URL.createObjectURL(imageFile);

        this.canvaselement.width = this.width;
        this.canvaselement.height = this.height;

        // apply styles
        if (this.currentCanvasStateStep > 0 && this.cx != null) {
          this.cx.fillStyle = '#FFF';
          this.cx.fillRect(0, 0, this.width, this.height);
          canvasImg.onload = (() => this.cx.drawImage(canvasImg, 0, 0, this.width, this.height));
        }
        this.cx.lineWidth = lineWidthBefore;
        this.cx.lineCap = lineCapBefore;
        this.cx.strokeStyle = strokeStyleBefore;
      }, 'image/png');
    }
  }

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = this.width;
    canvasEl.height = this.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.cx.fillStyle = '#FFF';
    this.cx.fillRect(0, 0, this.width, this.height);
    this.canvaselement = canvasEl;
    this.captureEvents(canvasEl);
    this.canvasStates[this.currentCanvasStateStep] = this.cx.getImageData(0, 0, this.width, this.height);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, 'mousedown')
      .pipe(
        switchMap(() => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, 'mousemove')
            .pipe(
              // we'll stop (and unsubscribe) once the user releases the mouse
              // this will trigger a 'mouseup' event
              takeUntil(fromEvent(canvasEl, 'mouseup')),
              // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
              takeUntil(fromEvent(canvasEl, 'mouseleave')),
              // pairwise lets us get the previous value to draw a line from
              // the previous point to the current point
              pairwise(),
            );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();

        // previous and current position with the offset
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top
        };

        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top
        };

        // this method we'll implement soon to do the actual drawing
        this.drawOnCanvas(prevPos, currentPos);
      });
    fromEvent(canvasEl, 'mouseup').subscribe(() => this.saveCurrentCanvasState());
  }

  private drawOnCanvas(prevPos: { x: number, y: number }, currentPos: { x: number, y: number }) {
    if (!this.cx) {
      return;
    }

    this.cx.beginPath();

    if (prevPos) {
      this.cx.moveTo(prevPos.x, prevPos.y); // from
      this.cx.lineTo(currentPos.x, currentPos.y);
      this.cx.stroke();
    }

    // update ai outout through backend upon updating the canvas
  }

  public clearCanvas() {
    this.cx.fillRect(0, 0, this.width, this.height);
    this.saveCurrentCanvasState();
  }

  public changeColor(colorCodeString: string) {
    this.cx.strokeStyle = colorCodeString;
  }

  public changeBrushSize(brushSize: number) {
    this.cx.lineWidth = brushSize;
  }

  public updateOutput() {
    // get values using the image from canvas and the encoder in the backend
    this.getValues().subscribe(
      values => this.store$.dispatch(CariaActions.updateValues({values}))
    );
  }

  public getValues(): Observable<number[]> {
    // get image data from canvas
    const canvasImageData = this.cx.getImageData(0, 0, this.width, this.height);
    return this.cariaService.getValuesFromImage(Array.prototype.slice.call(canvasImageData.data), this.width, this.height);
  }

  public undoLastStep() {
    if (this.currentCanvasStateStep > 0) {
      this.cx.putImageData(this.canvasStates[this.currentCanvasStateStep - 1], 0, 0);
      this.currentCanvasStateStep--;
    }
  }

  public saveCurrentCanvasState() {
    this.currentCanvasStateStep++;
    this.canvasStates[this.currentCanvasStateStep] = this.cx.getImageData(0, 0, this.width, this.height);
  }
}
