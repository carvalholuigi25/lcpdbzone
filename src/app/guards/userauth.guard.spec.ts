import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { UserAuthGuard } from './userauth.guard';
import { AuthService } from '@services/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('UserAuthGuard', () => {
  let guard: UserAuthGuard;
  let authService: any;
  let router: any;

  beforeEach(() => {
    const authServiceSpy = {
      isLoggedIn: vi.fn(),
      isUser: vi.fn(),
      isUserIdDoesMatch: vi.fn()
    };
    const routerSpy = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        UserAuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    guard = TestBed.inject(UserAuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('canActivate', () => {
    it('should allow access when user is logged in and is user role', () => {
      authService.isLoggedIn.mockReturnValue('true');
      authService.isUser.mockReturnValue(true);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(true);
    });

    it('should deny access when user is not logged in', () => {
      authService.isLoggedIn.mockReturnValue(null);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should deny access when user is not user role', () => {
      authService.isLoggedIn.mockReturnValue('true');
      authService.isUser.mockReturnValue(false);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('should deny access when user check fails', () => {
      authService.isLoggedIn.mockReturnValue('true');
      authService.isUser.mockReturnValue(null);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(false);
    });
  });
});
