import {Component, NgZone, OnInit} from '@angular/core';
import {CariaService} from '../../services/caria-service/caria.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'caria-ai-output',
  templateUrl: './ai-output.component.html',
  styleUrls: ['./ai-output.component.scss']
})
export class AiOutputComponent implements OnInit {

  constructor(private cariaService: CariaService, private ngZone: NgZone) { }

  dataUrl: SafeUrl;

  ngOnInit(): void {
    this.cariaService.getCar().subscribe(imageUrl => {
      this.ngZone.run(() => {
        this.dataUrl = imageUrl;
      });
    });
  }
}
