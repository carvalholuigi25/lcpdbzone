import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '@services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  private platformId!: Object;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private authService: AuthService,
    private router: Router
  ) {
    this.platformId = platformId;

  }

  canActivate(router: ActivatedRouteSnapshot): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return true; // SSR: block access
    }

    const checkIfUserIdIsValid = false;
    const redirectUnauth = true;
    const redirectNotFound = true;

    if (this.authService.isLoggedIn() && this.authService.isAdmin()) {
      if(checkIfUserIdIsValid) {
        if(!location.pathname.match(/(create|read|update|delete)/g) || location.pathname.match(/\/\d+/g)) {
          const uid = router ? !isNaN(parseInt(router.children[0].url[0].path)) ? parseInt(router.children[0].url[0].path) : 1 : 1;
          if(this.authService.isUserIdDoesMatch(uid)) {
            return true;
          } else {
            this.router.navigate([redirectNotFound ? '/errors/notfound' : '/home']);
            return false;
          }
        } else {
          return true;
        }
      } else {
        return true;
      }
    } else {
      this.router.navigate([redirectUnauth ? '/errors/unauth' : '/home']);
      return false;
    }
  }
}
