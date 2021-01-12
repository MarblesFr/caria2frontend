import { Component, OnInit } from '@angular/core';
import { CariaService } from '../caria-service/caria.service';

@Component({
  selector: 'caria-ai-output',
  templateUrl: './ai-output.component.html',
  styleUrls: ['./ai-output.component.scss']
})
export class AiOutputComponent implements OnInit {

  constructor(private cariaService: CariaService) { }

  dataUrl$ = this.cariaService.getCar();

  ngOnInit(): void {
  }

}
