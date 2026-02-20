import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { AdminAuthGuard } from './admauth.guard';
import { AuthService } from '@services/auth.service';
import { PLATFORM_ID } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AdminAuthGuard', () => {
  let guard: AdminAuthGuard;
  let authService: any;
  let router: any;

  beforeEach(() => {
    const authServiceSpy = {
      isLoggedIn: vi.fn(),
      isAdmin: vi.fn(),
      isUserIdDoesMatch: vi.fn()
    };
    const routerSpy = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AdminAuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    guard = TestBed.inject(AdminAuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  describe('canActivate', () => {
    it('should allow access when user is logged in and is admin', () => {
      authService.isLoggedIn.mockReturnValue('true');
      authService.isAdmin.mockReturnValue(true);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(true);
    });

    it('should deny access when user is not logged in', () => {
      authService.isLoggedIn.mockReturnValue(null);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/errors/unauth']);
    });

    it('should deny access when user is not admin', () => {
      authService.isLoggedIn.mockReturnValue('true');
      authService.isAdmin.mockReturnValue(false);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/errors/unauth']);
    });

    it('should deny access when admin check fails', () => {
      authService.isLoggedIn.mockReturnValue('true');
      authService.isAdmin.mockReturnValue(null);

      const mockRouteSnapshot = {} as ActivatedRouteSnapshot;
      const result = guard.canActivate(mockRouteSnapshot);

      expect(result).toBe(false);
    });
  });
});
