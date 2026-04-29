import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

import { AuthService } from '@services/auth.service';
import { ToastService } from '@/app/services/toast.service';
import { Toast } from '@/app/components';
import { AuthResponse } from '@models/auth';
import { Login } from './login';

beforeAll(async () => {
    try {
      if (typeof process !== 'undefined' && process.versions?.node) {
        const { readFileSync } = await import('node:fs');
        const { ɵresolveComponentResources: resolveComponentResources } =
          await import('@angular/core');

        await resolveComponentResources(url =>
          Promise.resolve(readFileSync(new URL(url, import.meta.url), 'utf-8'))
        );
      }
    } catch {
      return;
    }
  });

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let toastServiceMock: { show: ReturnType<typeof vi.fn>; clear: ReturnType<typeof vi.fn> };
  let cdrMock: { markForCheck: ReturnType<typeof vi.fn> };
  let mockDocument: Partial<Document>;
  let mockLocalStorage: { [key: string]: string };

  const mockAuthResponse: AuthResponse = {
    displayName: 'Admin',
    username: 'admin',
  };

  beforeEach(async () => {
    mockLocalStorage = {};

    const localStorageMock: Storage = {
      getItem: (key: string) => mockLocalStorage[key] ?? null,
      setItem: (key: string, value: string) => { mockLocalStorage[key] = value; },
      removeItem: (key: string) => { delete mockLocalStorage[key]; },
      clear: () => { mockLocalStorage = {}; },
      key: (_index: number) => null,
      length: 0,
    };

    mockDocument = {
      defaultView: {
        localStorage: localStorageMock,
      } as Window & typeof globalThis,
    };

    authServiceMock = { login: vi.fn() };
    toastServiceMock = { show: vi.fn(), clear: vi.fn() };
    cdrMock = { markForCheck: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login, CommonModule, ReactiveFormsModule, Toast],
      providers: [
        { provide: DOCUMENT, useValue: mockDocument },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ─── Constructor / Initialization ────────────────────────────────────────────

  describe('constructor', () => {

    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize isLoggedIn as false when localStorage has no login entry', () => {
      expect(component.isLoggedIn).toBe(false);
    });

    it('should initialize userDetails as undefined when localStorage has no login entry', () => {
      expect(component.userDetails).toBeUndefined();
    });

    it('should set isLoggedIn to true when login entry exists in localStorage', async () => {
      mockLocalStorage['login'] = JSON.stringify(mockAuthResponse);

      const newFixture = TestBed.createComponent(Login);
      const newComponent = newFixture.componentInstance as any;

      expect(newComponent.isLoggedIn).toBe(true);
    });

    it('should populate userDetails from localStorage when login entry exists', async () => {
      mockLocalStorage['login'] = JSON.stringify(mockAuthResponse);

      const newFixture = TestBed.createComponent(Login);
      const newComponent = newFixture.componentInstance as any;

      expect(newComponent.userDetails).toEqual({
        displayName: mockAuthResponse.displayName,
        username: mockAuthResponse.username,
      });
    });

    it('should default isAuthLoggedIn to false', () => {
      expect(component.isAuthLoggedIn).toBe(false);
    });

    it('should default isToastShown to false', () => {
      expect(component.isToastShown).toBe(false);
    });
  });

  // ─── Form ─────────────────────────────────────────────────────────────────────

  describe('formLogin', () => {
    it('should initialize with empty username and password', () => {
      expect(component.formLogin.value).toEqual({ username: '', password: '' });
    });

    it('should be invalid when both fields are empty', () => {
      expect(component.formLogin.valid).toBe(false);
    });

    it('should be valid when both fields are filled', () => {
      component.formLogin.setValue({ username: 'testuser', password: 'secret' });
      expect(component.formLogin.valid).toBe(true);
    });

    it('should be invalid when only username is provided', () => {
      component.formLogin.setValue({ username: 'testuser', password: '' });
      expect(component.formLogin.valid).toBe(false);
    });

    it('should be invalid when only password is provided', () => {
      component.formLogin.setValue({ username: '', password: 'secret' });
      expect(component.formLogin.valid).toBe(false);
    });
  });

  // ─── onSubmit ────────────────────────────────────────────────────────────────

  describe('onSubmit()', () => {
    beforeEach(() => {
      component.formLogin.setValue({ username: 'testuser', password: 'secret' });
    });

    it('should set isToastShown to true on submit', () => {
      authServiceMock.login.mockReturnValue(of(mockAuthResponse));
      component.onSubmit();
      expect(component.isToastShown).toBe(true);
    });

    it('should call authService.login with correct credentials', () => {
      authServiceMock.login.mockReturnValue(of(mockAuthResponse));
      component.onSubmit();
      expect(authServiceMock.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'secret',
      });
    });

    describe('on successful login (next)', () => {
      beforeEach(() => {
        authServiceMock.login.mockReturnValue(of(mockAuthResponse));
      });

      it('should set isAuthLoggedIn to true', () => {
        component.onSubmit();
        expect(component.isAuthLoggedIn).toBe(true);
      });

      it('should store the response in localStorage', () => {
        component.onSubmit();
        expect(mockLocalStorage['login']).toBe(JSON.stringify(mockAuthResponse));
      });

      it('should redirect to "/" after 1 second', async () => {
        vi.useFakeTimers();

        const locationMock = { href: '' } as Location;
        vi.stubGlobal('location', locationMock);

        component.onSubmit();
        await vi.advanceTimersByTimeAsync(1000);

        expect(locationMock.href).toBe('/');

        vi.useRealTimers();
      });
    });

    describe('on login error', () => {
      const mockError = 'Unauthorized';

      beforeEach(() => {
        authServiceMock.login.mockReturnValue(throwError(() => mockError));
      });

      it('should set isAuthLoggedIn to false', () => {
        component.onSubmit();
        expect(component.isAuthLoggedIn).toBe(false);
      });

      it('should call loadToastNotif with username and error', () => {
        const spy = vi.spyOn(component, 'loadToastNotif');
        component.onSubmit();
        expect(spy).toHaveBeenCalledWith('testuser', mockError);
      });
    });

    describe('on login complete', () => {
      it('should set isAuthLoggedIn to true', () => {
        authServiceMock.login.mockReturnValue(of(mockAuthResponse));
        component.onSubmit();
        expect(component.isAuthLoggedIn).toBe(true);
      });

      it('should call loadToastNotif with username and empty error string on complete', () => {
        const spy = vi.spyOn(component, 'loadToastNotif');
        authServiceMock.login.mockReturnValue(of(mockAuthResponse));
        component.onSubmit();
        expect(spy).toHaveBeenCalledWith('testuser', '');
      });
    });

    describe('when authService.login throws synchronously', () => {
      it('should catch the error and set isAuthLoggedIn to false', () => {
        authServiceMock.login.mockImplementation(() => { throw new Error('Sync error'); });
        component.onSubmit();
        expect(component.isAuthLoggedIn).toBe(false);
      });

      it('should call loadToastNotif with the caught error message', () => {
        const spy = vi.spyOn(component, 'loadToastNotif');
        authServiceMock.login.mockImplementation(() => { throw new Error('Sync error'); });
        component.onSubmit();
        expect(spy).toHaveBeenCalledWith('testuser', 'Error: Sync error');
      });
    });
  });

  // ─── loadToastNotif ───────────────────────────────────────────────────────────

  describe('loadToastNotif()', () => {
    beforeEach(() => {
      component.isToastShown = true;
    });

    it('should not call toastService when isToastShown is false', () => {
      component.isToastShown = false;
      component.loadToastNotif('testuser', 'some error');
      expect(toastServiceMock.clear).not.toHaveBeenCalled();
      expect(toastServiceMock.show).not.toHaveBeenCalled();
    });

    describe('when login succeeded (isAuthLoggedIn = true)', () => {
      beforeEach(() => {
        component.isAuthLoggedIn = true;
      });

      it('should call toastService.clear()', () => {
        component.loadToastNotif('testuser');
        expect(toastServiceMock.clear).toHaveBeenCalled();
      });

      it('should call toastService.show with success message', () => {
        component.loadToastNotif('testuser');
        expect(toastServiceMock.show).toHaveBeenCalledWith(
          'Logged in as testuser',
          expect.objectContaining({
            title: 'LCPDBZone - Login',
            classname: 'bg-success text-white',
            idname: 'toastlogsuccess',
            delay: 500,
          })
        );
      });

      it('should trigger change detection', () => {
        component.loadToastNotif('testuser');
        expect(cdrMock.markForCheck).toHaveBeenCalled();
      });
    });

    describe('when login failed (isAuthLoggedIn = false)', () => {
      beforeEach(() => {
        component.isAuthLoggedIn = false;
      });

      it('should call toastService.show with error message', () => {
        component.loadToastNotif('testuser', 'Bad credentials');
        expect(toastServiceMock.show).toHaveBeenCalledWith(
          'Error: Bad credentials',
          expect.objectContaining({
            classname: 'bg-danger text-white',
            idname: 'toastlogerror',
          })
        );
      });

      it('should trigger change detection', () => {
        component.loadToastNotif('testuser', 'err');
        expect(cdrMock.markForCheck).toHaveBeenCalled();
      });
    });

    it('should use a numeric id (1) when uuid is disabled', () => {
      component.isAuthLoggedIn = true;
      component.loadToastNotif('testuser');
      expect(toastServiceMock.show).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ id: 1 })
      );
    });
  });

  // ─── ngOnDestroy ──────────────────────────────────────────────────────────────

  describe('ngOnDestroy()', () => {
    it('should unsubscribe from the subscription if it exists', () => {
      const subject = new Subject<AuthResponse>();
      authServiceMock.login.mockReturnValue(subject.asObservable());

      component.formLogin.setValue({ username: 'u', password: 'p' });
      component.onSubmit(); // sets this.sub

      const unsubSpy = vi.spyOn((component as any).sub, 'unsubscribe');
      component.ngOnDestroy();

      expect(unsubSpy).toHaveBeenCalled();
    });

    it('should not throw when there is no subscription', () => {
      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});