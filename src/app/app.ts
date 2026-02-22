import { Component, DOCUMENT, Inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { SharedModule } from './modules';
import { Admsupport } from "./pages/admin/admsupport/admsupport";

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule, SharedModule, Admsupport],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lcpdbzone');
  private routerSub!: Subscription;

  currentUrl: string = '';  
  aryUrlAuths: string[] = ['/auth/', '/auth/login', '/auth/register', '/auth/forgotpass'];
  aryUrlErrors: string[] = ['/errors/', '/errors/notfound', '/errors/unauth'];
  hideSidebar: boolean = true;
  hideNavbar: boolean = true;
  hideSidebarDef: boolean = true;
  hideNavbarDef: boolean = true;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) {
    const localStorage = this.document.defaultView?.localStorage;

    this.hideSidebar = localStorage?.getItem("sidebarHidden") === "true";
    this.hideNavbar = localStorage?.getItem("navbarHidden") === "true";

    if(localStorage) {
      localStorage.setItem("sidebarHidden", ""+this.hideSidebarDef);
      localStorage.setItem("navbarHidden", ""+this.hideNavbarDef);
    }
  }

  ngOnInit() {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;

        console.log('Current URL:', this.currentUrl);
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  toggleSidebar() {
    this.hideSidebar = !this.hideSidebar;
    this.hideNavbar = !this.hideNavbar;
    this.document.defaultView?.localStorage.setItem("sidebarHidden", ""+this.hideSidebar);
    this.document.defaultView?.localStorage.setItem("navbarHidden", ""+this.hideNavbar);
  }
}
