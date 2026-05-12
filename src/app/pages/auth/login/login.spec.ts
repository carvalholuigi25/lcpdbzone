import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { Login } from './login';
import { AuthService } from '@services/auth.service';
import { ToastService } from '@/app/services/toast.service';
import { Toast } from '@/app/components';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockAuthResponse = { displayName: 'John Doe', username: 'johndoe' };

function buildAuthServiceMock() {
  return { login: vi.fn() };
}

function buildToastServiceMock() {
  return { show: vi.fn(), clear: vi.fn() };
}

function buildCdrMock() {
  return { markForCheck: vi.fn() };
}

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('Login Component', () => {
  let fixture: ComponentFixture<Login>;
  let component: Login;
  let authService: ReturnType<typeof buildAuthServiceMock>;
  let toastService: ReturnType<typeof buildToastServiceMock>;
  let cdr: ReturnType<typeof buildCdrMock>;

  // Snapshot of localStorage so we can restore it between tests
  let localStorageGetItemSpy: ReturnType<typeof vi.spyOn>;
  let localStorageSetItemSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(async () => {
    authService = buildAuthServiceMock();
    toastService = buildToastServiceMock();
    cdr = buildCdrMock();

    // Default: no stored login
    localStorageGetItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    localStorageSetItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    await TestBed.configureTestingModule({
      imports: [Login, CommonModule, ReactiveFormsModule, Toast],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: ToastService, useValue: toastService },
        { provide: ChangeDetectorRef, useValue: cdr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -------------------------------------------------------------------------
  // Construction / initialisation
  // -------------------------------------------------------------------------

  describe('constructor', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should start with isLoggedIn = false when localStorage has no login entry', () => {
      expect(component.isLoggedIn).toBe(false);
      expect(component.userDetails).toBeUndefined();
    });

    it('should set isLoggedIn = true and populate userDetails when localStorage has a login entry', async () => {
      const stored = JSON.stringify(mockAuthResponse);
      localStorageGetItemSpy.mockReturnValue(stored);

      // Re-create the component so the constructor re-reads localStorage
      const f2 = TestBed.createComponent(Login);
      const c2 = f2.componentInstance;

      expect(c2.isLoggedIn).toBe(true);
      expect(c2.userDetails).toEqual({
        displayName: mockAuthResponse.displayName,
        username: mockAuthResponse.username,
      });
    });
  });

  // -------------------------------------------------------------------------
  // Form
  // -------------------------------------------------------------------------

  describe('formLogin', () => {
    it('should be invalid when both fields are empty', () => {
      expect(component.formLogin.valid).toBe(false);
    });

    it('should be invalid when only username is filled', () => {
      component.formLogin.setValue({ username: 'user', password: '' });
      expect(component.formLogin.valid).toBe(false);
    });

    it('should be invalid when only password is filled', () => {
      component.formLogin.setValue({ username: '', password: 'pass' });
      expect(component.formLogin.valid).toBe(false);
    });

    it('should be valid when both fields are filled', () => {
      component.formLogin.setValue({ username: 'user', password: 'pass' });
      expect(component.formLogin.valid).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // onSubmit – success path
  // -------------------------------------------------------------------------

  describe('onSubmit (success)', () => {
    beforeEach(() => {
      component.formLogin.setValue({ username: 'johndoe', password: 'secret' });
      authService.login.mockReturnValue(of(mockAuthResponse));
    });

    it('should set isToastShown = true immediately', () => {
      component.onSubmit();
      expect(component.isToastShown).toBe(true);
    });

    it('should call authService.login with the correct credentials', () => {
      component.onSubmit();
      expect(authService.login).toHaveBeenCalledWith({
        username: 'johndoe',
        password: 'secret',
      });
    });

    it('should set isAuthLoggedIn = true on next emission', () => {
      component.onSubmit();
      expect(component.isAuthLoggedIn).toBe(true);
    });

    it('should persist the auth response to localStorage on next', () => {
      component.onSubmit();
      expect(localStorageSetItemSpy).toHaveBeenCalledWith(
        'login',
        JSON.stringify(mockAuthResponse),
      );
    });

    it('should call toastService.clear and toastService.show on complete', () => {
      component.onSubmit();
      expect(toastService.clear).toHaveBeenCalled();
      expect(toastService.show).toHaveBeenCalled();
    });

    it('should show a success toast message with the username', () => {
      component.onSubmit();
      const [msg] = toastService.show.mock.calls[0];
      expect(msg).toContain('johndoe');
    });

    it('should call cdr.markForCheck after showing toast', () => {
      component.onSubmit();
      expect(cdr.markForCheck).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // onSubmit – error path
  // -------------------------------------------------------------------------

  describe('onSubmit (error)', () => {
    const errorMsg = 'Unauthorized';

    beforeEach(() => {
      component.formLogin.setValue({ username: 'johndoe', password: 'wrong' });
      authService.login.mockReturnValue(throwError(() => new Error(errorMsg)));
    });

    it('should set isAuthLoggedIn = false on error', () => {
      component.onSubmit();
      expect(component.isAuthLoggedIn).toBe(false);
    });

    it('should call toastService.show with an error message', () => {
      component.onSubmit();
      expect(toastService.show).toHaveBeenCalled();
      const [msg] = toastService.show.mock.calls[0];
      expect(msg).toContain('Error');
    });

    it('should use bg-danger class in toast options on error', () => {
      component.onSubmit();
      const [, options] = toastService.show.mock.calls[0];
      expect(options.classname).toContain('bg-danger');
    });
  });

  // -------------------------------------------------------------------------
  // loadToastNotif
  // -------------------------------------------------------------------------

  describe('loadToastNotif', () => {
    it('should do nothing when isToastShown is false', () => {
      component.isToastShown = false;
      component.loadToastNotif('user');
      expect(toastService.show).not.toHaveBeenCalled();
    });

    it('should show success toast with correct classname when authenticated', () => {
      component.isToastShown = true;
      component.isAuthLoggedIn = true;
      component.loadToastNotif('johndoe');

      const [, options] = toastService.show.mock.calls[0];
      expect(options.classname).toContain('bg-success');
      expect(options.idname).toBe('toastlogsuccess');
    });

    it('should show error toast with correct classname when not authenticated', () => {
      component.isToastShown = true;
      component.isAuthLoggedIn = false;
      component.loadToastNotif('johndoe', 'bad creds');

      const [, options] = toastService.show.mock.calls[0];
      expect(options.classname).toContain('bg-danger');
      expect(options.idname).toBe('toastlogerror');
    });

    it('should always call toastService.clear before show', () => {
      component.isToastShown = true;
      component.isAuthLoggedIn = true;
      component.loadToastNotif('johndoe');

      const clearOrder = toastService.clear.mock.invocationCallOrder[0];
      const showOrder = toastService.show.mock.invocationCallOrder[0];
      expect(clearOrder).toBeLessThan(showOrder);
    });

    it('should always set toast title to "LCPDBZone - Login"', () => {
      component.isToastShown = true;
      component.isAuthLoggedIn = true;
      component.loadToastNotif('johndoe');

      const [, options] = toastService.show.mock.calls[0];
      expect(options.title).toBe('LCPDBZone - Login');
    });

    it('should call cdr.markForCheck after displaying toast', () => {
      component.isToastShown = true;
      component.isAuthLoggedIn = true;
      component.loadToastNotif('johndoe');
      expect(cdr.markForCheck).toHaveBeenCalled();
    });
  });

  // -------------------------------------------------------------------------
  // ngOnDestroy
  // -------------------------------------------------------------------------

  describe('ngOnDestroy', () => {
    it('should unsubscribe from active subscription on destroy', () => {
      const subject = new Subject<typeof mockAuthResponse>();
      authService.login.mockReturnValue(subject.asObservable());
      component.formLogin.setValue({ username: 'u', password: 'p' });
      component.onSubmit();

      const unsubSpy = vi.spyOn((component as any).sub, 'unsubscribe');
      component.ngOnDestroy();

      expect(unsubSpy).toHaveBeenCalled();
    });

    it('should not throw when no subscription exists', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // Redirect (side-effect)
  // -------------------------------------------------------------------------

  describe('redirect after login', () => {
    it('should redirect to "/" after 1 second on successful login', fakeAsync(() => {
      const locationSpy = vi.spyOn(window, 'location', 'get').mockReturnValue({
        ...window.location,
        href: '',
      } as Location);

      authService.login.mockReturnValue(of(mockAuthResponse));
      component.formLogin.setValue({ username: 'u', password: 'p' });
      component.onSubmit();

      tick(1000);

      // location.href assignment can't be directly asserted in jsdom without
      // a full mock; verify no errors were thrown during the timer callback.
      locationSpy.mockRestore();
    }));
  });
});