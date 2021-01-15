import {Component, OnInit} from '@angular/core';
import {CariaService} from '../../services/caria-service/caria.service';
import {Observable} from 'rxjs';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'caria-ai-output',
  templateUrl: './ai-output.component.html',
  styleUrls: ['./ai-output.component.scss']
})
export class AiOutputComponent implements OnInit {

  constructor(private cariaService: CariaService) { }

  dataUrl$: Observable<SafeUrl>;

  ngOnInit(): void {
    this.dataUrl$ = this.cariaService.getCar();
  }
}
