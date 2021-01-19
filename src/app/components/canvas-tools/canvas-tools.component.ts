import {Component, Input, OnInit, Output} from '@angular/core';
import {EventEmitter} from '@angular/core';

@Component({
  selector: 'caria-canvas-tools',
  templateUrl: './canvas-tools.component.html',
  styleUrls: ['./canvas-tools.component.css']
})
export class CanvasToolsComponent implements OnInit {

  @Output() clearCanvasRequest = new EventEmitter();
  @Output() changeCanvasColorRequest = new EventEmitter();
  @Output() changeSizeRequest = new EventEmitter();
  @Output() updateCanvasRequest = new EventEmitter();

  public selectedColorIndex = 0;

  public arrayColors: string[] = ['#000000', '#000000', '#000000', '#000000', '#000000'];

  public color: any;

  constructor() { }

  ngOnInit(): void {
  }

  clearCanvas(){
    console.log("Request to clear canvas");
    this.clearCanvasRequest.emit();
  }

  changeSelectedColor(colorArrayIndex: number){
    this.selectedColorIndex = colorArrayIndex;
    this.updateColor();
  }

  updateColor(){
    this.changeCanvasColorRequest.emit(this.arrayColors[this.selectedColorIndex]);
  }

  updateSize(size: number){
    this.changeSizeRequest.emit(size);
  }

  updateCanvasOutput() {
    this.updateCanvasRequest.emit();
  }
}
