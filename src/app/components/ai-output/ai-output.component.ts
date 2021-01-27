import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {CariaService} from '../../services/caria-service/caria.service';
import {SafeUrl} from '@angular/platform-browser';
import {Subscription} from 'rxjs';

@Component({
  selector: 'caria-ai-output',
  templateUrl: './ai-output.component.html',
  styleUrls: ['./ai-output.component.scss']
})
export class AiOutputComponent implements OnInit, OnDestroy {
  constructor(private cariaService: CariaService, private ngZone: NgZone) { }

  dataUrl: SafeUrl;

  getSubscription: Subscription;

  ngOnInit(): void {
    this.getSubscription = this.cariaService.getCar().subscribe(imageUrl => {
      this.ngZone.run(() => {
        this.dataUrl = imageUrl;
      });
    });
  }

  ngOnDestroy(): void {
    this.getSubscription.unsubscribe();
  }
}
