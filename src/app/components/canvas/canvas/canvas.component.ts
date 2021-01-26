import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {fromEvent} from 'rxjs';
import {pairwise, switchMap, takeUntil} from 'rxjs/operators';
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

    if (this.cx != null) {
      lineWidthBefore = this.cx.lineWidth;
      lineCapBefore = this.cx.lineCap;
      strokeStyleBefore = this.cx.strokeStyle;
    }

    this.width = newWidth;
    this.height = this.width / 3;

    if (this.canvaselement != null && this.cx != null) {
      canvasImg = new Image(this.canvaselement.width, this.canvaselement.height);
      this.canvaselement.toBlob(blob => {
        const imageFile = new File([blob], 'image.png', { type: 'image/png', lastModified: Date.now() });
        canvasImg.src = URL.createObjectURL(imageFile);

        this.canvaselement.width = this.width;
        this.canvaselement.height = this.height;

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

        this.drawOnCanvas(prevPos, currentPos);
      });
    fromEvent(canvasEl, 'mouseup').subscribe((res: MouseEvent) => {
      this.saveCurrentCanvasState();
      const rect = canvasEl.getBoundingClientRect();
      const position = {
        x: res.clientX - rect.left,
        y: res.clientY - rect.top
      };
      this.drawPointOnCanvas(position);
      this.updateOutput();
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
    this.cx.strokeStyle = colorCodeString;
  }

  public changeBrushSize(brushSize: number) {
    this.cx.lineWidth = brushSize;
  }

  public updateOutput() {
    this.canvaselement.toBlob(blob => {
      this.cariaService.getValuesFromImage(blob).subscribe(
        values =>  this.store$.dispatch(CariaActions.updateValues({ values }))
      );
    });
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
