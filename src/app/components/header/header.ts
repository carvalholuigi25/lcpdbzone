import { Component, DOCUMENT, Inject } from '@angular/core';
import { AuthResponse } from '@models/auth';
import { AuthService } from '@services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  userDetails?: AuthResponse;

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

  doLogout() {
    if(localStorage) {
      localStorage.removeItem("login");
    }

    this.authService.logout();
    location.reload();
  }
}
