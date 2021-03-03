import { Component, OnInit } from '@angular/core';
import {NavbarItem} from '../../models';
import {Page} from '../../app-routing.module';

@Component({
  selector: 'caria-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navbarOpen = false;

  items: NavbarItem[] = [
    { link: Page.EXPLORE, label: 'Explore' },
    { link: Page.SLIDER, label: 'Sliders' },
    { link: Page.CANVAS, label: 'Canvas' },
  ];

  constructor() { }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnInit(): void {
  }

}
