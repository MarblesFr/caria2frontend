import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'caria-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navbarOpen = false;
  constructor() { }

  toggleNavbar(): void {
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnInit(): void {
  }

}
