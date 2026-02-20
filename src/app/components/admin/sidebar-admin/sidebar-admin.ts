import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-admin',
  imports: [RouterModule],
  templateUrl: './sidebar-admin.html',
  styleUrl: './sidebar-admin.scss',
})
export class SidebarAdmin {
  @Input() hideSidebar: boolean = false;

  constructor() {
    
  }

  ngOnInit() {
    
  }
}
