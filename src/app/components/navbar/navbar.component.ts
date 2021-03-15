import { Component, OnInit } from '@angular/core';
import {NavbarItem} from '../../models';
import {Page} from '../../app-routing.module';

@Component({
  selector: 'caria-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  items: NavbarItem[] = [
    { link: Page.EXPLORE, label: 'Explore' },
    { link: Page.SLIDER, label: 'Sliders' },
    { link: Page.CANVAS, label: 'Canvas' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
