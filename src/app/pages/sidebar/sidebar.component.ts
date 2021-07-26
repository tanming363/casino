import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  constructor() { }

  navItems = [
    {
      displayName: 'Home',
      route: '/home'
    },
    {
      displayName: 'Games',
      route: '/games'
    },
  ]

  expand: boolean = false;
  expandSidebar() {
    this.expand = !this.expand
  }
}
