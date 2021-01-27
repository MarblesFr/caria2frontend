import {AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild} from '@angular/core';
import {fromEvent, Subscription} from 'rxjs';
import {pairwise, switchMap, take, takeUntil} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {CariaActions} from '../../../services/caria-service';
import {CariaService} from '../../../services/caria-service/caria.service';
import {CanvasService} from '../../../services/canvas-service/canvas.service';

@Component({
  selector: 'caria-canvas',
  template: '<canvas #canvas></canvas>',
  styles: ['canvas { border: 1px solid #000; }']
})

export class CanvasComponent implements AfterViewInit, OnDestroy {

  downscaleWidthFactor: number = 2 * 1.1;
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
        const imageFile = new File([blob], 'image.png', {type: 'image/png', lastModified: Date.now()});
        canvasImg.src = URL.createObjectURL(imageFile);

        this.canvaselement.width = this.width;
        this.canvaselement.height = this.height;

        this.cx.fillStyle = '#FFF';
        this.cx.fillRect(0, 0, this.width, this.height);
        canvasImg.onload = (() => this.cx.drawImage(canvasImg, 0, 0, this.width, this.height));
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

    this.firstStepSubscription = this.canvasService.currentStep$.pipe(
      take(1)
    ).subscribe(
      index => {
        if (index < 0){
          this.canvasService.updateImage(this.cx.getImageData(0, 0, this.width, this.height));
        }
      }
    );

    this.clearCanvasSubscription = this.canvasService.clearCanvas.subscribe(() => this.clearCanvas());
    this.activeColorSubscription = this.canvasService.activeColor$.subscribe((color) => this.changeColor(color));
    this.brushSizeSubscription = this.canvasService.size$.subscribe((size) => this.changeBrushSize(size));
    this.activeImageSubscription = this.canvasService.activeImage$.subscribe((image) => this.updateImage(image));
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
      const rect = canvasEl.getBoundingClientRect();
      const position = {
        x: res.clientX - rect.left,
        y: res.clientY - rect.top
      };
      this.drawPointOnCanvas(position);
      this.saveCurrentCanvasState();
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
        values => this.store$.dispatch(CariaActions.updateValues({values}))
      );
    });
  }

  public saveCurrentCanvasState() {
    this.canvasService.updateImage(this.cx.getImageData(0, 0, this.width, this.height));
  }

  public updateImage(imageData: ImageData) {
    this.cx.putImageData(imageData, 0, 0);
    this.updateOutput();
  }

  ngOnDestroy(): void {
    this.firstStepSubscription.unsubscribe();
    this.clearCanvasSubscription.unsubscribe();
    this.activeColorSubscription.unsubscribe();
    this.brushSizeSubscription.unsubscribe();
    this.activeImageSubscription.unsubscribe();
  }
}
