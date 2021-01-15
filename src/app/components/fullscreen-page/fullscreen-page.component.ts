import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'caria-fullscreen-page',
  templateUrl: './fullscreen-page.component.html',
  styleUrls: ['./fullscreen-page.component.css']
})
export class FullscreenPageComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  generateNewOutput(): void {
  }

  startEditing(): void {
    this.router.navigate(['/slider']);
  }

}
