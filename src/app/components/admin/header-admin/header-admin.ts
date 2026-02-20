import { AuthResponse } from '@/app/models';
import { AuthService } from '@/app/services';
import { CommonModule } from '@angular/common';
import { Component, DOCUMENT, Inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Modal } from '../../modal/modal';

@Component({
  selector: 'app-header-admin',
  imports: [RouterModule, CommonModule, Modal],
  templateUrl: './header-admin.html',
  styleUrl: './header-admin.scss',
})
export class HeaderAdmin {
  @Input() hideNavbar: boolean = false;
  userDetails?: AuthResponse;
  isSearchOpen: boolean = false;
  isNotificationsOpen: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document, private authService: AuthService) {
    const localStorage = this.document.defaultView?.localStorage;

    if(localStorage && localStorage.getItem("login")) {
      const {id, displayName, role, username} = JSON.parse(localStorage.getItem("login")!);
      this.userDetails = {
        id: id,
        displayName: displayName,
        role: role,
        username: username
      }
    }
  }

  ngOnInit() {
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  toggleNotifications(): void {
    this.isNotificationsOpen = !this.isNotificationsOpen;
  }

  closeSearch(): void {
    this.isSearchOpen = false;
  }

  doLogout() {
    if(localStorage) {
      localStorage.removeItem("login");
    }

    this.authService.logout();
    location.reload();
  }
}
